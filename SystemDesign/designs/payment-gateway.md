# Payment Gateway Design (Razorpay/PhonePe Style)
> **SDE-2 Interview Ready** | 45-minute format | India-focused

## 🎯 Problem Statement

Design a payment gateway like Razorpay or PhonePe that enables merchants to accept payments through UPI, cards, wallets, and netbanking in India.

**Key Requirements:**
- Support UPI (48% market share in India)
- Handle 100M transactions/day
- 99.99% uptime
- RBI compliance (data localization, tokenization)

---

## 1️⃣ Requirements Clarification

### Functional Requirements:
1. **Merchant Integration**
   - APIs to create orders and process payments
   - Payment dashboard
   - Settlement (T+1 or T+2)

2. **Payment Methods**
   - UPI (VPA, QR code, UPI intent)
   - Cards (with RBI tokenization)
   - Wallets (Paytm, PhonePe, Google Pay)
   - Netbanking
   - Cash on Delivery tracking

3. **Payment Flow**
   - Create payment order
   - Process payment
   - Send webhooks to merchant
   - Handle retries

### Non-Functional Requirements:
- **Scale:** 100M transactions/day (~1,200 TPS)
- **Latency:** Payment page <2s, transaction <5s
- **Availability:** 99.99% (4 min downtime/month)
- **Consistency:** Strong (no duplicate charges)
- **Security:** PCI-DSS, end-to-end encryption

### Out of Scope:
- International payments
- Cryptocurrency
- BNPL (Buy Now Pay Later)

---

## 2️⃣ Capacity Estimation

```
Merchants: 8M
Daily Active Merchants: 800K

Transactions/day: 100M
TPS (average): 100M / 86400 = 1,160 TPS
TPS (peak): 1,160 × 5 = 5,800 TPS

Payment Methods:
- UPI: 48M/day (48%)
- Cards: 22M/day (22%)
- Wallets: 18M/day (18%)
- Netbanking: 10M/day (10%)
- COD: 2M/day (2%)

Storage:
- Per transaction: 2 KB
- Daily: 100M × 2 KB = 200 GB/day
- 5 years: 200 GB × 365 × 5 = 365 TB

Bandwidth:
- Incoming: 1,160 req/s × 2 KB = 2.3 MB/s
- Peak: 2.3 × 5 = 11.5 MB/s
```

---

## 3️⃣ API Design

### Core APIs (4 endpoints)

```javascript
// 1. Create Payment Order
POST /v1/orders
Headers: { Authorization: "Bearer <api_key>" }
Body: {
  amount: 50000,  // paise (₹500)
  currency: "INR",
  receipt: "order_12345"
}
Response: {
  order_id: "order_Abc123",
  amount: 50000,
  status: "created"
}

// 2. Process Payment
POST /v1/payments
Body: {
  order_id: "order_Abc123",
  method: "upi",
  vpa: "user@paytm"  // UPI Virtual Payment Address
}
Response: {
  payment_id: "pay_Xyz789",
  status: "pending",  // pending, captured, failed
  upi_transaction_id: "HDFC001234",
  timeout: 30  // seconds
}

// 3. Fetch Payment Status
GET /v1/payments/{payment_id}
Response: {
  payment_id: "pay_Xyz789",
  order_id: "order_Abc123",
  amount: 50000,
  status: "captured",  // created, pending, captured, failed
  method: "upi",
  vpa: "user@paytm",
  created_at: "2026-02-15T10:30:00Z"
}

// 4. Process Refund
POST /v1/refunds
Body: {
  payment_id: "pay_Xyz789",
  amount: 50000  // partial or full
}
Response: {
  refund_id: "rfnd_Def456",
  status: "processed"
}
```

**Webhooks (sent to merchant):**
```javascript
POST <merchant_webhook_url>
Headers: { X-Signature: "hmac_sha256..." }
Body: {
  event: "payment.captured",
  payload: {
    payment_id: "pay_Xyz789",
    order_id: "order_Abc123",
    status: "captured",
    amount: 50000
  }
}
```

---

## 4️⃣ Database Design

### PostgreSQL Schema (4 core tables)

