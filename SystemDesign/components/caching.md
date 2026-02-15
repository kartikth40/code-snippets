# Caching (Component Deep Dive)

## 🎯 What is Caching?

Caching stores frequently accessed data in a fast storage layer to reduce latency and load on backend systems.

**Benefits:**
- ⚡ **Faster response times** (RAM access ~1ms vs DB query ~100ms)
- 💰 **Cost reduction** (fewer DB reads, less compute)
- 📈 **Scalability** (handle more traffic with same backend)
- 🛡️ **Reliability** (serve cached data if backend fails)

---

## 📊 Cache Hierarchy

```
L1: Browser Cache (1-5ms)
    ↓
L2: CDN Cache (10-50ms)
    ↓
L3: Application Cache / Redis (1-10ms)
    ↓
L4: Database Query Cache (10-50ms)
    ↓
Database (100-500ms)
```

---

## 🔧 Caching Strategies

### 1. **Cache-Aside (Lazy Loading)** ⭐ Most Common

```javascript
async function getUser(userId) {
  // 1. Check cache first
  const cached = await redis.get(`user:${userId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 2. Cache miss - fetch from database
  const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  
  // 3. Update cache for next time
  await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 3600); // 1 hour TTL
  
  return user;
}
```

**Pros:**
- ✅ Only requested data is cached (efficient memory usage)
- ✅ Resilient to cache failures (app still works)
- ✅ Simple to implement

**Cons:**
- ❌ Cache miss penalty (first request is slow)
- ❌ Stale data possible if not invalidated properly
- ❌ Each cache miss = 3 round trips (check cache, query DB, update cache)

**Use Cases:**
- Read-heavy workloads
- User profiles, product catalogs
- Data that doesn't change frequently

---

### 2. **Write-Through Cache**

```javascript
async function updateUser(userId, data) {
  // 1. Write to database
  await db.query('UPDATE users SET name = ? WHERE id = ?', [data.name, userId]);
  
  // 2. Immediately update cache
  await redis.set(`user:${userId}`, JSON.stringify(data), 'EX', 3600);
  
  return data;
}
```

**Pros:**
- ✅ Cache always consistent with database
- ✅ No cache miss for recently written data
- ✅ Data durability (written to DB immediately)

**Cons:**
- ❌ Slower writes (wait for both DB + cache)
- ❌ Cache may store data that's never read (wasted memory)
- ❌ Write latency increases

**Use Cases:**
- Applications requiring strong consistency
- Read-after-write patterns
- Banking, financial transactions

---

### 3. **Write-Behind (Write-Back) Cache**

```javascript
async function updateUser(userId, data) {
  // 1. Write to cache immediately (fast)
  await redis.set(`user:${userId}`, JSON.stringify(data), 'EX', 3600);
  
  // 2. Asynchronously write to database (background job)
  await queue.enqueue('writeUserToDB', { userId, data });
  
  return data;
}

// Background worker
async function writeUserToDB(job) {
  const { userId, data } = job;
  await db.query('UPDATE users SET name = ? WHERE id = ?', [data.name, userId]);
}
```

**Pros:**
- ✅ Very fast writes (only cache write is synchronous)
- ✅ Batch writes to DB (better throughput)
- ✅ Reduces database load significantly

**Cons:**
- ❌ Risk of data loss if cache crashes before DB write
- ❌ Complex implementation (need reliable queue)
- ❌ Eventual consistency

**Use Cases:**
- High write throughput systems
- Gaming leaderboards, analytics dashboards
- When eventual consistency is acceptable

---

### 4. **Refresh-Ahead (Proactive)**

```javascript
// Set cache with TTL
await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 3600);

