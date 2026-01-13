// MinHeap implementation in JavaScript

// A MinHeap is a binary tree where the value of each node is less than or equal to the values of its children.
// This implementation uses an array to represent the heap.
// The root of the heap is at index 0, and for any node at index i:
// - The left child is at index 2*i + 1
// - The right child is at index 2*i + 2
// - The parent is at index Math.floor((i - 1) / 2)
// The main operations are push (to add an element) and pop (to remove the minimum element).
// Both operations maintain the heap property by bubbling elements up or down as necessary.

// Time Complexity:
// - push: O(log n) in the worst case, where n is the number of elements in the heap.
// - pop: O(log n) in the worst case.

class MinHeap {
  constructor() {
    // Initialize empty heap array
    this.h = []
  }

  push(val) {
    // Add new value to end of heap
    this.h.push(val)
    // Bubble up to maintain heap property
    this.#up(this.h.length - 1)
  }

  pop() {
    // Return null if heap is empty
    if (!this.h.length) return null
    // Return last element if only one element
    if (this.h.length === 1) return this.h.pop()

    // Store minimum value (root)
    const top = this.h[0]
    // Move last element to root
    this.h[0] = this.h.pop()
    // Bubble down to maintain heap property
    this.#down(0)
    return top
  }

  #up(i) {
    const h = this.h
    while (i > 0) {
      // Calculate parent index
      const p = Math.floor((i - 1) / 2)
      // Stop if parent is smaller (heap property satisfied)
      if (h[p] <= h[i]) break
      // Swap with parent
      [h[p], h[i]] = [h[i], h[p]]
      i = p
    }
  }

  #down(i) {
    const h = this.h
    const n = h.length
    while (true) {
      let smallest = i
      // Calculate left and right child indices
      const l = 2 * i + 1,
        r = 2 * i + 2
      // Find smallest among node and its children
      if (l < n && h[l] < h[smallest]) smallest = l
      if (r < n && h[r] < h[smallest]) smallest = r
      // Stop if current node is smallest (heap property satisfied)
      if (smallest === i) break
      // Swap with smallest child
      [h[i], h[smallest]] = [h[smallest], h[i]]
      i = smallest
    }
  }
}


// Example usage:
const minHeap = new MinHeap()
minHeap.push(5)
minHeap.push(3)
minHeap.push(8)
minHeap.push(1)

console.log(minHeap.pop()) // 1