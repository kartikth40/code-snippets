// MaxHeap implementation in JavaScript

// A MaxHeap is a binary tree where the value of each node is greater than
// or equal to the values of its children. The root always holds the maximum.

// Time Complexity:
// - push: O(log n)
// - pop: O(log n)
// - peek: O(1)

// When to use:
// - Kth smallest element (maintain max-heap of size k)
// - Running median (pair with MinHeap)
// - Priority scheduling (highest priority first)
// - Merge K sorted lists (less common, usually MinHeap)

class MaxHeap {
  constructor() {
    this.h = []
  }

  push(val) {
    this.h.push(val)
    this.#up(this.h.length - 1)
  }

  pop() {
    if (!this.h.length) return null
    if (this.h.length === 1) return this.h.pop()

    const top = this.h[0]
    this.h[0] = this.h.pop()
    this.#down(0)
    return top
  }

  peek() {
    return this.h.length > 0 ? this.h[0] : null
  }

  size() {
    return this.h.length
  }

  #up(i) {
    const h = this.h
    while (i > 0) {
      const p = (i - 1) >> 1
      if (h[p] >= h[i]) break
      ;[h[p], h[i]] = [h[i], h[p]]
      i = p
    }
  }

  #down(i) {
    const h = this.h
    const n = h.length
    while (true) {
      let largest = i
      const l = 2 * i + 1,
        r = 2 * i + 2
      if (l < n && h[l] > h[largest]) largest = l
      if (r < n && h[r] > h[largest]) largest = r
      if (largest === i) break
      ;[h[i], h[largest]] = [h[largest], h[i]]
      i = largest
    }
  }
}

// === RUNNING MEDIAN (classic SDE-2 problem) ===
// Use MaxHeap for lower half, MinHeap for upper half
// Median is always accessible from the tops of the heaps
class MedianFinder {
  constructor() {
    this.lo = new MaxHeap()  // max-heap: stores smaller half
    this.hi = new _MinHeap() // min-heap: stores larger half
  }

  addNum(num) {
    this.lo.push(num)
    // Ensure max of lo <= min of hi
    this.hi.push(this.lo.pop())

    // Balance: lo can have at most 1 more element than hi
    if (this.lo.size() < this.hi.size()) {
      this.lo.push(this.hi.pop())
    }
  }

  findMedian() {
    if (this.lo.size() > this.hi.size()) {
      return this.lo.peek()
    }
    return (this.lo.peek() + this.hi.peek()) / 2
  }
}

// MinHeap (inlined to keep file self-contained)
class _MinHeap {
  constructor() { this.h = [] }
  push(val) { this.h.push(val); this.#up(this.h.length - 1) }
  pop() {
    if (!this.h.length) return null
    if (this.h.length === 1) return this.h.pop()
    const top = this.h[0]; this.h[0] = this.h.pop(); this.#down(0); return top
  }
  peek() { return this.h[0] ?? null }
  size() { return this.h.length }
  #up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1
      if (this.h[p] <= this.h[i]) break
      ;[this.h[p], this.h[i]] = [this.h[i], this.h[p]]; i = p
    }
  }
  #down(i) {
    const n = this.h.length
    while (true) {
      let s = i; const l = 2*i+1, r = 2*i+2
      if (l < n && this.h[l] < this.h[s]) s = l
      if (r < n && this.h[r] < this.h[s]) s = r
      if (s === i) break
      ;[this.h[i], this.h[s]] = [this.h[s], this.h[i]]; i = s
    }
  }
}

// Examples
const maxHeap = new MaxHeap()
maxHeap.push(3)
maxHeap.push(1)
maxHeap.push(5)
maxHeap.push(2)
console.log(maxHeap.pop())  // 5
console.log(maxHeap.pop())  // 3
console.log(maxHeap.peek()) // 2

const mf = new MedianFinder()
mf.addNum(1)
mf.addNum(2)
console.log(mf.findMedian())  // 1.5
mf.addNum(3)
console.log(mf.findMedian())  // 2
mf.addNum(4)
console.log(mf.findMedian())  // 2.5
