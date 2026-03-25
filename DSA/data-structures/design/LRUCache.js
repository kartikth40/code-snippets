// LRU Cache Implementation

// Least Recently Used (LRU) Cache — one of the most common SDE-2 interview questions.
// Supports get and put in O(1) time using a Hash Map + Doubly Linked List.

// Time Complexity:
// - get: O(1)
// - put: O(1)
// Space: O(capacity)

// When to use:
// - Cache with fixed capacity that evicts least recently used items
// - Any problem requiring O(1) access + O(1) eviction of oldest entry
// - System design: caching layer, browser history, page replacement

class DLLNode {
  constructor(key = 0, val = 0) {
    this.key = key
    this.val = val
    this.prev = null
    this.next = null
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.map = new Map() // key → DLLNode

    // Dummy head and tail to avoid null checks
    this.head = new DLLNode()
    this.tail = new DLLNode()
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  // Move node to front (most recently used)
  #addToFront(node) {
    node.next = this.head.next
    node.prev = this.head
    this.head.next.prev = node
    this.head.next = node
  }

  // Remove node from its current position
  #removeNode(node) {
    node.prev.next = node.next
    node.next.prev = node.prev
  }

  // Move existing node to front
  #moveToFront(node) {
    this.#removeNode(node)
    this.#addToFront(node)
  }

  // Remove and return the least recently used node (before tail)
  #removeLRU() {
    const lru = this.tail.prev
    this.#removeNode(lru)
    return lru
  }

  get(key) {
    if (!this.map.has(key)) return -1

    const node = this.map.get(key)
    this.#moveToFront(node) // mark as recently used
    return node.val
  }

  put(key, value) {
    if (this.map.has(key)) {
      // Update existing
      const node = this.map.get(key)
      node.val = value
      this.#moveToFront(node)
    } else {
      // Add new
      if (this.map.size === this.capacity) {
        // Evict LRU
        const lru = this.#removeLRU()
        this.map.delete(lru.key)
      }

      const newNode = new DLLNode(key, value)
      this.#addToFront(newNode)
      this.map.set(key, newNode)
    }
  }
}

// Examples
const cache = new LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
console.log(cache.get(1))    // 1
cache.put(3, 3)              // evicts key 2
console.log(cache.get(2))    // -1 (evicted)
cache.put(4, 4)              // evicts key 1
console.log(cache.get(1))    // -1 (evicted)
console.log(cache.get(3))    // 3
console.log(cache.get(4))    // 4
