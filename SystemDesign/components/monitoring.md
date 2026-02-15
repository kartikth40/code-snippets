# Monitoring & Observability

## 🎯 Overview

**Monitoring** tells you when something is wrong.  
**Observability** helps you understand **why** it's wrong.

In distributed systems, observability is critical because failures happen across multiple services, making root cause analysis challenging.

---

## 1️⃣ The Three Pillars of Observability

### **Metrics** (Numbers)
Quantitative measurements over time (CPU usage, request rate, latency)

### **Logs** (Events)
Discrete events that happened (errors, warnings, info)

### **Traces** (Requests)
Path of a request through distributed system

```
User Request → [API Gateway] → [User Service] → [Database]
                    ↓
              [Order Service] → [Payment Service] → [Stripe API]
                    ↓
              [Notification Service] → [Email Provider]
```

---

## 2️⃣ Metrics

### **Key Metrics to Track**

#### **Application Metrics:**
- **Request Rate**: Requests per second (RPS)
- **Error Rate**: Percentage of failed requests
- **Latency**: Response time (p50, p95, p99)
- **Saturation**: How "full" your service is (CPU, memory, disk)

#### **Infrastructure Metrics:**
- **CPU Usage**: % of CPU used
- **Memory Usage**: RAM consumption
- **Disk I/O**: Read/write operations per second
- **Network I/O**: Bytes sent/received

#### **Business Metrics:**
- **Active Users**: Currently online
- **Orders Created**: Per minute/hour
- **Revenue**: Dollars per minute

---

### **Implementing Metrics**

```javascript
// Using Prometheus client

const client = require('prom-client');

// Register default metrics (CPU, memory, etc.)
client.collectDefaultMetrics();

// Custom counter
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Custom histogram (for latency)
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5]  // Buckets for latency ranges
});

// Middleware to track metrics
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || 'unknown',
      status: res.statusCode
    });
    
    httpRequestDuration.observe({
      method: req.method,
      route: req.route?.path || 'unknown',
      status: res.statusCode
    }, duration);
  });
  
  next();
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
```

**Prometheus scrapes `/metrics` endpoint:**
```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/api/users",status="200"} 1523
http_requests_total{method="POST",route="/api/orders",status="201"} 342
http_requests_total{method="GET",route="/api/users",status="500"} 12

# HELP http_request_duration_seconds Duration of HTTP requests in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",route="/api/users",status="200",le="0.1"} 1200
http_request_duration_seconds_bucket{method="GET",route="/api/users",status="200",le="0.5"} 1500
http_request_duration_seconds_bucket{method="GET",route="/api/users",status="200",le="1"} 1520
http_request_duration_seconds_sum{method="GET",route="/api/users",status="200"} 320.5
http_request_duration_seconds_count{method="GET",route="/api/users",status="200"} 1523
```

---

### **Querying Metrics (PromQL)**

```promql
# Request rate for last 5 minutes
rate(http_requests_total[5m])

# 95th percentile latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error rate (percentage)
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100

# CPU usage across all instances
avg(node_cpu_usage) by (instance)
```

---

### **Visualization (Grafana)**

Create dashboards showing:
- Request rate (line chart)
- Error rate (line chart with threshold alerting)
- Latency distribution (heatmap)
- Resource usage (CPU, memory gauges)

```json
{
  "dashboard": {
    "title": "User Service Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{service='user-service'}[5m])"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~'5..'}[5m])) / sum(rate(http_requests_total[5m]))"
          }
        ],
        "alert": {
          "conditions": [{ "evaluator": { "type": "gt", "params": [0.01] } }]
        }
      }
    ]
  }
}
```

---

## 3️⃣ Logging

### **Structured Logging**

```javascript
// BAD: Unstructured logs
console.log('User 123 created order 456 worth $99.99');

// GOOD: Structured logs (JSON)
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'app.log' })
  ]
});

logger.info('Order created', {
  userId: '123',
  orderId: '456',
  amount: 99.99,
  currency: 'USD',
  timestamp: new Date().toISOString()
});
```

