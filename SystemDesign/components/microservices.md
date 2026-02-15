# Microservices Architecture

## 🎯 Overview

Microservices architecture splits a monolithic application into small, independent services that communicate over the network. Each service owns its data and can be deployed independently.

---

## 1️⃣ Monolith vs Microservices

### **Monolithic Architecture**

```
┌─────────────────────────────────────────────┐
│         Single Application                   │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Auth   │  │ Payments │  │ Products │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                              │
│         Single Database                      │
│  ┌──────────────────────────────────────┐   │
│  │     users | products | orders        │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Pros:**
- ✅ Simple to develop and deploy
- ✅ Easy to test (everything in one place)
- ✅ No network latency between components

**Cons:**
- ❌ Tight coupling (change in one module affects others)
- ❌ Hard to scale (must scale entire app, not individual parts)
- ❌ Long deployment cycles (entire app must be redeployed)
- ❌ Technology lock-in (entire app uses same stack)

---

### **Microservices Architecture**

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Auth      │   │  Payments   │   │  Products   │
│   Service   │   │   Service   │   │   Service   │
│             │   │             │   │             │
│ ┌─────────┐ │   │ ┌─────────┐ │   │ ┌─────────┐ │
│ │  Users  │ │   │ │Payments │ │   │ │Products │ │
│ │   DB    │ │   │ │   DB    │ │   │ │   DB    │ │
│ └─────────┘ │   │ └─────────┘ │   │ └─────────┘ │
└─────────────┘   └─────────────┘   └─────────────┘
       │                 │                 │
       └─────────────────┴─────────────────┘
                 API Gateway
```