// Before expiration, refresh cache
setInterval(async () => {
  const ttl = await redis.ttl(`user:${userId}`);
  
  if (ttl < 300) { // Refresh if <5 minutes remaining
    const freshUser = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    await redis.set(`user:${userId}`, JSON.stringify(freshUser), 'EX', 3600);
  }
}, 60000); // Check every minute
```

**Pros:**
- ✅ Minimizes cache miss penalty
- ✅ Predictable response times
- ✅ Good for frequently accessed data

**Cons:**
- ❌ Difficult to predict which data to refresh
- ❌ Wasted refreshes if data not accessed
- ❌ Increased complexity

**Use Cases:**
- Homepage content, trending products
- Data accessed predictably (daily reports)
- Real-time dashboards

---

## 🗑️ Cache Eviction Policies

### 1. **LRU (Least Recently Used)** ⭐ Most Common

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Maintains insertion order
  }
  
  get(key) {
    if (!this.cache.has(key)) return null;
    
    // Move to end (mark as recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  put(key, value) {
    // Remove if exists (to re-insert at end)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Evict oldest if at capacity
    if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
}
```

**Pros:** Evicts truly unused data  
**Cons:** Doesn't account for access frequency  
**Use:** General-purpose caching

---

### 2. **LFU (Least Frequently Used)**

```javascript
class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // key → {value, frequency}
  }
  
  get(key) {
    if (!this.cache.has(key)) return null;
    
    const item = this.cache.get(key);
    item.frequency++;
    return item.value;
  }
  
  put(key, value) {
    if (this.cache.size >= this.capacity) {
      // Find and evict least frequently used
      let minFreq = Infinity, evictKey;
      for (const [k, v] of this.cache) {
        if (v.frequency < minFreq) {
          minFreq = v.frequency;
          evictKey = k;
        }
      }
      this.cache.delete(evictKey);
    }
    
    this.cache.set(key, { value, frequency: 1 });
  }
}
```

**Pros:** Keeps "hot" data in cache  
**Cons:** Old popular items hard to evict  
**Use:** Recommendation systems, analytics

---

### 3. **FIFO (First In First Out)**

**Pros:** Simple to implement  
**Cons:** May evict frequently used data  
**Use:** Simple caching needs

---

### 4. **TTL (Time To Live)**

```javascript
await redis.set('session:abc123', sessionData, 'EX', 900); // 15 minutes

// Auto-expires after TTL
setTimeout(() => {
  redis.del('session:abc123');
}, 900000);
```

**Pros:** Automatic expiration, prevents stale data  
**Cons:** Arbitrary expiration time  
**Use:** Session storage, temporary data

---

## ⏱️ TTL Best Practices

```javascript
// Different TTLs for different data types
const TTLs = {
  userProfile: 3600,        // 1 hour
  productCatalog: 600,      // 10 minutes
  homePageData: 60,         // 1 minute
  sessionData: 1800,        // 30 minutes
  apiResponse: 300          // 5 minutes
};

// Dynamic TTL based on data freshness
function calculateTTL(data) {
  if (data.changesOften) return 60;        // 1 minute
  if (data.changesDaily) return 86400;     // 24 hours
  return 3600;                              // Default 1 hour
}
```

---

## 🔄 Cache Invalidation

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

### 1. **TTL-Based (Passive)**
```javascript
// Automatically expires
redis.set('key', value, 'EX', 3600);
```

### 2. **Event-Based (Active)**
```javascript
// On data update
async function updateUser(userId, data) {
  await db.update('users', userId, data);
  
  // Invalidate cache
  await redis.del(`user:${userId}`);
  
  // Or update cache immediately (write-through)
  await redis.set(`user:${userId}`, JSON.stringify(data), 'EX', 3600);
}
```

### 3. **Tag-Based Invalidation**
```javascript
// Tag cache entries
await redis.set('user:123', userData);
await redis.sadd('tags:user:123', 'user:123');
await redis.sadd('tags:team:5', 'user:123'); // User belongs to team 5

// Invalidate all cache entries for team 5
async function invalidateTeam(teamId) {
  const keys = await redis.smembers(`tags:team:${teamId}`);
  await redis.del(...keys);
}
```

---