```sql
-- Merchants
CREATE TABLE merchants (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  api_key VARCHAR(255) UNIQUE,
  webhook_url VARCHAR(500),
  webhook_secret VARCHAR(255),
  bank_account JSONB,
  created_at TIMESTAMP
);

-- Orders
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,  -- order_Abc123
  merchant_id UUID REFERENCES merchants(id),
  amount BIGINT,  -- in paise
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(50),  -- created, attempted, paid
  created_at TIMESTAMP
);
CREATE INDEX idx_orders_merchant ON orders(merchant_id);

-- Payments
CREATE TABLE payments (
  id VARCHAR(50) PRIMARY KEY,  -- pay_Xyz789
  order_id VARCHAR(50) REFERENCES orders(id),
  merchant_id UUID,
  amount BIGINT,
  status VARCHAR(50),  -- created, pending, captured, failed
  method VARCHAR(50),  -- upi, card, wallet, netbanking
  
  -- Method-specific fields
  vpa VARCHAR(100),  -- UPI
  card_token VARCHAR(100),  -- Tokenized card
  upi_transaction_id VARCHAR(100),
  
  created_at TIMESTAMP,
  captured_at TIMESTAMP
);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Refunds
CREATE TABLE refunds (
  id VARCHAR(50) PRIMARY KEY,
  payment_id VARCHAR(50) REFERENCES payments(id),
  amount BIGINT,
  status VARCHAR(50),  -- pending, processed, failed
  created_at TIMESTAMP
);
```

**Redis (Caching):**
```
Key: merchant:{merchant_id}
Value: {name, api_key, webhook_url}
TTL: 1 hour

Key: payment:lock:{order_id}
Value: 1
TTL: 60 seconds (distributed lock)

Key: idempotency:{key}
Value: {payment_id, status}
TTL: 24 hours
```

---

## 5️⃣ High-Level Design

```
┌─────────────┐
│  Customer   │
│ (via Merchant)│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│      Load Balancer (AWS ALB)        │
└──────┬─────────────────────┬────────┘
       │                     │
       ▼                     ▼
┌─────────────┐      ┌─────────────┐
│ API Gateway │      │  Checkout   │
│             │      │  Service    │
│ - Auth      │      │ (Payment UI)│
│ - Rate limit│      └─────────────┘
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│     Payment Orchestrator            │
│                                     │
│  - Route to payment method          │
│  - Idempotency checks               │
│  - State management                 │
│  - Retry logic                      │
└──────┬──────────────────────────────┘
       │
   ┌───┴───┬─────────┬─────────┐
   ▼       ▼         ▼         ▼
┌─────┐ ┌──────┐ ┌────────┐ ┌──────┐
│ UPI │ │ Card │ │ Wallet │ │ Net  │
│ NPCI│ │Vault │ │  APIs  │ │banking│
└─────┘ └──────┘ └────────┘ └──────┘
   │       │         │         │
   └───────┴─────────┴─────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │   Redis     │
│             │  │             │
│ - Orders    │  │ - Cache     │
│ - Payments  │  │ - Locks     │
│ - Merchants │  │ - Sessions  │
└─────────────┘  └─────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│     Background Services             │
│                                     │
│  - Webhook Service (retries)        │
│  - Settlement Service (T+1)         │
│  - Fraud Detection                  │
└─────────────────────────────────────┘
```

**Data Flow (Numbered Steps):**
1. Customer clicks "Pay" on merchant site
2. Merchant creates order → API Gateway
3. Order saved to PostgreSQL
4. Customer selects UPI, enters VPA
5. Payment Orchestrator acquires lock
6. UPI Handler calls NPCI API
7. Poll NPCI for status (30s timeout)
8. Save payment status to DB
9. Send webhook to merchant
10. Release lock

---

## 6️⃣ Low-Level Design

### Class Diagram

```
┌─────────────────────────────────────┐
│      PaymentOrchestrator            │
├─────────────────────────────────────┤
│ - handlers: Map<String, Handler>    │
│ - lockService: LockService          │
│ - webhookService: WebhookService    │
├─────────────────────────────────────┤
│ + processPayment(order, method)     │
│ + capturePayment(paymentId)         │
│ - checkIdempotency(orderId)         │
└──────────────┬──────────────────────┘
               │
               │ uses
               ▼
┌─────────────────────────────────────┐
│      <<interface>>                  │
│      PaymentHandler                 │
├─────────────────────────────────────┤
│ + validate(method): boolean         │
│ + process(payment): PaymentResult   │
└──────────────┬──────────────────────┘
               │
       ┌───────┼───────┬──────────┐
       ▼       ▼       ▼          ▼
┌──────────┐ ┌──────┐ ┌────────┐ ┌─────────┐
│   UPI    │ │ Card │ │ Wallet │ │Netbank  │
│ Handler  │ │Handler│ │Handler │ │Handler  │
└──────────┘ └──────┘ └────────┘ └─────────┘
```

