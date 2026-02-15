# Message Queues & Event Streaming

## 🎯 Overview

Message queues are intermediate buffers that enable asynchronous communication between services. They decouple producers from consumers and handle traffic spikes, failures, and retry logic.

---

## 1️⃣ When to Use Message Queues

### ✅ Use Cases:
1. **Asynchronous Processing**: Send email, generate report (don't block user request)
2. **Load Leveling**: Handle traffic spikes (queue absorbs burst, workers process at steady rate)
3. **Service Decoupling**: Producer doesn't need to know consumer details
4. **Event-Driven Architecture**: Microservices react to events
5. **Guaranteed Delivery**: Persist messages until successfully processed
6. **Fan-out**: One message to multiple consumers (pub/sub)

### ❌ When NOT to Use:
- Real-time request-response (use REST/gRPC instead)
- Need immediate result (synchronous processing)
- Very low latency required (<1ms)

---

## 2️⃣ Message Queue Patterns

### **Pattern 1: Point-to-Point (Work Queue)**

```
Producer -> [Queue] -> Consumer 1
                   -> Consumer 2
                   -> Consumer 3

- One message consumed by ONE consumer
- Load balancing across multiple workers
- Example: Image processing, order fulfillment
```

```javascript
// Producer (sends work)
async function createOrder(orderData) {
  await queue.send('order-processing', {
    orderId: orderData.id,
    userId: orderData.userId,
    items: orderData.items
  });
  
  return { status: 'Order received, processing...' };
}

// Consumer (processes work)
queue.subscribe('order-processing', async (message) => {
  const { orderId, userId, items } = message.data;
  
  // Process order
  await processPayment(orderId);
  await updateInventory(items);
  await sendConfirmationEmail(userId);
  
  // Acknowledge message (remove from queue)
  message.ack();
});
```

---

### **Pattern 2: Pub/Sub (Fan-Out)**

```
Publisher -> [Topic] -> Subscriber 1 (Email Service)
                    -> Subscriber 2 (Analytics)
                    -> Subscriber 3 (Notification Service)

- One message delivered to ALL subscribers
- Services don't know about each other
- Example: User registration event
```

```javascript
// Publisher
async function registerUser(userData) {
  await db.createUser(userData);
  
  // Publish event (multiple services will react)
  await pubsub.publish('user.registered', {
    userId: userData.id,
    email: userData.email,
    timestamp: Date.now()
  });
}

// Subscriber 1: Email Service
pubsub.subscribe('user.registered', async (event) => {
  await sendWelcomeEmail(event.email);
});

// Subscriber 2: Analytics
pubsub.subscribe('user.registered', async (event) => {
  await trackSignup(event.userId);
});

// Subscriber 3: Notification Service
pubsub.subscribe('user.registered', async (event) => {
  await sendPushNotification(event.userId, 'Welcome!');
});
```

---

### **Pattern 3: Request-Reply (RPC over Queue)**

```
Client -> [Request Queue] -> Server
       <- [Reply Queue] <--

- Client waits for response
- Useful for distributed RPC
```

```javascript
// Client
async function callRemoteService(request) {
  const correlationId = uuidv4();
  const replyQueue = `reply-${correlationId}`;
  
  // Send request
  await queue.send('service-requests', {
    data: request,
    replyTo: replyQueue,
    correlationId
  });
  
  // Wait for response
  return new Promise((resolve) => {
    queue.subscribe(replyQueue, (message) => {
      if (message.correlationId === correlationId) {
        resolve(message.data);
        message.ack();
      }
    });
  });
}
```

---

### **Pattern 4: Priority Queue**

```
High Priority Messages -> [Priority Queue] -> Consumer
Normal Priority Messages ->

- Critical messages processed first
- Example: VIP customer orders, alerts
```

```javascript
await queue.send('order-processing', orderData, {
  priority: order.isVIP ? 'high' : 'normal'
});
```

---

### **Pattern 5: Dead Letter Queue (DLQ)**

```
[Main Queue] -> Consumer (fails 3 times) -> [Dead Letter Queue] -> Manual Review

- Failed messages sent to DLQ after max retries
- Prevents infinite retry loops
- Allows investigation of failures
```

```javascript
queue.subscribe('order-processing', async (message) => {
  try {
    await processOrder(message.data);
    message.ack();
  } catch (error) {
    if (message.retryCount >= 3) {
      // Move to dead letter queue
      await dlq.send('order-processing-dlq', message);
      message.ack();
    } else {
      // Retry later
      message.nack();
    }
  }
});
```

---

## 3️⃣ Popular Message Queue Technologies

### **RabbitMQ**

**Best for**: Traditional message queuing, complex routing

```javascript
const amqp = require('amqplib');

// Producer
async function sendMessage() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  const queue = 'tasks';
  await channel.assertQueue(queue, { durable: true });
  
  channel.sendToQueue(queue, Buffer.from(JSON.stringify({
    task: 'resize-image',
    imageUrl: 'https://...'
  })), {
    persistent: true  // Survive broker restart
  });
  
  console.log('Message sent');
  await channel.close();
  await connection.close();
}

// Consumer
async function consumeMessages() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  const queue = 'tasks';
  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1);  // Process one message at a time
  
  channel.consume(queue, async (message) => {
    const task = JSON.parse(message.content.toString());
    console.log('Processing:', task);
    
    // Simulate work
    await processTask(task);
    
    // Acknowledge
    channel.ack(message);
  }, { noAck: false });
}
```

**RabbitMQ Features:**
- ✅ AMQP protocol (standard)
- ✅ Complex routing (topic exchanges, headers)
- ✅ Message priority
- ✅ Dead letter queues
- ✅ TTL (time-to-live)
- ❌ Lower throughput (~20K msg/sec per broker)

---

### **Apache Kafka**

**Best for**: High-throughput event streaming, real-time analytics

```javascript
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka1:9092', 'kafka2:9092']
});

// Producer
async function produceEvent() {
  const producer = kafka.producer();
  await producer.connect();
  
  await producer.send({
    topic: 'user-events',
    messages: [
      {
        key: 'user-123',  // Partitioning key
        value: JSON.stringify({
          event: 'page_view',
          userId: '123',
          page: '/products',
          timestamp: Date.now()
        })
      }
    ]
  });
  
  await producer.disconnect();
}

// Consumer
async function consumeEvents() {
  const consumer = kafka.consumer({ groupId: 'analytics-service' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-events', fromBeginning: false });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log('Event:', event);
      
      // Process event
      await trackAnalytics(event);
    }
  });
}
```

**Kafka Features:**
- ✅ Extreme throughput (1M+ msg/sec)
- ✅ Horizontal scaling (partitions)
- ✅ Message retention (replay events)
- ✅ Exactly-once semantics
- ✅ Stream processing (Kafka Streams)
- ❌ Complex setup/operations
- ❌ Not ideal for traditional queuing (no message deletion on consume)

---

### **AWS SQS (Simple Queue Service)**

**Best for**: AWS-native, serverless queuing

```javascript
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ region: 'us-east-1' });

// Send message
async function sendMessage() {
  await sqs.sendMessage({
    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/123456/my-queue',
    MessageBody: JSON.stringify({
      orderId: '123',
      userId: '456'
    }),
    DelaySeconds: 0
  }).promise();
}

// Receive and process
async function pollMessages() {
  while (true) {
    const { Messages } = await sqs.receiveMessage({
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/123456/my-queue',
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20  // Long polling
    }).promise();
    
    if (!Messages) continue;
    
    for (const message of Messages) {
      const data = JSON.parse(message.Body);
      await processOrder(data);
      
      // Delete message
      await sqs.deleteMessage({
        QueueUrl: 'https://...',
        ReceiptHandle: message.ReceiptHandle
      }).promise();
    }
  }
}
```

**SQS Features:**
- ✅ Fully managed (no servers)
- ✅ Auto-scaling
- ✅ Cheap ($0.40 per million requests)
- ✅ FIFO queues available
- ❌ Limited throughput (3K msg/sec standard, 300 msg/sec FIFO)
- ❌ No pub/sub (use SNS instead)

---

### **Redis Streams**

**Best for**: Simple event streaming with Redis infrastructure

```javascript
const Redis = require('ioredis');
const redis = new Redis();

// Producer
async function addEvent() {
  await redis.xadd(
    'user-events',
    '*',  // Auto-generate ID
    'event', 'signup',
    'userId', '123',
    'timestamp', Date.now()
  );
}

// Consumer Group
async function consumeEvents() {
  // Create consumer group
  await redis.xgroup('CREATE', 'user-events', 'analytics-group', '0', 'MKSTREAM');
  
  while (true) {
    // Read new messages
    const results = await redis.xreadgroup(
      'GROUP', 'analytics-group', 'consumer-1',
      'COUNT', 10,
      'BLOCK', 5000,
      'STREAMS', 'user-events', '>'
    );
    
    if (!results) continue;
    
    for (const [stream, messages] of results) {
      for (const [id, fields] of messages) {
        const event = parseFields(fields);
        await processEvent(event);
        
        // Acknowledge
        await redis.xack('user-events', 'analytics-group', id);
      }
    }
  }
}
```

**Redis Streams Features:**
- ✅ Simple (if already using Redis)
- ✅ Consumer groups
- ✅ Message persistence
- ✅ Fast (in-memory)
- ❌ Limited by single Redis instance throughput
- ❌ No built-in partitioning

---

## 4️⃣ Queue Comparison

| Feature | RabbitMQ | Kafka | SQS | Redis Streams |
|---------|----------|-------|-----|---------------|
| **Throughput** | 20K/sec | 1M+/sec | 3K/sec | 100K/sec |
| **Latency** | <10ms | ~5ms | ~100ms | <1ms |
| **Message Retention** | Until consumed | Days/weeks | 14 days | Indefinite |
| **Message Replay** | ❌ | ✅ | ❌ | ✅ |
| **Ordering** | Per queue | Per partition | FIFO queues | ✅ |
| **Use Case** | Task queues | Event streaming | Serverless | Simple streaming |
| **Complexity** | Medium | High | Low | Low |

---

## 5️⃣ Design Patterns & Best Practices

### **1. Idempotency**

Messages may be delivered more than once (at-least-once delivery). Design consumers to be idempotent.

```javascript
// BAD: Not idempotent
async function processOrder(order) {
  await db.query('UPDATE inventory SET quantity = quantity - 1 WHERE product_id = ?', [order.productId]);
}

// GOOD: Idempotent
async function processOrder(order) {
  // Check if already processed
  const existing = await db.query('SELECT * FROM processed_orders WHERE order_id = ?', [order.id]);
  if (existing) return;
  
  // Process (transaction ensures atomicity)
  await db.transaction(async (tx) => {
    await tx.query('UPDATE inventory SET quantity = quantity - 1 WHERE product_id = ?', [order.productId]);
    await tx.query('INSERT INTO processed_orders (order_id) VALUES (?)', [order.id]);
  });
}
```

---

### **2. Message Deduplication**

Prevent duplicate messages from being processed.

```javascript
const processedMessages = new Set();

async function processMessage(message) {
  const messageId = message.id;
  
  // Check if already processed
  if (processedMessages.has(messageId)) {
    console.log('Duplicate message, skipping');
    return;
  }
  
  // Process
  await handleMessage(message);
  
  // Mark as processed
  processedMessages.add(messageId);
  
  // Store in Redis with TTL (garbage collect old IDs)
  await redis.setex(`processed:${messageId}`, 86400, '1');
}
```

---

### **3. Exponential Backoff for Retries**

```javascript
async function processWithRetry(message, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await processMessage(message);
      message.ack();
      return;
    } catch (error) {
      const delay = Math.pow(2, attempt) * 1000;  // 1s, 2s, 4s, 8s, 16s
      console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await sleep(delay);
    }
  }
  
  // Max retries exceeded, send to DLQ
  await dlq.send('failed-messages', message);
  message.ack();
}
```

---

### **4. Message Batching**

Process multiple messages together for efficiency.

```javascript
async function batchProcessor() {
  const batch = [];
  const BATCH_SIZE = 100;
  const BATCH_TIMEOUT = 5000;
  
  let timer = setTimeout(() => processBatch(batch), BATCH_TIMEOUT);
  
  queue.subscribe('events', (message) => {
    batch.push(message);
    
    if (batch.length >= BATCH_SIZE) {
      clearTimeout(timer);
      processBatch(batch);
      batch.length = 0;
      timer = setTimeout(() => processBatch(batch), BATCH_TIMEOUT);
    }
  });
}

async function processBatch(messages) {
  if (messages.length === 0) return;
  
  // Process all messages in one database transaction
  await db.transaction(async (tx) => {
    for (const msg of messages) {
      await tx.query('INSERT INTO events VALUES (?)', [msg.data]);
    }
  });
  
  // Acknowledge all
  messages.forEach(msg => msg.ack());
}
```

---

### **5. Circuit Breaker**

Protect downstream services from cascading failures.

```javascript
class CircuitBreaker {
  constructor() {
    this.state = 'CLOSED';  // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.threshold = 5;
    this.timeout = 60000;  // 1 minute
  }
  
  async execute(fn) {
    if (this.state === 'OPEN') {
      throw new Error('Circuit breaker is OPEN');
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      setTimeout(() => {
        this.state = 'HALF_OPEN';
        this.failureCount = 0;
      }, this.timeout);
    }
  }
}

// Usage
const breaker = new CircuitBreaker();

queue.subscribe('orders', async (message) => {
  try {
    await breaker.execute(() => processOrder(message.data));
    message.ack();
  } catch (error) {
    message.nack();  // Requeue
  }
});
```

---

## 6️⃣ Real-World Example: Video Processing Pipeline

```javascript
// Use case: User uploads video, needs transcoding to multiple formats

// 1. Upload service publishes event
async function handleVideoUpload(req, res) {
  const videoId = uuidv4();
  
  // Upload to S3
  await s3.upload(req.file, `videos/raw/${videoId}.mp4`);
  
  // Publish to Kafka
  await kafka.send({
    topic: 'video-uploaded',
    messages: [{
      key: videoId,
      value: JSON.stringify({
        videoId,
        userId: req.user.id,
        originalUrl: `s3://videos/raw/${videoId}.mp4`,
        timestamp: Date.now()
      })
    }]
  });
  
  res.json({ videoId, status: 'Processing' });
}