## 🌊 Cache Stampede (Thundering Herd)

### **Problem:**
```
Cache expires → 1000 concurrent requests → All miss cache → All query DB → DB overloaded
```

### **Solution 1: Lock-Based**
```javascript
const locked = new Set();

async function getUser(userId) {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  
  // Only first request fetches from DB
  if (locked.has(userId)) {
    await sleep(100); // Wait for first request to populate cache
    return getUser(userId); // Retry
  }
  
  locked.add(userId);
  try {
    const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 3600);
    return user;
  } finally {
    locked.delete(userId);
  }
}
```

### **Solution 2: Probabilistic Early Expiration**
```javascript
async function getUser(userId) {
  const cached = await redis.get(`user:${userId}`);
  const ttl = await redis.ttl(`user:${userId}`);
  
  // Randomly refresh before expiration
  const shouldRefresh = ttl < 300 && Math.random() < 0.1;
  
  if (cached && !shouldRefresh) {
    return JSON.parse(cached);
  }
  
  // Refresh cache
  const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 3600);
  return user;
}
```

---

## 🔥 Hot Key Problem

### **Problem:**
One key (e.g., celebrity user profile) gets 1M req/sec → Single cache server overloaded

### **Solutions:**

#### 1. **Local Caching**
```javascript
// Cache hot data in application memory
const localCache = new Map();

async function getUser(userId) {
  // Check local cache first (fastest)
  if (localCache.has(userId)) {
    return localCache.get(userId);
  }
  
  // Check Redis
  const cached = await redis.get(`user:${userId}`);
  if (cached) {
    const user = JSON.parse(cached);
    localCache.set(userId, user); // Store locally
    return user;
  }
  
  // Fetch from DB
  const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 3600);
  localCache.set(userId, user);
  return user;
}
```

#### 2. **Replication**
```
Hot key replicated across multiple cache servers:
user:celebrity → user:celebrity:1, user:celebrity:2, user:celebrity:3

Randomly select replica:
const replica = Math.floor(Math.random() * 3) + 1;
const key = `user:celebrity:${replica}`;
```

---

## 📊 Cache Efficiency Metrics

```javascript
// Track cache performance
class CacheMetrics {
  constructor() {
    this.hits = 0;
    this.misses = 0;
  }
  
  recordHit() { this.hits++; }
  recordMiss() { this.misses++; }
  
  getHitRate() {
    const total = this.hits + this.misses;
    return (this.hits / total * 100).toFixed(2);
  }
}

const metrics = new CacheMetrics();

async function getWithMetrics(key) {
  const cached = await redis.get(key);
  
  if (cached) {
    metrics.recordHit();
    return cached;
  }
  
  metrics.recordMiss();
  // Fetch from DB...
}

// Monitor hit rate
console.log(`Cache hit rate: ${metrics.getHitRate()}%`);
// Target: >80% for good cache performance
```

**Key Metrics:**
- **Hit Rate**: Hits / (Hits + Misses) — Target: >80%
- **Miss Rate**: Misses / (Hits + Misses) — Lower is better
- **Eviction Rate**: How often cache is full and evicts data
- **Memory Usage**: Current usage vs capacity
- **Latency**: P50, P95, P99 response times

---

## 🗂️ Distributed Caching

### **Single Server Cache (Simple)**
```
App Server 1 ──→ Redis
App Server 2 ──→ Redis
App Server 3 ──→ Redis
```

### **Cache Cluster (Scalable)** ⭐
```
App Servers ──→ Hash(key) % num_servers
                  ↓
               Server 1 (keys A-H)
               Server 2 (keys I-P)
               Server 3 (keys Q-Z)
```

