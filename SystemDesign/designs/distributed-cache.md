# Distributed Cache System Design (Redis/Memcached)
> **SDE-2 Interview Ready** | 45-minute format

## 🎯 Problem Statement

Design a distributed caching system like Redis or Memcached that:
- Stores key-value pairs in memory
- Fast read/write operations (<1ms)
- Distributed across multiple servers
- Handles cache eviction (LRU, LFU)
- High availability with replication

**Use Cases:**
- Session storage
- Database query caching
- API response caching
- Rate limiting

---

## 1️⃣ Requirements Clarification

### Functional Requirements:

1. **Basic Operations**
   - `SET key value [TTL]` - Store key-value with optional expiration
   - `GET key` - Retrieve value by key
   - `DELETE key` - Remove key
   - `EXISTS key` - Check if key exists

2. **Advanced Features**
   - TTL (Time-to-live) expiration
   - Atomic operations (INCR, DECR)
   - Data structures (strings, lists, sets, hashes)

3. **Distributed Features**
   - Horizontal scaling (multiple cache nodes)
   - Consistent hashing for key distribution
   - Replication for high availability

### Non-Functional Requirements:
- **Latency:** <1ms for read/write
- **Throughput:** 100K ops/sec per node
- **Availability:** 99.99% uptime
- **Scalability:** Add/remove nodes dynamically
- **Consistency:** Eventually consistent (AP system in CAP theorem)

### Out of Scope:
- Persistence to disk (pure in-memory cache)
- Complex transactions
- Pub/Sub messaging

---

## 2️⃣ Capacity Estimation

```
Cache Size:
- Average key size: 50 bytes
- Average value size: 500 bytes
- Total per entry: 550 bytes
- 10M keys: 550 bytes × 10M = 5.5 GB
- Single node capacity: 16 GB RAM → 30M keys

Throughput:
- 100K ops/sec per node
- 10 nodes → 1M ops/sec

Replication:
- Use master-slave replication (1 master, 2 replicas)
- Increases availability to 99.99%
```

---

## 3️⃣ API Design

```javascript
// 1. Set Key-Value
SET key value [EX seconds]
Example: SET user:123:session "abc123xyz" EX 3600

Response: OK

// 2. Get Value
GET key
Example: GET user:123:session

Response: "abc123xyz"

// 3. Delete Key
DEL key
Example: DEL user:123:session

Response: 1  (number of keys deleted)

// 4. Check Existence
EXISTS key
Example: EXISTS user:123:session

Response: 1  (true) or 0 (false)

// 5. Increment Counter (Atomic)
INCR key
Example: INCR page:views:123

Response: 501  (new value after increment)

// 6. Set Expiration
EXPIRE key seconds
Example: EXPIRE user:123:session 3600

Response: 1  (success)

// 7. Get TTL
TTL key
Example: TTL user:123:session

Response: 3500  (seconds remaining, -1 = no expiry, -2 = key doesn't exist)
```

---

## 4️⃣ Database Design

### In-Memory Data Structure

```javascript
// Hash Table (main storage)
const cache = new Map();  // Key → { value, expiresAt }

// LRU Linked List (eviction)
const lruList = new DoublyLinkedList();  // Most recent → Least recent

// Data structure
class CacheEntry {
  key: string;
  value: any;
  expiresAt: number | null;  // Unix timestamp
  lruNode: ListNode;  // Reference to LRU list node
}
```

---

## 5️⃣ High-Level Design

```
┌──────────────────────────────────────────────────────┐
│                  Clients                             │
│  (Application Servers)                               │
└───────────┬──────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────┐
│      Cache Client Library                             │
│  - Consistent hashing                                 │
│  - Connection pooling                                 │
│  - Retry logic                                        │
└─────┬─────────────┬─────────────┬──────────────┬──────┘
      │             │             │              │
      ▼             ▼             ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  Cache   │  │  Cache   │  │  Cache   │  │  Cache   │
│  Node 1  │  │  Node 2  │  │  Node 3  │  │  Node 4  │
│ (Master) │  │ (Master) │  │ (Master) │  │ (Master) │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │
     │             │             │             │
   ┌─┴──┐        ┌─┴──┐        ┌─┴──┐        ┌─┴──┐
   │Rep1│        │Rep1│        │Rep1│        │Rep1│
   └────┘        └────┘        └────┘        └────┘
   ┌────┐        ┌────┐        ┌────┐        ┌────┐
   │Rep2│        │Rep2│        │Rep2│        │Rep2│
   └────┘        └────┘        └────┘        └────┘
```

