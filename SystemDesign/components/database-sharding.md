# Database Sharding (Component Deep Dive)

## 🎯 What is Database Sharding?

Sharding is a horizontal partitioning strategy that splits a large database into smaller, more manageable pieces called **shards**. Each shard is a separate database that holds a subset of the data.

**Why Shard?**
- 📈 **Scalability**: Single database can't handle billions of rows
- ⚡ **Performance**: Smaller databases = faster queries
- 💰 **Cost**: Cheaper to scale horizontally (add servers) than vertically (bigger server)
- 🌍 **Geography**: Store data closer to users

---

## 📊 Vertical vs Horizontal Partitioning

### **Vertical Partitioning (Split by Columns)**
```sql
-- Original table
Users: id | name | email | bio | avatar_url | preferences

-- Split into two tables
UsersBasic: id | name | email
UsersProfile: id | bio | avatar_url | preferences

Use: Separate frequently accessed from rarely accessed columns
```

### **Horizontal Partitioning (Split by Rows)** ⭐ Sharding
```sql
-- Shard 1
Users: (id: 1-1M)

-- Shard 2
Users: (id: 1M-2M)

-- Shard 3
Users: (id: 2M-3M)

Use: Distribute data across multiple servers
```

---

## 🔧 Sharding Strategies

### 1. **Range-Based Sharding**

```javascript
function getShard(userId) {
  if (userId >= 1 && userId <= 1000000) return 'shard1';
  if (userId >= 1000001 && userId <= 2000000) return 'shard2';
  if (userId >= 2000001 && userId <= 3000000) return 'shard3';
}

// Query
const shard = getShard(userId);
const user = await shard.query('SELECT * FROM users WHERE id = ?', [userId]);
```

**Pros:**
- ✅ Simple to implement
- ✅ Easy to add new shards (add range)
- ✅ Range queries efficient (users 1M-1.5M → single shard)

**Cons:**
- ❌ Uneven data distribution (hotspots possible)
- ❌ Newer data gets more traffic (last shard overloaded)
- ❌ Hard to rebalance

**Use Cases:**
- Time-series data (shard by date)
- Logs, analytics events
- Sequential IDs

---

### 2. **Hash-Based Sharding** ⭐ Most Common

```javascript
function getShard(userId) {
  const shardCount = 4;
  const hash = murmurhash(userId.toString());
  const shardIndex = hash % shardCount;
  
  return shards[shardIndex];
}

// Examples
getShard(123)   → shard2
getShard(456)   → shard0
getShard(789)   → shard3
```

**Hash Function:**
```javascript
function murmurhash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
```

**Pros:**
- ✅ Even data distribution
- ✅ No hotspots
- ✅ Simple hash function

**Cons:**
- ❌ Range queries require querying all shards
- ❌ Adding/removing shards requires rehashing (data migration)
- ❌ Hard to rebalance

**Use Cases:**
- User data (shard by user_id)
- Product catalog (shard by product_id)
- General purpose

---

### 3. **Consistent Hashing** ⭐ Best for Dynamic Shards

```javascript
class ConsistentHash {
  constructor(shards = [], virtualNodes = 150) {
    this.ring = new Map();
    this.virtualNodes = virtualNodes;
    shards.forEach(shard => this.addShard(shard));
  }
  
  addShard(shard) {
    // Add virtual nodes for even distribution
    for (let i = 0; i < this.virtualNodes; i++) {
      const hash = this.hash(`${shard}:${i}`);
      this.ring.set(hash, shard);
    }
  }
  
  removeShard(shard) {
    for (let i = 0; i < this.virtualNodes; i++) {
      const hash = this.hash(`${shard}:${i}`);
      this.ring.delete(hash);
    }
  }
  
  getShard(key) {
    const hash = this.hash(key);
    
    // Find first shard clockwise on ring
    const sortedHashes = [...this.ring.keys()].sort((a, b) => a - b);
    for (const ringHash of sortedHashes) {
      if (ringHash >= hash) {
        return this.ring.get(ringHash);
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

// Usage
const ch = new ConsistentHash(['shard1', 'shard2', 'shard3']);

ch.getShard('user:123') → shard2
ch.getShard('user:456') → shard1

// Add new shard - only ~25% data needs to move
ch.addShard('shard4');
```

**Pros:**
- ✅ Minimal data movement when adding/removing shards (~1/N data moves)
- ✅ Even distribution with virtual nodes
- ✅ Dynamic scaling

**Cons:**
- ❌ More complex to implement
- ❌ Range queries still require all shards

**Use Cases:**
- Distributed caches (Redis, Memcached)
- Cloud storage systems
- When frequent shard changes expected

---