### Sequence Diagram (UPI Payment)

```
Customer   API      Orchestrator   UPIHandler   NPCI      Database
   │        │            │              │         │          │
   │─POST /payments────>│              │         │          │
   │        │            │              │         │          │
   │        │──validate()─>│            │         │          │
   │        │            │              │         │          │
   │        │            │─acquireLock()─────────────────────>│
   │        │            │<──────────────────────────────────│
   │        │            │              │         │          │
   │        │            │──process()──>│         │          │
   │        │            │              │         │          │
   │        │            │              │─initiate()────────>│
   │        │            │              │<──txn_id──────────│
   │        │            │              │         │          │
   │        │            │              │─poll(30s)────────>│
   │        │            │              │<──SUCCESS─────────│
   │        │            │              │         │          │
   │        │            │<─PaymentResult─│       │          │
   │        │            │──save()──────────────────────────>│
   │        │            │──releaseLock()────────────────────>│
   │        │<───200 OK──│              │         │          │
   │<───────│            │              │         │          │
```

### State Machine

```
Payment State Transitions:

       ┌─────────┐
       │ CREATED │ (Order created)
       └────┬────┘
            │
            ▼
       ┌──────────┐
       │ PENDING  │ (Processing with gateway)
       └────┬─────┘
            │
    ┌───────┼────────┐
    │                │
    ▼                ▼
┌─────────┐      ┌────────┐
│CAPTURED │      │ FAILED │
│         │      │        │
│(Success)│      │(Retry  │
└────┬────┘      │possible)│
     │           └────────┘
     │
     ▼
┌──────────┐
│ REFUNDED │ (Full/Partial)
└──────────┘
```

### Design Patterns Used

1. **Strategy Pattern**
   - `PaymentHandler` interface with multiple implementations (UPI, Card, Wallet)
   - Choose strategy at runtime based on payment method

2. **Factory Pattern**
   - `PaymentHandlerFactory` creates appropriate handler
   ```
   handler = factory.getHandler(paymentMethod.type)
   ```

3. **Observer Pattern**
   - Webhook service notifies merchants of payment events
   - Async event-driven architecture

4. **State Pattern**
   - Payment state machine (CREATED → PENDING → CAPTURED)

---

## 7️⃣ Deep Dives

### Deep Dive 1: Idempotency (Prevent Duplicate Charges)

**Problem:** Network failures can cause duplicate payment requests

**Solution:** Idempotency keys + Distributed locks

**Approach:**
```javascript
async function processPayment(orderId, method, idempotencyKey) {
  // 1. Check if already processed
  const cached = await redis.get(`idem:${idempotencyKey}`);
  if (cached) {
    return JSON.parse(cached);  // Return cached result
  }
  
  // 2. Acquire distributed lock (prevent concurrent processing)
  const locked = await redis.set(
    `payment:lock:${orderId}`, 
    1, 
    'NX',  // Only set if not exists
    'EX', 60  // 60 seconds TTL
  );
  
  if (!locked) {
    throw new Error('Payment already in progress');
  }
  
  try {
    // 3. Process payment
    const payment = await gateway.charge(method, amount);
    
    // 4. Cache result (24 hour TTL)
    await redis.set(
      `idem:${idempotencyKey}`, 
      JSON.stringify(payment),
      'EX', 86400
    );
    
    return payment;
    
  } finally {
    // 5. Release lock
    await redis.del(`payment:lock:${orderId}`);
  }
}
```

**Trade-offs:**
- ✅ Prevents duplicate charges (critical for trust)
- ✅ Scales horizontally (Redis cluster)
- ❌ Adds ~50ms latency (Redis round trip)
- ❌ Lock timeout risk (if server crashes)

**Alternative:** Database-level unique constraints, but slower

---

### Deep Dive 2: UPI Payment Flow

**Challenge:** UPI has 30-second timeout (NPCI limit)

**Solution:** Async polling + webhook fallback