### **Consistent Hashing** ⭐ (Handles server addition/removal)
```javascript
class ConsistentHash {
  constructor(nodes = [], virtualNodes = 150) {
    this.ring = new Map();
    this.virtualNodes = virtualNodes;
    nodes.forEach(node => this.addNode(node));
  }
  
  addNode(node) {
    for (let i = 0; i < this.virtualNodes; i++) {
      const hash = this.hash(`${node}:${i}`);
      this.ring.set(hash, node);
    }
  }
  
  getNode(key) {
    const hash = this.hash(key);
    
    // Find first node clockwise
    const sortedHashes = [...this.ring.keys()].sort((a, b) => a - b);
    for (const nodeHash of sortedHashes) {
      if (nodeHash >= hash) {
        return this.ring.get(nodeHash);
      }
    }
    
    // Wrap around
    return this.ring.get(sortedHashes[0]);
  }
  
  hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
```

---

## 🌍 CDN (Content Delivery Network)

```
User in US → US CDN Edge → Origin Server (California)
User in EU → EU CDN Edge → Origin Server (California)
User in Asia → Asia CDN Edge → Origin Server (California)

Benefits:
✅ Reduced latency (serve from nearest edge)
✅ Reduced bandwidth costs (offload origin)
✅ Better availability (distributed)
✅ DDoS protection
```

**CDN Best Practices:**
```javascript
// Set cache headers for static assets
res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

// Versioned URLs for cache busting
<script src="/js/app.v123.js"></script>

// When app.js changes, deploy as app.v124.js
// Browser fetches new version, old version cached forever
```

---

## ⚠️ Common Pitfalls

| Problem | Solution |
|---------|----------|
| **Stale data** | Use TTL + event-based invalidation |
| **Cache stampede** | Use locks or probabilistic expiration |
| **Memory overflow** | Set max memory + eviction policy |
| **Hot keys** | Use local cache or replication |
| **Cache inconsistency** | Use write-through or invalidation |
| **Over-caching** | Cache only frequently accessed data |

---

## 🏗️ Multi-Level Caching Architecture

```
Request Flow:

1. Browser Cache (200ms saved)
   ↓ miss
2. CDN (500ms saved)
   ↓ miss
3. Application In-Memory Cache (800ms saved)
   ↓ miss
4. Redis Cluster (900ms saved)
   ↓ miss
5. Database Query Cache (950ms saved)
   ↓ miss
6. Database (1000ms)
```

**Example Implementation:**
```javascript
async function getProduct(productId) {
  // L1: In-memory cache (fastest, small)
  if (memoryCache.has(productId)) {
    return memoryCache.get(productId);
  }
  
  // L2: Redis (fast, larger)
  const cached = await redis.get(`product:${productId}`);
  if (cached) {
    const product = JSON.parse(cached);
    memoryCache.set(productId, product); // Populate L1
    return product;
  }
  
  // L3: Database (slow, largest)
  const product = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
  
  // Populate all cache levels
  await redis.set(`product:${productId}`, JSON.stringify(product), 'EX', 3600);
  memoryCache.set(productId, product);
  
  return product;
}
```

---

## 📈 When to Cache?

**Cache if:**
- ✅ Data is read frequently (>10x reads vs writes)
- ✅ Data is expensive to compute/fetch
- ✅ Data doesn't change often
- ✅ Slight staleness is acceptable

**Don't cache if:**
- ❌ Data changes very frequently
- ❌ Strong consistency required
- ❌ Data is accessed rarely
- ❌ Data is already fast to fetch

---

## Summary

**Caching is essential for:**
- ⚡ Performance (reduce latency from 100ms → 1ms)
- 💰 Cost savings (reduce database load by 90%+)
- 📈 Scalability (handle 10x more traffic)

**Best Practices:**
- Use cache-aside for read-heavy workloads
- Implement TTL-based + event-based invalidation
- Monitor cache hit rate (target >80%)
- Use LRU eviction policy for general use
- Prevent cache stampede with locks
- Use consistent hashing for distributed cache
- Implement multi-level caching for high traffic

**Next Steps:**
- Learn about [Load Balancer](load-balancer.md) for distribution
- Understand [Database Sharding](database-sharding.md) for scaling data