### 4. **Geographic Sharding**

```javascript
function getShard(userId) {
  const userCountry = getUserCountry(userId);
  
  if (['US', 'CA', 'MX'].includes(userCountry)) return 'shard_americas';
  if (['UK', 'FR', 'DE', 'IT'].includes(userCountry)) return 'shard_europe';
  if (['IN', 'CN', 'JP', 'SG'].includes(userCountry)) return 'shard_asia';
  
  return 'shard_global';
}
```

**Pros:**
- ✅ Low latency (data close to users)
- ✅ Regulatory compliance (GDPR, data residency)
- ✅ Natural partitioning

**Cons:**
- ❌ Uneven distribution (more users in some regions)
- ❌ Cross-region queries expensive
- ❌ Complexity in global features

**Use Cases:**
- Global applications (Facebook, Instagram)
- Data privacy requirements (EU GDPR)
- Multi-region deployments

---

### 5. **Directory-Based Sharding**

```javascript
// Lookup table (can be in separate database or cache)
const directory = {
  'user:123': 'shard1',
  'user:456': 'shard2',
  'user:789': 'shard1'
};

function getShard(userId) {
  const key = `user:${userId}`;
  return directory[key] || 'shard_default';
}

// When user data grows too large, migrate to different shard
directory['user:123'] = 'shard3';
```

**Pros:**
- ✅ Flexible (can rebalance individual records)
- ✅ No fixed sharding logic
- ✅ Easy to migrate hot data

**Cons:**
- ❌ Lookup table = single point of failure / bottleneck
- ❌ Extra hop for every query
- ❌ Directory can become large

**Use Cases:**
- When sharding key changes frequently
- Complex sharding requirements
- Migration from unsharded to sharded

---

## 🗂️ Choosing the Shard Key

**Good Shard Key Properties:**
- ✅ **High Cardinality**: Many unique values (e.g., user_id ✅, country ❌)
- ✅ **Even Distribution**: Avoids hotspots
- ✅ **Query Friendly**: Queries include shard key (no scatter-gather)
- ✅ **Immutable**: Doesn't change (changing = data migration)

**Examples:**

| Shard Key | Cardinality | Distribution | Best For |
|-----------|-------------|--------------|----------|
| user_id | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | User data |
| email | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | User data |
| timestamp | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ (recent = hotspot) | Time-series |
| country | ⭐⭐ | ⭐⭐ (uneven) | Geographic |
| tenant_id | ⭐⭐⭐⭐ | ⭐⭐⭐ | Multi-tenant SaaS |

**Bad Shard Keys:**
- ❌ **Boolean fields** (male/female → only 2 shards)
- ❌ **Status fields** (active/inactive → uneven)
- ❌ **Timestamp** (recent data = hotspot)

---

## 🎯 Querying Sharded Data

### **Single-Shard Query (Fast)** ✅
```javascript
// Query includes shard key
async function getUser(userId) {
  const shard = getShard(userId);
  const user = await shard.query('SELECT * FROM users WHERE id = ?', [userId]);
  return user;
}

// Latency: 10ms
```

### **Scatter-Gather Query (Slow)** ❌
```javascript
// Query does NOT include shard key - must query ALL shards
async function getUserByEmail(email) {
  const promises = shards.map(shard => 
    shard.query('SELECT * FROM users WHERE email = ?', [email])
  );
  
  const results = await Promise.all(promises);
  return results.flat().find(user => user !== null);
}

// Latency: 10ms * num_shards (if 10 shards = 100ms)
```

**Solution: Denormalize or Secondary Index**
```javascript
// Option 1: Store email → user_id mapping
const userId = await emailIndex.get(email);
const shard = getShard(userId);
const user = await shard.query('SELECT * FROM users WHERE id = ?', [userId]);

// Option 2: Global secondary index (Elasticsearch)
const user = await elasticsearch.search({
  index: 'users',
  body: { query: { match: { email } } }
});
```

---

## 🔗 Handling Joins Across Shards

### **Problem:**
```sql
-- Works in single database
SELECT orders.*, users.name 
FROM orders 
JOIN users ON orders.user_id = users.id;

-- Doesn't work with sharding:
-- orders and users might be on different shards
```

### **Solutions:**

#### 1. **Denormalize** ⭐ Best
```javascript
// Store user data in orders table
Orders: id | user_id | user_name | product_id | total

// No join needed
const orders = await shard.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
```

#### 2. **Application-Level Join**
```javascript
// Fetch from multiple shards, join in app
const orders = await ordersShard.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
const user = await usersShard.query('SELECT * FROM users WHERE id = ?', [userId]);

const result = orders.map(order => ({
  ...order,
  user_name: user.name
}));
```

