// Min-Heap based Priority Queue

// A priority queue is an abstract data type that operates similar to a regular queue or stack data structure,
// but where each element has a "priority" associated with it. In a min-priority queue, elements with lower
// priority values are served before elements with higher priority values.

// Time Complexity:
// - Insertion (enqueue): O(log n)
// - Removal of minimum element (dequeue): O(log n)
// - Peek at minimum element: O(1)

// When to use:
// - When you need to efficiently retrieve and remove the element with the highest priority (lowest value).
// - When implementing algorithms like Dijkstra's shortest path or Prim's minimum spanning tree.
// - When managing tasks with varying levels of urgency.

// Algorithm Implementation:
// The priority queue is implemented using a binary min-heap, which is a complete binary tree
// where each node is less than or equal to its children.

class MinPriorityQueue {
  constructor(compareFn) {
    this.heap = []
    // Default comparator: assumes elements have a priority property or are numbers
    this.compare = compareFn || ((a, b) => a - b)

    // Helper methods for heap indexing
    this.parent = (i) => Math.floor((i - 1) / 2)
    this.leftChild = (i) => 2 * i + 1
    this.rightChild = (i) => 2 * i + 2

    // Insert element
    this.enqueue = function (element) {
      this.heap.push(element)
      this.heapifyUp(this.heap.length - 1)
    }

    // Remove and return element with minimum priority
    this.dequeue = function () {
      if (this.heap.length === 0) return null
      if (this.heap.length === 1) return this.heap.pop()

      const min = this.heap[0]
      this.heap[0] = this.heap.pop()
      this.heapifyDown(0)
      return min
    }

    // Bubble up to maintain min heap property
    this.heapifyUp = function (index) {
      while (index > 0) {
        const parentIndex = this.parent(index)
        if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) break;

        // Swap with parent
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]]
        index = parentIndex
      }
    }

    // Bubble down to maintain min heap property
    this.heapifyDown = function (index) {
      while (this.leftChild(index) < this.heap.length) {
        const leftIndex = this.leftChild(index)
        const rightIndex = this.rightChild(index)
        let minIndex = leftIndex

        // Find child with minimum priority
        if (rightIndex < this.heap.length &&
          this.compare(this.heap[rightIndex], this.heap[leftIndex]) < 0) {
          minIndex = rightIndex
        }

        // If parent is already smaller than both children, stop
        if (this.compare(this.heap[index], this.heap[minIndex]) <= 0) break;

        // Swap with smaller child
        [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]]
        index = minIndex
      }
    }

    // Peek at minimum element without removing
    this.peek = function () {
      return this.heap.length > 0 ? this.heap[0] : null
    }

    // Check if queue is empty
    this.isEmpty = function () {
      return this.heap.length === 0
    }

    // Get size of queue
    this.size = function () {
      return this.heap.length
    }
  }
}

export { MinPriorityQueue }

// Usage examples:

// Example 1: Simple numbers (default comparator)
// const pq1 = new MinPriorityQueue()
// pq1.enqueue(5)
// pq1.enqueue(2)
// pq1.enqueue(8)
// console.log(pq1.dequeue()) // 2

// Example 2: Custom comparator for arrays [distance, node]
// const pq2 = new MinPriorityQueue((a, b) => a[0] - b[0])
// pq2.enqueue([10, 'A'])
// pq2.enqueue([5, 'B'])
// pq2.enqueue([15, 'C'])
// console.log(pq2.dequeue()) // [5, 'B']

// Example 3: Custom comparator for objects
// const pq3 = new MinPriorityQueue((a, b) => a.priority - b.priority)
// pq3.enqueue({ name: "Task A", priority: 3 })
// pq3.enqueue({ name: "Task B", priority: 1 })
// pq3.enqueue({ name: "Task C", priority: 2 })
// console.log(pq3.dequeue()) // { name: "Task B", priority: 1 }