**Flow:**
```
1. Initiate UPI transaction with NPCI
   ↓
2. Receive upi_transaction_id
   ↓
3. Poll NPCI every 2 seconds for 30 seconds
   ↓
   ├─ SUCCESS → Update status, send webhook
   ├─ FAILED → Update status, send webhook
   └─ TIMEOUT → Mark PENDING, wait for NPCI webhook (can come later)
```

**Pseudo-code:**
```javascript
async function processUPI(payment, vpa) {
  // Initiate
  const { upi_txn_id } = await NPCI.initiate({
    vpa: vpa,
    amount: payment.amount,
    ref_id: payment.id
  });
  
  // Poll for 30 seconds
  const startTime = Date.now();
  while ((Date.now() - startTime) < 30000) {
    const status = await NPCI.checkStatus(upi_txn_id);
    
    if (status === 'SUCCESS') {
      return { status: 'captured', upi_txn_id };
    }
    if (status === 'FAILED') {
      return { status: 'failed', upi_txn_id };
    }
    
    await sleep(2000);  // Poll every 2 seconds
  }
  
  // Timeout → mark PENDING
  return { status: 'pending', upi_txn_id };
}

// Webhook from NPCI (can arrive later)
async function handleNPCIWebhook(data) {
  const payment = await Payment.findByUPITxnId(data.upi_txn_id);
  
  if (payment.status === 'pending') {
    payment.status = data.status;  // SUCCESS or FAILED
    await payment.save();
    
    // Notify merchant
    await sendWebhook(payment.merchant_id, 'payment.captured', payment);
  }
}
```

**Trade-offs:**
- ✅ Handles NPCI timeouts gracefully
- ✅ User gets immediate feedback (30s max)
- ❌ Some payments marked PENDING (resolved later via webhook)

---

### Deep Dive 3: Webhook Reliability

**Challenge:** Merchant servers can be down, webhooks may fail

**Solution:** Exponential backoff with retries

**Retry Schedule:**
- 1 minute
- 5 minutes
- 30 minutes
- 2 hours
- 6 hours
- 24 hours
- **Give up after 24 hours**

**Implementation:**
```javascript
async function sendWebhook(merchantId, event, payload) {
  const merchant = await Merchant.findById(merchantId);
  
  if (!merchant.webhook_url) return;
  
  const signature = generateSignature(payload, merchant.webhook_secret);
  
  try {
    const response = await axios.post(merchant.webhook_url, {
      event: event,
      payload: payload
    }, {
      headers: { 'X-Signature': signature },
      timeout: 10000
    });
    
    if (response.status === 200) {
      console.log('Webhook delivered');
    }
    
  } catch (error) {
    // Schedule retry
    await WebhookQueue.add({
      merchant_id: merchantId,
      event: event,
      payload: payload,
      attempt: 1
    }, {
      delay: 60000  // 1 minute
    });
  }
}

// Retry handler
async function retryWebhook(job) {
  const retryDelays = [60, 300, 1800, 7200, 21600, 86400];  // seconds
  
  if (job.attempt > 6) {
    // Give up, send email alert
    await sendEmailAlert(job.merchant_id, 'Webhook failed after 6 attempts');
    return;
  }
  
  // Try to deliver
  const success = await attemptWebhookDelivery(job);
  
  if (!success) {
    // Schedule next retry
    const nextDelay = retryDelays[job.attempt];
    await WebhookQueue.add({
      ...job,
      attempt: job.attempt + 1
    }, {
      delay: nextDelay * 1000
    });
  }
}
```

**Fallback:** Merchant must poll `GET /payments/{id}` if webhook doesn't arrive

**Trade-offs:**
- ✅ Eventually consistent (webhook will arrive)
- ✅ Doesn't block payment flow
- ❌ Merchant sees delayed status updates
- ❌ Need background job queue (Redis/RabbitMQ)

---

## 8️⃣ Bottlenecks & Optimizations

### Bottlenecks:

1. **Single Redis Instance**
   - Problem: Single point of failure
   - Solution: Redis Sentinel or Redis Cluster (3-5 nodes)

2. **Database Write Load**
   - Problem: 1,200 writes/sec can overwhelm single PostgreSQL
   - Solution: Write replicas + Connection pooling (100 connections)

3. **NPCI Downtime**
   - Problem: UPI gateway unavailable (happens in India)
   - Solution: 
     - Circuit breaker pattern (stop calling NPCI if 50% fail)
     - Fallback to other payment methods
     - Show user error message

