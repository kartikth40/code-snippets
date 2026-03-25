# Distributed Systems Concepts

## 🎯 Why This Matters

Every system design interview at SDE-2 level will probe your understanding of distributed systems. These concepts come up in almost every design — knowing them deeply separates good answers from great ones.

---

## 1️⃣ CAP Theorem (Deep Dive)

> In a distributed system, you can only guarantee 2 of 3: **Consistency**, **Availability**, **Partition Tolerance**.

Since network partitions are unavoidable in real distributed systems, the real choice is **CP vs AP**.

```
CP (Consistency + Partition Tolerance):
- All nodes see the same data at the same time
- System may reject requests during partition
- Examples: HBase, Zookeeper, MongoDB (strong consistency mode)
- Use when: Banking, inventory, anything where stale data = wrong

AP (Availability + Partition Tolerance):
- System always responds (may return stale data)
- Nodes may diverge during partition, sync later
- Examples: Cassandra, DynamoDB, CouchDB
- Use when: Social feeds, analytics, anything where eventual consistency is OK
```

### PACELC Extension
CAP only covers partition scenarios. PACELC adds the normal case:

```
If Partition (P):
  Choose between Availability (A) or Consistency (C)
Else (E — normal operation):
  Choose between Latency (L) or Consistency (C)

Examples:
- DynamoDB: PA/EL (available during partition, low latency normally)
- HBase: PC/EC (consistent during partition, consistent normally)
- Cassandra: PA/EL (tunable consistency)
```

---

## 2️⃣ Consistency Models

From strongest to weakest:

### Strong Consistency
> Every read returns the most recent write.

```
Write(x=5) → Read(x) always returns 5
Used in: Banking, inventory, leader election
Cost: Higher latency (must coordinate across nodes)
```

### Linearizability
> Operations appear instantaneous and in real-time order.

```
Most strict form of strong consistency.
Used in: Distributed locks, atomic counters
Example: Zookeeper, etcd
```

### Sequential Consistency
> All nodes see operations in the same order (not necessarily real-time).

```
Write(x=1) then Write(x=2) → all nodes see x=1 before x=2
But the timing may differ from wall clock
```

### Eventual Consistency
> Given no new updates, all replicas will eventually converge.

```
Write(x=5) → some reads may return old value temporarily
Eventually all nodes return x=5
Used in: DNS, social media feeds, shopping carts
Cost: Application must handle stale reads
```

### Read-Your-Writes Consistency
> After a write, the same client always reads the updated value.

```
User posts a tweet → they always see their own tweet immediately
Other users may see it later (eventual)
Implementation: Route user's reads to the same replica they wrote to
```

---

## 3️⃣ Replication

### Leader-Follower (Master-Slave)

```
Architecture:
  Leader ──writes──> Follower 1
         ──writes──> Follower 2
         ──writes──> Follower 3

Reads: From followers (scale reads)
Writes: Only to leader (single write path)

Pros:
✅ Simple, widely used
✅ Read scaling (add followers)
✅ Failover: promote follower to leader

Cons:
❌ Leader is bottleneck for writes
❌ Replication lag (followers may be behind)
❌ Failover is complex (split-brain risk)
```

### Multi-Leader (Multi-Master)

```
Architecture:
  Leader 1 ←──sync──→ Leader 2
  (DC East)            (DC West)

Pros:
✅ Write to nearest datacenter (low latency)
✅ No single point of failure for writes

Cons:
❌ Write conflicts (both leaders accept conflicting writes)
❌ Complex conflict resolution needed
❌ Hard to implement correctly

Conflict Resolution:
- Last Write Wins (LWW): Use timestamp, latest wins (risk: data loss)
- Merge: Combine both values (works for counters, sets)
- Custom: Application-level resolution
```

### Leaderless (Dynamo-style)

```
Architecture:
  Client ──writes──> Any N nodes
  Client ──reads──>  Any R nodes

Quorum: W + R > N ensures consistency
  N=3, W=2, R=2: Strong consistency
  N=3, W=1, R=1: High availability, eventual consistency

Examples: Cassandra, DynamoDB, Riak

Pros:
✅ No single point of failure
✅ Highly available
✅ Tunable consistency

Cons:
❌ Complex to reason about
❌ Possible to read stale data
```

---

## 4️⃣ Consensus Algorithms

### Raft (Easier to understand than Paxos)

```
Used in: etcd, CockroachDB, TiKV

Roles:
- Leader: Handles all client requests
- Follower: Replicates leader's log
- Candidate: Trying to become leader

Leader Election:
1. Follower times out (no heartbeat from leader)
2. Becomes Candidate, increments term, votes for self
3. Sends RequestVote to all nodes
4. If majority votes → becomes Leader
5. Sends heartbeats to prevent new elections

Log Replication:
1. Client sends command to Leader
2. Leader appends to log, sends AppendEntries to followers
3. Once majority acknowledge → commit
4. Leader responds to client
```