**Data Distribution:**
- Consistent hashing to distribute keys across nodes
- Each key belongs to one master node
- Master replicates to 2 replicas (async)

---

## 6️⃣ Low-Level Design

### Class Diagram

```
┌────────────────────────┐
│   CacheNode            │
├────────────────────────┤
│ - hashTable: Map       │
│ - lruList: LRUList     │
│ - maxSize: number      │
├────────────────────────┤
│ + get(key): value      │
│ + set(key, value, ttl) │
│ + delete(key): boolean │
│ + evict(): void        │
└────────────────────────┘
       │
       │ uses
       ▼
┌────────────────────────┐
│   LRUList              │
├────────────────────────┤
│ - head: Node           │
│ - tail: Node           │
├────────────────────────┤
│ + moveToFront(node)    │
│ + removeLast(): Node   │
└────────────────────────┘
```

---

## 7️⃣ Deep Dives

### Deep Dive 1: LRU Cache Implementation

**Challenge:** Evict least recently used items when cache is full

**Solution: Hash Table + Doubly Linked List**

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();  // key → { value, node }
    this.head = new ListNode();  // Dummy head
    this.tail = new ListNode();  // Dummy tail
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }
    
    const entry = this.cache.get(key);
    
    // Check expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.delete(key);
      return null;
    }
    
    // Move to front (most recently used)
    this.moveToFront(entry.node);
    
    return entry.value;
  }
  
  set(key, value, ttl = null) {
    // Delete if exists (will re-add)
    if (this.cache.has(key)) {
      this.delete(key);
    }
    
    // Evict if at capacity
    if (this.cache.size >= this.capacity) {
      this.evictLRU();
    }
    
    // Create new entry
    const node = new ListNode(key);
    const expiresAt = ttl ? Date.now() + (ttl * 1000) : null;
    
    this.cache.set(key, { value, expiresAt, node });
    
    // Add to front
    this.addToFront(node);
  }
  
  delete(key) {
    if (!this.cache.has(key)) {
      return false;
    }
    
    const entry = this.cache.get(key);
    this.removeNode(entry.node);
    this.cache.delete(key);
    
    return true;
  }
  
  evictLRU() {
    // Remove tail (least recently used)
    const lruNode = this.tail.prev;
    
    if (lruNode !== this.head) {
      this.removeNode(lruNode);
      this.cache.delete(lruNode.key);
    }
  }
  
  // Helper: Move node to front
  moveToFront(node) {
    this.removeNode(node);
    this.addToFront(node);
  }
  
  // Helper: Add node to front
  addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }
  
  // Helper: Remove node from list
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
}

class ListNode {
  constructor(key = null) {
    this.key = key;
    this.prev = null;
    this.next = null;
  }
}
```

**Time Complexity:**
- GET: O(1)
- SET: O(1)
- DELETE: O(1)
- EVICT: O(1)

**Space Complexity:** O(n) where n = number of keys

---

### Deep Dive 2: Consistent Hashing (Distributed Cache)

**Challenge:** Distribute keys across multiple cache nodes, minimize data movement when nodes are added/removed

**Solution: Consistent Hashing with Virtual Nodes**

```javascript
class ConsistentHash {
  constructor(nodes, virtualNodesPerNode = 150) {
    this.ring = new Map();  // hash → node
    this.sortedHashes = [];
    this.virtualNodesPerNode = virtualNodesPerNode;
    
    // Add all nodes
    nodes.forEach(node => this.addNode(node));
  }
  