#### 3. **Co-locate Related Data** (Shard by Same Key)
```sql
-- Shard both users and orders by user_id
-- All user's data on same shard
Shard 1: users (id: 1-1M), orders (user_id: 1-1M)
Shard 2: users (id: 1M-2M), orders (user_id: 1M-2M)

-- Join works within shard
SELECT orders.*, users.name 
FROM orders 
JOIN users ON orders.user_id = users.id
WHERE users.id = 123;
```

---

## 🔄 Rebalancing Shards

### **When to Rebalance:**
- Shard becomes too large (>1TB)
- Uneven data distribution (shard1 = 10GB, shard2 = 500GB)
- Adding new shards
- Hot shard (one shard gets 90% traffic)

### **Rebalancing Strategies:**

#### 1. **Online Migration (Zero Downtime)**
```javascript
// Step 1: Start dual writes (write to both old and new shard)
async function writeUser(userId, data) {
  const oldShard = getOldShard(userId);
  const newShard = getNewShard(userId);
  
  await Promise.all([
    oldShard.insert(data),
    newShard.insert(data)
  ]);
}

// Step 2: Background job migrates old data
async function migrateData() {
  const users = await oldShard.query('SELECT * FROM users WHERE id >= ? AND id < ?', [start, end]);
  
  for (const user of users) {
    await newShard.insert(user);
  }
}

// Step 3: Switch reads to new shard
async function readUser(userId) {
  const newShard = getNewShard(userId);
  return await newShard.query('SELECT * FROM users WHERE id = ?', [userId]);
}

// Step 4: Stop dual writes, delete old data
```

#### 2. **Virtual Shards**
```javascript
// Create 256 virtual shards, map to 4 physical shards
const virtualShardCount = 256;
const physicalShardCount = 4;

function getVirtualShard(userId) {
  return hash(userId) % virtualShardCount;
}

function getPhysicalShard(virtualShard) {
  return Math.floor(virtualShard / (virtualShardCount / physicalShardCount));
}

// Add 5th physical shard: remap virtual shards 200-255 → shard5
// Only ~20% data needs to move
```

---

## 🏗️ Database Sharding Architectures

### **1. Application-Level Sharding**
```
App ──→ Sharding Logic ──→ Shard 1
                        ──→ Shard 2
                        ──→ Shard 3

Pros: Full control
Cons: App handles complexity
```

### **2. Proxy-Based Sharding** ⭐
```
App ──→ Proxy (Vitess, ProxySQL) ──→ Shard 1
                                  ──→ Shard 2
                                  ──→ Shard 3

Pros: App unaware of sharding
Cons: Proxy = potential bottleneck
```

### **3. Database-Native Sharding**
```
Examples:
- MongoDB (automatic sharding)
- Cassandra (partition key)
- CockroachDB (range-based)
- Citus (PostgreSQL extension)

Pros: Built-in, optimized
Cons: Vendor-specific
```

---

## 🛠️ Sharding Implementation Example

```javascript
class ShardManager {
  constructor(shards) {
    this.shards = shards; // Array of database connections
  }
  
  // Hash-based sharding
  getShard(key) {
    const hash = this.hash(key);
    const index = hash % this.shards.length;
    return this.shards[index];
  }
  
  hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
  
  // Insert
  async insert(tableName, data) {
    const shard = this.getShard(data.id);
    return await shard.query(`INSERT INTO ${tableName} SET ?`, data);
  }
  
  // Get by ID (single shard)
  async getById(tableName, id) {
    const shard = this.getShard(id);
    const results = await shard.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
    return results[0];
  }
  
  // Scatter-gather query
  async getAll(tableName, condition) {
    const promises = this.shards.map(shard => 
      shard.query(`SELECT * FROM ${tableName} WHERE ${condition}`)
    );
    
    const results = await Promise.all(promises);
    return results.flat();
  }
  
  // Count (aggregate across shards)
  async count(tableName) {
    const promises = this.shards.map(shard => 
      shard.query(`SELECT COUNT(*) as count FROM ${tableName}`)
    );
    
    const results = await Promise.all(promises);
    return results.reduce((sum, result) => sum + result[0].count, 0);
  }
}

// Usage
const shardManager = new ShardManager([shard1Connection, shard2Connection, shard3Connection]);

await shardManager.insert('users', { id: 123, name: 'Alice' });
const user = await shardManager.getById('users', 123);
const totalUsers = await shardManager.count('users');
```

---

## ⚠️ Common Pitfalls