### Paxos (Conceptual)

```
Two phases:
Phase 1 (Prepare):
  Proposer → "I want to propose, promise not to accept lower proposals"
  Acceptors → "OK, I promise" (if higher than seen before)

Phase 2 (Accept):
  Proposer → "Accept this value"
  Acceptors → "Accepted" (if still promised)

Once majority accept → value is chosen
```

---

## 5️⃣ Distributed Transactions

### Two-Phase Commit (2PC)

```
Coordinator orchestrates transaction across multiple nodes.

Phase 1 (Prepare):
  Coordinator → "Can you commit?" → All participants
  Participants → "Yes" or "No"

Phase 2 (Commit/Abort):
  If all Yes → Coordinator → "Commit" → All participants
  If any No  → Coordinator → "Abort"  → All participants

Problems:
❌ Blocking: If coordinator crashes after Phase 1, participants wait forever
❌ Single point of failure (coordinator)
❌ Slow (2 round trips)
```

### Saga Pattern (Preferred for microservices)

```
Break transaction into local transactions with compensating actions.

Example: Book flight + hotel + car
  1. Book flight (success) → emit FlightBooked event
  2. Book hotel (success) → emit HotelBooked event
  3. Book car (FAIL) → emit CarBookingFailed event
  4. Compensate: Cancel hotel → emit HotelCancelled
  5. Compensate: Cancel flight → emit FlightCancelled

Two styles:
Choreography: Each service listens to events, acts, emits next event
  Pros: Decoupled, simple
  Cons: Hard to track overall state

Orchestration: Central saga orchestrator tells each service what to do
  Pros: Clear flow, easy to monitor
  Cons: Orchestrator is a dependency
```

---

## 6️⃣ Distributed Caching

### Cache Consistency Strategies

```javascript
// Strategy 1: Cache-Aside (most common)
async function get(key) {
  const cached = await cache.get(key)
  if (cached) return cached

  const data = await db.get(key)
  await cache.set(key, data, TTL)
  return data
}

// Strategy 2: Write-Through
async function set(key, value) {
  await db.set(key, value)
  await cache.set(key, value, TTL)
}

// Strategy 3: Write-Behind (async)
async function set(key, value) {
  await cache.set(key, value, TTL)
  queue.push({ key, value })  // DB write happens async
}
```

### Consistent Hashing (for distributed cache)

```
Problem: Adding/removing cache nodes invalidates most keys with simple modulo hashing.

Solution: Consistent hashing — only ~K/N keys remapped when node added/removed.

Ring:
  Hash space: 0 to 2^32
  Nodes placed at hash(node_id) positions on ring
  Key → find first node clockwise on ring

Virtual nodes:
  Each physical node has 150 virtual nodes
  Ensures even distribution even with heterogeneous nodes
```

---

## 7️⃣ Message Queues & Event Streaming

### Message Queue vs Event Stream

```
Message Queue (RabbitMQ, SQS):
  - Message consumed once, then deleted
  - Point-to-point or pub/sub
  - Good for: Task queues, job processing

Event Stream (Kafka):
  - Events retained for configurable period
  - Multiple consumers can read same event
  - Ordered within partition
  - Good for: Event sourcing, audit logs, stream processing
```

### Kafka Deep Dive

```
Concepts:
  Topic: Named stream of events
  Partition: Ordered, immutable log (unit of parallelism)
  Offset: Position of message in partition
  Consumer Group: Set of consumers sharing work

Guarantees:
  - At-least-once delivery (default)
  - Exactly-once (with transactions, more complex)
  - Ordering within partition (not across partitions)

Scaling:
  - More partitions = more parallelism
  - Consumers in group = partitions / consumers (each consumer gets some partitions)
  - Replication factor = fault tolerance

Producer:
  - Partition key determines which partition
  - Same key → same partition → ordered for that key
```

```javascript
// Kafka producer
const { Kafka } = require('kafkajs')
const kafka = new Kafka({ brokers: ['kafka:9092'] })
const producer = kafka.producer()

await producer.send({
  topic: 'order-events',
  messages: [{
    key: orderId,           // Same order → same partition → ordered
    value: JSON.stringify({ orderId, status: 'placed', userId })
  }]
})

// Kafka consumer
const consumer = kafka.consumer({ groupId: 'order-processor' })
await consumer.subscribe({ topic: 'order-events' })

await consumer.run({
  eachMessage: async ({ message }) => {
    const event = JSON.parse(message.value.toString())
    await processOrder(event)
  }
})
```

---

## 8️⃣ Distributed Locks

### When You Need Them
- Prevent double-booking (hotel rooms, seats)
- Ensure only one instance runs a cron job
- Atomic read-modify-write across services

### Redis-Based Lock (Redlock)