// 2. Transcoding workers consume from queue
kafka.subscribe('video-uploaded', async (message) => {
  const { videoId, originalUrl } = JSON.parse(message.value);
  
  const qualities = ['360p', '720p', '1080p'];
  
  for (const quality of qualities) {
    // Add to work queue (RabbitMQ for task distribution)
    await rabbitMQ.send('transcoding-tasks', {
      videoId,
      inputUrl: originalUrl,
      outputQuality: quality,
      outputUrl: `s3://videos/${quality}/${videoId}.mp4`
    }, {
      priority: quality === '360p' ? 10 : 5  // Prioritize low quality (quick preview)
    });
  }
});

// 3. Workers process transcoding
rabbitMQ.subscribe('transcoding-tasks', async (message) => {
  const { videoId, inputUrl, outputQuality, outputUrl } = message.data;
  
  try {
    // Download from S3
    const inputFile = await s3.download(inputUrl);
    
    // Transcode with FFmpeg
    const outputFile = await ffmpeg.transcode(inputFile, { quality: outputQuality });
    
    // Upload result
    await s3.upload(outputFile, outputUrl);
    
    // Publish completion event
    await kafka.send({
      topic: 'video-transcoded',
      messages: [{
        value: JSON.stringify({
          videoId,
          quality: outputQuality,
          url: outputUrl,
          timestamp: Date.now()
        })
      }]
    });
    
    message.ack();
  } catch (error) {
    console.error('Transcoding failed:', error);
    
    if (message.retryCount < 3) {
      message.nack();  // Retry
    } else {
      await dlq.send('failed-transcoding', message);
      message.ack();
    }
  }
});

// 4. Notification service notifies user
kafka.subscribe('video-transcoded', async (message) => {
  const { videoId, quality } = JSON.parse(message.value);
  
  // Check if all qualities done
  const completed = await redis.sadd(`video:${videoId}:completed`, quality);
  const total = await redis.scard(`video:${videoId}:completed`);
  
  if (total === 3) {
    // All done, notify user
    await sendPushNotification(userId, 'Your video is ready!');
  }
});
```

---

## Summary

**When to use what:**
- **RabbitMQ**: Traditional task queues, complex routing, low-medium throughput
- **Kafka**: High-throughput event streaming, analytics, message replay needed
- **SQS**: AWS serverless, simple queuing, don't want to manage infrastructure
- **Redis Streams**: Simple streaming, already using Redis, low latency

**Key takeaways:**
- ✅ Decouple services with async messaging
- ✅ Handle failures with retries, DLQ, circuit breakers
- ✅ Design idempotent consumers (messages may be delivered twice)
- ✅ Use batching for efficiency
- ✅ Monitor queue depth (alert if growing = consumers can't keep up)