**Pros:**
- ✅ Independent deployment (update one service without affecting others)
- ✅ Independent scaling (scale only what's needed)
- ✅ Technology flexibility (each service can use different stack)
- ✅ Fault isolation (failure in one service doesn't crash entire system)
- ✅ Team autonomy (different teams own different services)

**Cons:**
- ❌ Distributed system complexity (network failures, latency)
- ❌ Data consistency challenges (no ACID transactions across services)
- ❌ Testing complexity (integration tests harder)
- ❌ Operational overhead (deploy/monitor many services)

---

## 2️⃣ Microservices Communication Patterns

### **Pattern 1: Synchronous (HTTP/REST, gRPC)**

```javascript
// Order Service calls Payment Service via HTTP

async function createOrder(req, res) {
  const order = await db.orders.create(req.body);
  
  // Synchronous call to Payment Service
  const paymentResponse = await axios.post('http://payment-service/api/charge', {
    orderId: order.id,
    amount: order.total,
    userId: order.userId
  });
  
  if (paymentResponse.data.status === 'success') {
    order.status = 'PAID';
    await order.save();
    res.json({ success: true, orderId: order.id });
  } else {
    res.status(400).json({ error: 'Payment failed' });
  }
}
```

**Pros:**
- ✅ Simple (request-response)
- ✅ Immediate result

**Cons:**
- ❌ Tight coupling (caller waits for response)
- ❌ Cascading failures (if payment service is down, order service fails)
- ❌ Higher latency (network roundtrip)

---

### **Pattern 2: Asynchronous (Message Queue/Event Bus)**

```javascript
// Order Service publishes event, Payment Service subscribes

// Order Service
async function createOrder(req, res) {
  const order = await db.orders.create({
    ...req.body,
    status: 'PENDING'
  });
  
  // Publish event (non-blocking)
  await eventBus.publish('order.created', {
    orderId: order.id,
    userId: order.userId,
    amount: order.total
  });
  
  // Return immediately
  res.json({ success: true, orderId: order.id, status: 'PENDING' });
}

// Payment Service (separate process)
eventBus.subscribe('order.created', async (event) => {
  const { orderId, userId, amount } = event;
  
  const paymentResult = await chargeUser(userId, amount);
  
  // Publish result
  await eventBus.publish('payment.processed', {
    orderId,
    status: paymentResult.status
  });
});

// Order Service listens for payment result
eventBus.subscribe('payment.processed', async (event) => {
  await db.orders.update(event.orderId, {
    status: event.status === 'success' ? 'PAID' : 'FAILED'
  });
});
```

**Pros:**
- ✅ Loose coupling (services don't need to know about each other)
- ✅ Resilient (if payment service is down, message queued for later)
- ✅ Scalable (can process events in parallel)

**Cons:**
- ❌ Eventual consistency (order status updates asynchronously)
- ❌ Complexity (need message broker infrastructure)
- ❌ Debugging harder (distributed traces needed)

---

## 3️⃣ Key Components

### **A. API Gateway**

Single entry point for all clients. Routes requests to appropriate microservices.

```javascript
// API Gateway (Node.js + Express)

const express = require('express');
const httpProxy = require('http-proxy');
const app = express();

const proxy = httpProxy.createProxyServer();

// Route to services
app.use('/api/users', (req, res) => {
  proxy.web(req, res, { target: 'http://user-service:3001' });
});

app.use('/api/products', (req, res) => {
  proxy.web(req, res, { target: 'http://product-service:3002' });
});

app.use('/api/orders', (req, res) => {
  proxy.web(req, res, { target: 'http://order-service:3003' });
});

// Cross-cutting concerns
app.use(authenticationMiddleware);  // Centralized auth
app.use(rateLimitMiddleware);       // Rate limiting
app.use(loggingMiddleware);         // Request logging

app.listen(80);
```

**Responsibilities:**
- Routing
- Authentication/Authorization
- Rate limiting
- Request/Response transformation
- Protocol translation (REST → gRPC)
- Caching

---

### **B. Service Discovery**

Services register themselves and discover other services dynamically.

```javascript
// Using Consul for service discovery

const Consul = require('consul');
const consul = new Consul();

// Service Registration (on startup)
async function registerService() {
  await consul.agent.service.register({
    name: 'user-service',
    address: '10.0.1.5',
    port: 3001,
    check: {
      http: 'http://10.0.1.5:3001/health',
      interval: '10s'
    }
  });
  console.log('Service registered');
}

// Service Discovery (when calling another service)
async function callPaymentService(data) {
  // Get available instances
  const services = await consul.health.service('payment-service');
  
  // Pick one (load balance)
  const instance = services[Math.floor(Math.random() * services.length)];
  
  // Call it
  const response = await axios.post(
    `http://${instance.Service.Address}:${instance.Service.Port}/charge`,
    data
  );
  
  return response.data;
}
```

**Popular Tools:**
- Consul
- Eureka (Netflix)
- etcd
- ZooKeeper

---

### **C. Load Balancer**

Distributes traffic across multiple service instances.

```javascript
// Client-side load balancing with Round Robin

class LoadBalancer {
  constructor(services) {
    this.services = services;  // ['http://service1:3000', 'http://service2:3000']
    this.currentIndex = 0;
  }
  
  getNextService() {
    const service = this.services[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.services.length;
    return service;
  }
  
  async request(path, data) {
    const service = this.getNextService();
    return axios.post(`${service}${path}`, data);
  }
}

const lb = new LoadBalancer([
  'http://payment-service-1:3000',
  'http://payment-service-2:3000',
  'http://payment-service-3:3000'
]);

// Usage
await lb.request('/charge', { amount: 100 });
```

**Load Balancing Strategies:**
- Round Robin
- Least Connections
- Weighted Round Robin
- IP Hash
- Random

---

### **D. Circuit Breaker**

Prevents cascading failures when downstream service is failing.

```javascript
class CircuitBreaker {
  constructor(serviceCall, options = {}) {
    this.serviceCall = serviceCall;
    this.failureThreshold = options.failureThreshold || 5;
    this.timeout = options.timeout || 60000;
    this.state = 'CLOSED';  // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }
  
  async execute(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await this.serviceCall(...args);
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
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

// Usage
const paymentServiceCall = (data) => axios.post('http://payment-service/charge', data);
const breaker = new CircuitBreaker(paymentServiceCall, { failureThreshold: 3 });

try {
  const result = await breaker.execute({ amount: 100 });
} catch (error) {
  // Fallback logic
  console.log('Payment service unavailable, using fallback');
}
```

**States:**
- **CLOSED**: Normal operation, requests pass through
- **OPEN**: Service failing, requests immediately fail (fast fail)
- **HALF_OPEN**: Testing if service recovered, limited requests allowed

---

### **E. Saga Pattern (Distributed Transactions)**

Handle transactions across multiple services without 2-phase commit.

```javascript
// Choreography-based Saga (event-driven)

// Order Service
async function createOrder(orderData) {
  const order = await db.orders.create({ ...orderData, status: 'PENDING' });
  
  await eventBus.publish('order.created', {
    orderId: order.id,
    userId: orderData.userId,
    items: orderData.items,
    total: orderData.total
  });
}

// Payment Service
eventBus.subscribe('order.created', async (event) => {
  try {
    await chargeUser(event.userId, event.total);
    await eventBus.publish('payment.success', { orderId: event.orderId });
  } catch (error) {
    await eventBus.publish('payment.failed', { orderId: event.orderId, reason: error.message });
  }
});

// Inventory Service
eventBus.subscribe('payment.success', async (event) => {
  try {
    await reserveItems(event.orderId);
    await eventBus.publish('inventory.reserved', { orderId: event.orderId });
  } catch (error) {
    // Compensating transaction: refund payment
    await eventBus.publish('inventory.reservation.failed', { orderId: event.orderId });
  }
});

// Payment Service (compensating transaction)
eventBus.subscribe('inventory.reservation.failed', async (event) => {
  await refundUser(event.orderId);
  await eventBus.publish('payment.refunded', { orderId: event.orderId });
});

// Order Service (update final status)
eventBus.subscribe('inventory.reserved', async (event) => {
  await db.orders.update(event.orderId, { status: 'CONFIRMED' });
});

eventBus.subscribe('payment.refunded', async (event) => {
  await db.orders.update(event.orderId, { status: 'CANCELLED' });
});
```

**Alternative: Orchestration-based Saga**

```javascript
// Order Orchestrator coordinates the saga

class OrderSaga {
  async execute(orderData) {
    const order = await db.orders.create({ ...orderData, status: 'PENDING' });
    
    try {
      // Step 1: Charge payment
      await paymentService.charge({
        userId: orderData.userId,
        amount: orderData.total
      });
      
      // Step 2: Reserve inventory
      await inventoryService.reserve({
        orderId: order.id,
        items: orderData.items
      });
      
      // Step 3: Ship order
      await shippingService.scheduleShipment({
        orderId: order.id,
        address: orderData.address
      });
      
      // Success
      await db.orders.update(order.id, { status: 'CONFIRMED' });
      return { success: true, orderId: order.id };
      
    } catch (error) {
      // Compensate (rollback)
      await this.compensate(order.id);
      throw error;
    }
  }
  
  async compensate(orderId) {
    // Reverse in opposite order
    await shippingService.cancelShipment(orderId);
    await inventoryService.releaseReservation(orderId);
    await paymentService.refund(orderId);
    await db.orders.update(orderId, { status: 'CANCELLED' });
  }
}
```

---

## 4️⃣ Data Management

### **Database per Service**

Each microservice owns its database.

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   User      │   │  Order      │   │  Payment    │
│   Service   │   │  Service    │   │   Service   │
│             │   │             │   │             │
│ ┌─────────┐ │   │ ┌─────────┐ │   │ ┌─────────┐ │
│ │  Users  │ │   │ │ Orders  │ │   │ │Payments │ │
│ │   DB    │ │   │ │   DB    │ │   │ │   DB    │ │
│ └─────────┘ │   │ └─────────┘ │   │ └─────────┘ │
└─────────────┘   └─────────────┘   └─────────────┘

❌ No direct database access across services
✅ Only communicate via APIs or events
```

**Why?**
- ✅ Independent scaling (different databases optimized for different workloads)
- ✅ Technology flexibility (PostgreSQL for relational, MongoDB for documents)
- ✅ Fault isolation (database failure doesn't affect other services)

**Challenges:**
- ❌ No JOIN queries across services
- ❌ Data duplication (eventual consistency)

---

### **Event Sourcing**

Store all changes as immutable events instead of current state.

```javascript
// Traditional approach: Store current state
await db.accounts.update(accountId, { balance: 500 });

// Event Sourcing: Store all events
await eventStore.append('account-123', [
  { type: 'AccountCreated', balance: 0, timestamp: '2024-01-01' },
  { type: 'MoneyDeposited', amount: 1000, timestamp: '2024-01-02' },
  { type: 'MoneyWithdrawn', amount: 500, timestamp: '2024-01-03' }
]);

// Rebuild current state by replaying events
function getCurrentBalance(events) {
  return events.reduce((balance, event) => {
    switch (event.type) {
      case 'AccountCreated': return event.balance;
      case 'MoneyDeposited': return balance + event.amount;
      case 'MoneyWithdrawn': return balance - event.amount;
      default: return balance;
    }
  }, 0);
}

const events = await eventStore.getEvents('account-123');
const currentBalance = getCurrentBalance(events);  // 500
```

**Benefits:**
- ✅ Complete audit trail
- ✅ Time travel (rebuild state at any point in time)
- ✅ Event replay (fix bugs by replaying with corrected logic)

---

### **CQRS (Command Query Responsibility Segregation)**

Separate read and write models.

```javascript
// Write Model (Commands)
class OrderService {
  async createOrder(orderData) {
    const event = {
      type: 'OrderCreated',
      orderId: uuidv4(),
      ...orderData,
      timestamp: Date.now()
    };
    
    await eventStore.append(event.orderId, [event]);
    await eventBus.publish('order.created', event);
  }
}

// Read Model (Queries)
// Separate database optimized for reads
eventBus.subscribe('order.created', async (event) => {
  // Update read-optimized view
  await readDB.orders.insert({
    orderId: event.orderId,
    userId: event.userId,
    total: event.total,
    status: 'PENDING',
    createdAt: event.timestamp
  });
});

// Query from read model
async function getOrderHistory(userId) {
  return await readDB.orders.find({ userId }).sort({ createdAt: -1 });
}
```

**Benefits:**
- ✅ Optimize read and write separately
- ✅ Scale reads independently (read replicas)
- ✅ Denormalize data for fast queries

---

## 5️⃣ Deployment Patterns

### **Container Orchestration (Kubernetes)**

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3  # Run 3 instances
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: myregistry/user-service:v1.2.3
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: postgres-service
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

**Kubernetes Features:**
- Auto-scaling (HPA - Horizontal Pod Autoscaler)
- Self-healing (restart failed containers)
- Load balancing
- Service discovery
- Rolling updates (zero downtime)

---

## 6️⃣ Monitoring & Observability

### **Distributed Tracing**

Track requests across multiple services.

```javascript
// Using OpenTelemetry

const { trace } = require('@opentelemetry/api');
const tracer = trace.getTracer('order-service');

async function createOrder(orderData) {
  // Start span
  const span = tracer.startSpan('createOrder');
  span.setAttribute('user.id', orderData.userId);
  span.setAttribute('order.total', orderData.total);
  
  try {
    // Save order
    const order = await db.orders.create(orderData);
    
    // Call payment service (propagate trace context)
    const paymentSpan = tracer.startSpan('chargePayment', {
      parent: span
    });
    await paymentService.charge({ orderId: order.id, amount: order.total });
    paymentSpan.end();
    
    span.setStatus({ code: SpanStatusCode.OK });
    return order;
  } catch (error) {
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    throw error;
  } finally {
    span.end();
  }
}
```

**Visualize with Jaeger:**
```
createOrder [200ms]
  ├─ db.orders.create [50ms]
  ├─ chargePayment [120ms]
  │   ├─ db.payments.create [30ms]
  │   └─ stripe.charge [80ms]
  └─ eventBus.publish [10ms]
```

---

## Summary

**Microservices Are Right When:**
- ✅ Large team (50+ engineers)
- ✅ Need independent scaling
- ✅ Different parts of system have different tech requirements
- ✅ Frequent deployments

**Stick with Monolith When:**
- ✅ Small team (<10 engineers)
- ✅ Simple application
- ✅ Early-stage product (iterate fast)

**Key Takeaways:**
- 🔹 Start with monolith, extract microservices when needed
- 🔹 Each service owns its data
- 🔹 Communicate via APIs or events
- 🔹 Use API Gateway as single entry point
- 🔹 Implement circuit breakers to prevent cascading failures
- 🔹 Use Saga pattern for distributed transactions
- 🔹 Monitor with distributed tracing