  addNode(node) {
    // Create virtual nodes (replicas)
    for (let i = 0; i < this.virtualNodesPerNode; i++) {
      const virtualNodeId = `${node.id}:${i}`;
      const hash = this.hash(virtualNodeId);
      
      this.ring.set(hash, node);
      this.sortedHashes.push(hash);
    }
    
    // Keep hashes sorted
    this.sortedHashes.sort((a, b) => a - b);
  }
  
  removeNode(node) {
    // Remove all virtual nodes
    for (let i = 0; i < this.virtualNodesPerNode; i++) {
      const virtualNodeId = `${node.id}:${i}`;
      const hash = this.hash(virtualNodeId);
      
      this.ring.delete(hash);
      const index = this.sortedHashes.indexOf(hash);
      this.sortedHashes.splice(index, 1);
    }
  }
  
  getNode(key) {
    if (this.sortedHashes.length === 0) {
      return null;
    }
    
    const keyHash = this.hash(key);
    
    // Find first node clockwise (binary search)
    let left = 0;
    let right = this.sortedHashes.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      if (this.sortedHashes[mid] === keyHash) {
        return this.ring.get(this.sortedHashes[mid]);
      } else if (this.sortedHashes[mid] < keyHash) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    // If not found, wrap around to first node
    if (left >= this.sortedHashes.length) {
      left = 0;
    }
    
    return this.ring.get(this.sortedHashes[left]);
  }
  
  hash(key) {
    // Use CRC32 or MurmurHash for fast hashing
    return crc32(key);
  }
}

// Usage
const nodes = [
  { id: 'cache-1', host: '10.0.0.1', port: 6379 },
  { id: 'cache-2', host: '10.0.0.2', port: 6379 },
  { id: 'cache-3', host: '10.0.0.3', port: 6379 }
];

const hashRing = new ConsistentHash(nodes);

// Get node for key
const node = hashRing.getNode('user:123:session');
console.log(`Key should be stored on ${node.id}`);
```

**Benefits:**
- ✅ Adding/removing nodes affects only 1/N of keys (minimal data movement)
- ✅ Even distribution with virtual nodes
- ✅ Fast lookup O(log N)

**Without Consistent Hashing:**
- Simple hash: `node = hash(key) % N`
- Problem: Adding node changes N → All keys rehashed → 100% data movement!

**With Consistent Hashing:**
- Adding node → Only 1/N keys move
- Removing node → Only 1/N keys move

---

### Deep Dive 3: Replication & High Availability

**Challenge:** If cache node fails, all its data is lost

**Solution: Master-Slave Replication**

```javascript
class CacheCluster {
  constructor() {
    this.masters = [];
    this.replicas = new Map();  // master → [replica1, replica2]
  }
  
  async set(key, value, ttl) {
    // 1. Find master node using consistent hashing
    const master = this.hashRing.getNode(key);
    
    // 2. Write to master (synchronous)
    await master.set(key, value, ttl);
    
    // 3. Asynchronously replicate to slaves
    const replicas = this.replicas.get(master.id);
    
    if (replicas) {
      // Fire-and-forget replication (async)
      this.replicateAsync(key, value, ttl, replicas);
    }
  }
  
  async get(key) {
    // 1. Find master node
    const master = this.hashRing.getNode(key);
    
    // 2. Try master first
    try {
      return await master.get(key);
    } catch (err) {
      // 3. Fallback to replica if master is down
      const replicas = this.replicas.get(master.id);
      
      if (replicas && replicas.length > 0) {
        return await replicas[0].get(key);
      }
      
      throw err;
    }
  }
  
  async replicateAsync(key, value, ttl, replicas) {
    // Replicate to all replicas in parallel
    await Promise.all(
      replicas.map(replica => 
        replica.set(key, value, ttl).catch(err => {
          console.error(`Replication failed to ${replica.id}`, err);
        })
      )
    );
  }
  