4. **Webhook Delivery Failures**
   - Problem: Merchant doesn't receive payment confirmation
   - Solution: Retry mechanism + Merchant can poll API

### Optimizations:

**1. Caching:**
```
Cache merchant details (changes rarely):
- merchant:{id} → TTL: 1 hour
- Reduces DB reads by 80%

Cache payment status (for duplicate checks):
- payment:{id}:status → TTL: 5 minutes
```

**2. Database Indexing:**
```sql
CREATE INDEX idx_payments_merchant_created 
  ON payments(merchant_id, created_at DESC);
  
-- For merchant dashboard queries (fast)
```

**3. Auto-Scaling:**
- Scale API servers based on QPS (10-100 instances)
- Horizontal scaling for stateless services

**4. CDN for Static Assets:**
- Checkout page assets (JS, CSS) on CDN
- Reduces load on API servers

---

## 9️⃣ Security & Compliance

### RBI Compliance (India-specific):

1. **Data Localization**
   - All data stored in India (AWS ap-south-1)
   - No cross-border data transfer

2. **Card Tokenization**
   - Cannot store card numbers (RBI mandate from 2022)
   - Must use network tokenization (Visa/Mastercard/RuPay)

3. **Two-Factor Authentication**
   - All card payments require 3D Secure (OTP)
   - UPI requires UPI PIN

### Security Measures:

1. **Encryption**
   - HTTPS for all communication (TLS 1.3)
   - Database encryption at rest

2. **API Authentication**
   - API keys for merchant authentication
   - HMAC signature for webhooks

3. **Rate Limiting**
   - 100 requests/min per merchant
   - Prevent brute force attacks

---

## 🔟 Interview Tips

### What to Focus on (45-min interview):

1. **Start with clarification** (5 min)
   - Functional vs non-functional requirements
   - Which payment methods?
   - India-specific vs global?

2. **Draw high-level design** (15 min)
   - Start with client → API Gateway → Payment Orchestrator
   - Add databases (PostgreSQL + Redis)
   - Show payment method handlers

3. **Pick 2 deep dives** (15 min)
   - Idempotency (most important!)
   - UPI timeout handling OR Webhook retries

4. **Discuss trade-offs** (5 min)
   - Strong consistency vs availability
   - Sync vs async webhooks
   - PostgreSQL vs NoSQL

5. **Mention bottlenecks** (5 min)
   - Single Redis, NPCI downtime, webhook failures

### Common Follow-up Questions:

**Q: How do you handle NPCI downtime?**
A: Circuit breaker pattern, fallback to other payment methods, queue requests for retry

**Q: How do you prevent a merchant from seeing another merchant's transactions?**
A: Row-level security, API key scoped to merchant_id, validate merchant_id in all queries

**Q: How do you handle refunds?**
A: Reverse the payment via gateway, update payment status to REFUNDED, settle with merchant (deduct from next settlement)

**Q: What if Redis goes down?**
A: Payments continue (fallback to DB for locks), but slower. Use Redis Sentinel for auto-failover.

**Q: How do you detect fraud?**
A: Track patterns (multiple failed attempts, unusual amounts, IP reputation), use risk scoring service, block suspicious transactions.

---

## Summary

**Key Takeaways for SDE-2:**
1. ✅ Support multiple payment methods with Strategy pattern
2. ✅ Idempotency is CRITICAL (distributed locks + caching)
3. ✅ Handle async flows (UPI timeout, webhooks)
4. ✅ Strong consistency for payments (no duplicate charges)
5. ✅ India-specific: UPI integration, RBI compliance, NPCI downtime handling

**Tech Stack:**
- **API:** Node.js/Go (high throughput)
- **Database:** PostgreSQL (ACID transactions)
- **Cache:** Redis (locks, idempotency, sessions)
- **Queue:** RabbitMQ/SQS (webhook retries)
- **Payment Gateways:** NPCI (UPI), Razorpay Card Vault, BillDesk (netbanking)

**Estimated Cost (100M txn/month):**
- Compute: ₹8L/month
- Database: ₹5L/month
- Redis: ₹2L/month
- Payment gateway fees: ₹20L/month (from merchant fees)
- **Total:** ~₹35-40L/month (~$42-48K USD)