**Output:**
```json
{
  "level": "info",
  "message": "Order created",
  "userId": "123",
  "orderId": "456",
  "amount": 99.99,
  "currency": "USD",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Why structured?**
- ✅ Easy to search: `userId:"123"` finds all logs for user 123
- ✅ Easy to aggregate: Count orders by currency
- ✅ Machine-readable: Can be parsed by log aggregators

---

### **Log Levels**

```javascript
logger.error('Payment failed', { orderId: '123', error: err.message });  // Needs immediate attention
logger.warn('Slow query detected', { query: sql, duration: 5000 });     // Potential issue
logger.info('User logged in', { userId: '123' });                       // Normal operation
logger.debug('Cache hit', { key: 'user:123' });                         // Debugging info
```

**Best Practices:**
- ✅ Use appropriate log levels
- ✅ Include context (userId, requestId, traceId)
- ✅ Don't log sensitive data (passwords, credit cards)
- ✅ Don't log too much (high-frequency events can overwhelm storage)

---

### **Centralized Logging (ELK Stack)**

```
Application → Filebeat → Logstash → Elasticsearch → Kibana
                            ↓
                     (Parse, filter, enrich)
```

**Example: Searching logs in Kibana**
```
# Find all errors for user 123
level:"error" AND userId:"123"

# Find slow API calls (>1 second)
duration:>1000 AND route:"/api/*"

# Count errors by service
{
  "aggs": {
    "services": {
      "terms": { "field": "service.keyword" }
    }
  },
  "query": {
    "match": { "level": "error" }
  }
}
```

---

### **Log Correlation (Request ID)**

Track single request across multiple services:

```javascript
// Middleware to add request ID
const { v4: uuidv4 } = require('uuid');

app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('x-request-id', req.id);
  next();
});