```javascript
class DistributedLock {
  constructor(redis) {
    this.redis = redis
  }

  async acquire(key, ttlMs) {
    const lockValue = `${Date.now()}-${Math.random()}`

    // SET key value NX PX ttl — atomic: only set if not exists
    const result = await this.redis.set(
      `lock:${key}`,
      lockValue,
      'NX',   // Only set if Not eXists
      'PX',   // Expire in milliseconds
      ttlMs
    )

    if (result === 'OK') {
      return lockValue  // Lock acquired
    }
    return null  // Lock not acquired
  }

  async release(key, lockValue) {
    // Lua script for atomic check-and-delete
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `
    await this.redis.eval(script, 1, `lock:${key}`, lockValue)
  }
}

// Usage
async function bookSeat(seatId, userId) {
  const lock = new DistributedLock(redis)
  const lockValue = await lock.acquire(`seat:${seatId}`, 5000)  // 5s TTL

  if (!lockValue) {
    throw new Error('Seat is being booked by someone else')
  }

  try {
    const seat = await db.getSeat(seatId)
    if (seat.booked) throw new Error('Seat already booked')
    await db.bookSeat(seatId, userId)
  } finally {
    await lock.release(`seat:${seatId}`, lockValue)
  }
}
```

---

## 9️⃣ Failure Patterns & Resilience

### Circuit Breaker

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0
    this.threshold = threshold    // Failures before opening
    this.timeout = timeout        // Time before trying again
    this.state = 'CLOSED'         // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now()
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN')
      }
      this.state = 'HALF_OPEN'
    }

    try {
      const result = await fn()
      this.#onSuccess()
      return result
    } catch (err) {
      this.#onFailure()
      throw err
    }
  }

  #onSuccess() {
    this.failureCount = 0
    this.state = 'CLOSED'
  }

  #onFailure() {
    this.failureCount++
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN'
      this.nextAttempt = Date.now() + this.timeout
    }
  }
}

// Usage
const breaker = new CircuitBreaker(5, 30000)

async function callPaymentService(data) {
  return breaker.call(() => paymentAPI.charge(data))
}
```

### Retry with Exponential Backoff

```javascript
async function withRetry(fn, maxRetries = 3, baseDelay = 100) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === maxRetries) throw err

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 100
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

// Usage
const result = await withRetry(() => externalAPI.getData(), 3, 200)
// Retries at: 200ms, 400ms, 800ms (+ jitter)
```

### Bulkhead Pattern

```
Isolate failures — don't let one service take down everything.

Example: Separate thread pools for different services
  - Payment service: 20 threads
  - Notification service: 10 threads
  - Analytics service: 5 threads

If analytics is slow → only analytics threads are blocked
Payment and notifications continue working
```

---

## 🔟 Observability

### The Three Pillars

```
Metrics: Numerical measurements over time
  - Request rate, error rate, latency (RED metrics)
  - CPU, memory, disk (USE metrics)
  - Tools: Prometheus + Grafana

Logs: Timestamped records of events
  - Structured logging (JSON) > unstructured
  - Log levels: DEBUG, INFO, WARN, ERROR
  - Tools: ELK Stack (Elasticsearch, Logstash, Kibana)

Traces: End-to-end request journey across services
  - Trace ID propagated through all services
  - Shows where time is spent
  - Tools: Jaeger, Zipkin, AWS X-Ray
```

### Key Metrics to Track

```
RED Method (for services):
  Rate: Requests per second
  Errors: Error rate (%)
  Duration: Latency (P50, P95, P99)

USE Method (for resources):
  Utilization: % time resource is busy
  Saturation: Queue length
  Errors: Error count

SLI/SLO/SLA:
  SLI (Service Level Indicator): Actual measurement (e.g., 99.5% uptime)
  SLO (Service Level Objective): Target (e.g., 99.9% uptime)
  SLA (Service Level Agreement): Contract with penalty (e.g., 99.9% or refund)
```

---

## 📊 Quick Reference

| Concept | Key Point | Example |
|---------|-----------|---------|
| CAP Theorem | CP vs AP trade-off | MongoDB (CP) vs Cassandra (AP) |
| Eventual Consistency | Replicas converge over time | DNS, social feeds |
| Leader-Follower | Writes to leader, reads from followers | MySQL replication |
| Saga Pattern | Distributed transactions via compensation | Booking systems |
| Consistent Hashing | Minimize remapping when nodes change | Redis cluster |
| Circuit Breaker | Stop calling failing services | Payment gateway |
| Raft | Leader election + log replication | etcd, CockroachDB |

---

## 🔗 Related Resources

- [System Design Guide](SystemDesignGuide.md)
- [Message Queues Component](components/message-queues.md)
- [Caching Component](components/caching.md)
- [Database Sharding Component](components/database-sharding.md)