  // Failover: Promote replica to master
  async handleMasterFailure(failedMaster) {
    const replicas = this.replicas.get(failedMaster.id);
    
    if (replicas && replicas.length > 0) {
      // Promote first replica to master
      const newMaster = replicas[0];
      
      // Update hash ring
      this.hashRing.removeNode(failedMaster);
      this.hashRing.addNode(newMaster);
      
      // Remaining replicas become replicas of new master
      this.replicas.set(newMaster.id, replicas.slice(1));
      this.replicas.delete(failedMaster.id);
      
      console.log(`Promoted ${newMaster.id} to master`);
    }
  }
}
```

**Replication Strategies:**

**1. Asynchronous Replication (Used above)**
- Master writes immediately, replicates async
- ✅ Low latency
- ❌ Possible data loss if master fails before replication

**2. Synchronous Replication**
- Master waits for replica ACK before responding
- ✅ No data loss
- ❌ Higher latency

**Trade-off:** For caching, asynchronous is acceptable (cache misses are okay)

---

## 8️⃣ Bottlenecks & Optimizations

### Bottlenecks:

1. **Single-threaded** → Use thread pool or async I/O (Redis uses single-threaded event loop)
2. **Network latency** → Connection pooling, pipelining
3. **Hotspot keys** → Client-side caching, split hot keys

### Optimizations:

**1. Pipelining (Batch Commands):**
```javascript
// Instead of 3 round trips:
await cache.set('key1', 'val1');
await cache.set('key2', 'val2');
await cache.set('key3', 'val3');

// Use pipeline (1 round trip):
await cache.pipeline([
  ['set', 'key1', 'val1'],
  ['set', 'key2', 'val2'],
  ['set', 'key3', 'val3']
]);
```

**2. Client-side Caching:**
```javascript
// Cache hot keys in application memory
const localCache = new Map();

async function get(key) {
  if (localCache.has(key)) {
    return localCache.get(key);
  }
  
  const value = await redisCache.get(key);
  localCache.set(key, value);
  
  return value;
}
```

**3. Connection Pooling:**
```
Reuse TCP connections instead of creating new ones
Reduces connection overhead (3-way handshake)
```

---

## 9️⃣ Interview Tips

### What to Focus on (45-min):

1. **Clarify requirements** (5 min)
   - Pure in-memory or persistent?
   - Eviction policy (LRU, LFU)?
   - Distributed?

2. **High-level design** (10 min)
   - Hash table + LRU list
   - Consistent hashing for distribution

3. **Deep dive 1: LRU implementation** (15 min)
   - Hash table + doubly linked list
   - O(1) operations

4. **Deep dive 2: Consistent hashing** (10 min)
   - Virtual nodes
   - Minimal data movement

5. **Discuss replication** (5 min)
   - Master-slave
   - Async vs sync

6. **Bottlenecks** (5 min)

### Common Follow-ups:

**Q: LRU vs LFU eviction?**
A: 
- LRU (Least Recently Used): Evict oldest accessed item
- LFU (Least Frequently Used): Evict least accessed item (requires counter)

**Q: How do you handle cache stampede?**
A: Use locking/semaphore, only one process fetches from DB, others wait

**Q: What if all nodes fail?**
A: Application should handle gracefully (fallback to DB), use circuit breaker

**Q: How do you ensure cache coherence (sync with DB)?**
A: 
- Write-through: Update cache + DB simultaneously
- Write-back: Update cache, async update DB
- Cache-aside: Application handles cache + DB separately

**Q: Redis vs Memcached?**
A:
- Redis: Supports data structures (lists, sets), persistence, replication
- Memcached: Simple key-value, multi-threaded, slightly faster for pure caching

---

## Summary

**Key Decisions:**
1. ✅ **LRU eviction** (hash table + doubly linked list)
2. ✅ **Consistent hashing** (distribute keys, virtual nodes)
3. ✅ **Master-slave replication** (async for low latency)
4. ✅ **TTL expiration** (lazy deletion + active deletion)

**Tech Stack:**
- Language: C/Go (low-level performance)
- Network: TCP with connection pooling
- Serialization: MessagePack/Protobuf

**Performance:**
- Latency: <1ms (in-memory)
- Throughput: 100K ops/sec per node
- Availability: 99.99% (with replication)

**Cost (10-node cluster, 160 GB total):**
- AWS ElastiCache (Redis): ~₹80L/month (~$10K USD)