// Include request ID in all logs
app.post('/api/orders', async (req, res) => {
  logger.info('Creating order', { requestId: req.id, userId: req.user.id });
  
  try {
    const order = await createOrder(req.body);
    logger.info('Order created', { requestId: req.id, orderId: order.id });
    res.json(order);
  } catch (error) {
    logger.error('Order creation failed', { requestId: req.id, error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// When calling downstream service, propagate request ID
async function chargePayment(orderId, amount, requestId) {
  logger.info('Charging payment', { requestId, orderId, amount });
  
  const response = await axios.post('http://payment-service/charge', {
    orderId,
    amount
  }, {
    headers: { 'x-request-id': requestId }
  });
  
  logger.info('Payment charged', { requestId, orderId, transactionId: response.data.id });
}
```

**Now you can search all logs for one request:**
```
requestId:"abc-123-def"
```

Returns logs from API Gateway, Order Service, Payment Service, etc. — complete flow!

---

## 4️⃣ Distributed Tracing

### **Why Tracing?**

Imagine this scenario:
- User reports: "Checkout is slow"
- Logs show: `POST /checkout took 5 seconds`
- But which part was slow? Database? Payment API? Email service?

**Tracing shows the breakdown:**

```
POST /checkout [5000ms]
  ├─ Validate cart [50ms]
  ├─ Create order [100ms]
  │   └─ db.orders.insert [80ms]
  ├─ Charge payment [4500ms]  ← BOTTLENECK!
  │   ├─ db.payments.insert [30ms]
  │   └─ stripe.charge [4400ms]  ← Root cause
  └─ Send confirmation email [200ms]
      └─ sendgrid.send [180ms]
```

---

### **Implementing Tracing (OpenTelemetry)**

```javascript
const { trace } = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

// Initialize tracer
const provider = new NodeTracerProvider();
provider.addSpanProcessor(
  new BatchSpanProcessor(
    new JaegerExporter({
      endpoint: 'http://jaeger:14268/api/traces'
    })
  )
);
provider.register();

// Auto-instrument HTTP and Express
registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation()
  ]
});

const tracer = trace.getTracer('order-service');

// Manual instrumentation for custom operations
async function createOrder(orderData) {
  const span = tracer.startSpan('createOrder');
  span.setAttribute('user.id', orderData.userId);
  span.setAttribute('order.total', orderData.total);
  
  try {
    // Database operation
    const dbSpan = tracer.startSpan('db.insertOrder', { parent: span });
    const order = await db.orders.insert(orderData);
    dbSpan.end();
    
    // Call payment service
    const paymentSpan = tracer.startSpan('chargePayment', { parent: span });
    await paymentService.charge({ orderId: order.id, amount: order.total });
    paymentSpan.end();
    
    // Send email
    const emailSpan = tracer.startSpan('sendEmail', { parent: span });
    await emailService.send({ to: orderData.email, template: 'order_confirmation' });
    emailSpan.end();
    
    span.setStatus({ code: SpanStatusCode.OK });
    return order;
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    throw error;
  } finally {
    span.end();
  }
}
```

---

### **Context Propagation**

Trace context must be passed between services via HTTP headers:

```javascript
// Outgoing request (automatically handled by OpenTelemetry HTTP instrumentation)
const axios = require('axios');

async function chargePayment(orderData, parentSpan) {
  // OpenTelemetry automatically injects trace context into headers:
  // traceparent: 00-{trace-id}-{span-id}-01
  
  const response = await axios.post('http://payment-service/charge', orderData);
  return response.data;
}

// Receiving service extracts trace context from headers
// and continues the trace
```

**Trace Headers (W3C Trace Context standard):**
```
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             ^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^ ^^
             |  |                                |                   |
             |  |                                |                   Flags (01 = sampled)
             |  |                                Span ID (16 hex digits)
             |  Trace ID (32 hex digits)
             Version
```

---

## 5️⃣ Alerting

### **What to Alert On**

#### **Symptom-Based Alerts (User Impact):**
- ✅ High error rate (>1%)
- ✅ High latency (p95 > 2 seconds)
- ✅ Low availability (uptime < 99.9%)

#### **Cause-Based Alerts (Infrastructure):**
- ⚠️ High CPU usage (>80%)
- ⚠️ Low disk space (<10%)
- ⚠️ Database connection pool exhausted

**Prefer symptom-based alerts.** High CPU doesn't necessarily mean users are affected.

---

### **Alert Configuration (Prometheus Alertmanager)**

```yaml
groups:
- name: user-service
  interval: 30s
  rules:
  
  # High error rate
  - alert: HighErrorRate
    expr: |
      sum(rate(http_requests_total{status=~"5..",service="user-service"}[5m])) 
      / 
      sum(rate(http_requests_total{service="user-service"}[5m])) 
      > 0.01
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate on user-service"
      description: "Error rate is {{ $value | humanizePercentage }}"
  
  # High latency
  - alert: HighLatency
    expr: |
      histogram_quantile(0.95, 
        rate(http_request_duration_seconds_bucket{service="user-service"}[5m])
      ) > 2
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High latency on user-service"
      description: "P95 latency is {{ $value }}s"
  
  # Service down
  - alert: ServiceDown
    expr: up{service="user-service"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "user-service is down"
```

---

### **Alert Routing**

```yaml
# alertmanager.yml
route:
  receiver: 'team-slack'
  group_by: ['alertname', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  
  routes:
  # Critical alerts go to PagerDuty (wake up on-call engineer)
  - match:
      severity: critical
    receiver: 'pagerduty'
  
  # Warnings go to Slack
  - match:
      severity: warning
    receiver: 'team-slack'

receivers:
- name: 'team-slack'
  slack_configs:
  - api_url: 'https://hooks.slack.com/services/...'
    channel: '#alerts'
    text: '{{ range .Alerts }}{{ .Annotations.summary }}: {{ .Annotations.description }}{{ end }}'

- name: 'pagerduty'
  pagerduty_configs:
  - service_key: 'xxx'
```

---

## 6️⃣ Health Checks

### **Liveness Probe**

Is the service alive? If not, restart it.

```javascript
// Simple liveness check
app.get('/health/live', (req, res) => {
  res.json({ status: 'ok' });
});

// Kubernetes will restart pod if this fails
```

---

### **Readiness Probe**

Is the service ready to receive traffic? If not, don't send requests.

```javascript
// Check database connection
app.get('/health/ready', async (req, res) => {
  try {
    await db.query('SELECT 1');  // Test database
    await redis.ping();          // Test Redis
    res.json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message });
  }
});

// Kubernetes won't send traffic until this returns 200
```

---

### **Kubernetes Health Check Config**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: user-service
spec:
  containers:
  - name: user-service
    image: user-service:v1
    
    livenessProbe:
      httpGet:
        path: /health/live
        port: 3000
      initialDelaySeconds: 30
      periodSeconds: 10
      failureThreshold: 3  # Restart after 3 failures
    
    readinessProbe:
      httpGet:
        path: /health/ready
        port: 3000
      initialDelaySeconds: 10
      periodSeconds: 5
      failureThreshold: 2  # Remove from load balancer after 2 failures
```

---

## 7️⃣ Observability Stack Example

### **Full Stack**

```
┌───────────────────────────────────────────────┐
│            Application Layer                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Service1 │  │ Service2 │  │ Service3 │    │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘    │
│        │             │             │          │
│   Metrics       Logs         Traces           │
└────────┼─────────────┼─────────────┼──────────┘
         │             │             │
         ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Prometheus  │ │    ELK      │ │   Jaeger    │
│  (Metrics)  │ │   (Logs)    │ │  (Traces)   │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │
       └───────────────┴───────────────┘
                       │
                       ▼
               ┌─────────────┐
               │   Grafana   │
               │ (Dashboards)│
               └─────────────┘
```

---

### **Unified Observability (Modern Approach)**

```
Application → OpenTelemetry Collector → Backend
               (Metrics, Logs, Traces)

Backends:
- Datadog
- New Relic
- Honeycomb
- Grafana Cloud (Loki + Tempo + Mimir)
```

**Benefits:**
- ✅ Single SDK (OpenTelemetry)
- ✅ Vendor-neutral
- ✅ Correlate metrics, logs, traces in one view

---

## 8️⃣ Best Practices

### **1. Use Correlation IDs**

Link metrics, logs, and traces with same request ID.

```javascript
logger.info('Order created', { 
  traceId: span.spanContext().traceId,
  orderId: order.id 
});
```

Now you can:
1. See error in logs (traceId: abc-123)
2. Click to view full trace in Jaeger
3. See all metrics for that request

---

### **2. Sample Traces**

Don't trace 100% of requests (too expensive). Sample based on:
- Traffic volume (1% of requests if high traffic)
- Errors (always trace failed requests)
- Slow requests (always trace if latency > threshold)

```javascript
const sampler = new TraceIdRatioBasedSampler(0.01);  // 1% sampling

// Or: Sample all errors
if (error || duration > 1000) {
  sampler.shouldSample();  // Always sample
}
```

---

### **3. Monitor the Four Golden Signals**

From Google's SRE book:

1. **Latency**: How long requests take
2. **Traffic**: How many requests
3. **Errors**: Rate of failed requests
4. **Saturation**: How "full" your service is (CPU, memory, disk)

---

### **4. Set SLOs (Service Level Objectives)**

```
Availability SLO: 99.9% (43 minutes/month downtime allowed)
Latency SLO: 95% of requests < 500ms
Error Rate SLO: < 0.1%
```

Alert when SLO is at risk (don't wait for 100% breach).

---

## Summary

**Metrics**: What is broken?  
**Logs**: Why is it broken?  
**Traces**: Where is it broken?

**Essential Tools:**
- Prometheus + Grafana (metrics)
- ELK Stack or Loki (logs)
- Jaeger or Tempo (traces)
- Alertmanager (alerts)

**Key Practices:**
- ✅ Use structured logging
- ✅ Track request IDs across services
- ✅ Instrument critical paths
- ✅ Alert on symptoms, not causes
- ✅ Monitor the four golden signals
- ✅ Set and track SLOs