| Problem | Solution |
|---------|----------|
| **Hotspots** | Use hash-based sharding, not range-based |
| **Cross-shard joins** | Denormalize data or co-locate related data |
| **Scatter-gather slow** | Add secondary indexes (Elasticsearch) |
| **Auto-increment IDs** | Use globally unique IDs (UUID, Snowflake ID) |
| **Transactions** | Avoid cross-shard transactions (use sagas) |
| **Schema changes** | Apply to all shards simultaneously |

---

## 🆔 Globally Unique IDs (Required for Sharding)

### **Problem with Auto-Increment:**
```sql
-- Each shard has id=1, id=2, id=3...
Shard 1: users (id: 1, 2, 3, ...)
Shard 2: users (id: 1, 2, 3, ...) ← Conflict!
```

### **Solutions:**

#### 1. **UUID (128-bit)** ✅
```javascript
const { v4: uuidv4 } = require('uuid');

const userId = uuidv4(); // '550e8400-e29b-41d4-a716-446655440000'

// Pros: Truly unique, no coordination
// Cons: Large (36 chars), not time-sortable, poor database index performance
```

#### 2. **Twitter Snowflake (64-bit)** ⭐ Best
```javascript
class SnowflakeID {
  constructor(datacenterId, workerId) {
    this.epoch = 1609459200000; // Custom epoch (Jan 1, 2021)
    this.datacenterIdBits = 5;
    this.workerIdBits = 5;
    this.sequenceBits = 12;
    
    this.datacenterId = datacenterId;
    this.workerId = workerId;
    this.sequence = 0;
    this.lastTimestamp = -1;
  }
  
  generate() {
    let timestamp = Date.now();
    
    // Handle clock moving backwards
    if (timestamp < this.lastTimestamp) {
      throw new Error('Clock moved backwards');
    }
    
    // Same millisecond
    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & ((1 << this.sequenceBits) - 1);
      
      if (this.sequence === 0) {
        // Sequence overflow - wait for next millisecond
        while (timestamp <= this.lastTimestamp) {
          timestamp = Date.now();
        }
      }
    } else {
      this.sequence = 0;
    }
    
    this.lastTimestamp = timestamp;
    
    // Construct 64-bit ID
    const id = 
      ((timestamp - this.epoch) << (this.datacenterIdBits + this.workerIdBits + this.sequenceBits)) |
      (this.datacenterId << (this.workerIdBits + this.sequenceBits)) |
      (this.workerId << this.sequenceBits) |
      this.sequence;
    
    return id.toString();
  }
}

const snowflake = new SnowflakeID(1, 1);
const id = snowflake.generate(); // '7234567890123456'

// Pros: Time-sortable, 64-bit (fits in long), k-sorted
// Cons: Requires coordination (datacenter + worker ID)
```

**Snowflake Structure:**
```
64 bits total:
- 41 bits: timestamp (milliseconds since custom epoch)
- 5 bits: datacenter ID (32 datacenters)
- 5 bits: worker ID (32 workers per datacenter)
- 12 bits: sequence (4096 IDs per millisecond)

Capacity: 4096 IDs/ms per worker = 4M IDs/sec per worker
```

---

## 📊 When to Shard?

**Shard when:**
- ✅ Single database >1TB (slow queries, expensive backups)
- ✅ High traffic >10K QPS per database
- ✅ Read/write bottleneck on single server
- ✅ Need geographic data distribution

**Don't shard if:**
- ❌ Data <100GB (vertical scaling sufficient)
- ❌ Traffic <1K QPS (caching + read replicas sufficient)
- ❌ Can partition by service (microservices)
- ❌ Team lacks sharding expertise

**Alternatives to Sharding:**
1. **Caching** (Redis) - Reduce database load by 90%
2. **Read Replicas** - Scale reads horizontally
3. **Vertical Scaling** - Bigger database server (up to 96 cores, 768GB RAM)
4. **Partitioning** - Split within single database (PostgreSQL partitions)
5. **Microservices** - Split by domain (users DB, products DB, orders DB)

---

## Summary

**Database Sharding:**
- 📈 Horizontal partitioning to scale beyond single database
- 🎯 Shard by high-cardinality, immutable key (user_id ✅, status ❌)
- ⚖️ Hash-based (even distribution) or Range-based (range queries)
- 🔄 Consistent hashing for dynamic shard addition/removal
- 🆔 Use globally unique IDs (Snowflake ID ⭐)

**Best Practices:**
- Denormalize data to avoid cross-shard joins
- Co-locate related data on same shard
- Use proxy layer (Vitess) to hide sharding from app
- Plan for rebalancing from day one
- Start with fewer shards (4-8), add as needed
- Monitor shard size and traffic distribution

**Next Steps:**
- Learn about [Load Balancer](load-balancer.md) for request distribution
- Understand [Caching](caching.md) to reduce database load
