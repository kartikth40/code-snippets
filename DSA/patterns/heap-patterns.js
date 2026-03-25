// PATTERN NAME: Heap / Priority Queue Patterns

// WHEN TO USE:
// - Top K / Kth largest or smallest element
// - Merge K sorted lists/arrays
// - Running median (two heaps)
// - Scheduling problems (task with deadlines/priorities)
// - Any problem needing repeated access to min or max element

// CORE IDEA (INTUITION):
// - Heap gives O(log n) insert and O(1) access to min/max
// - For "Top K smallest": use a MAX-heap of size k (evict largest when full)
// - For "Top K largest": use a MIN-heap of size k (evict smallest when full)
// - For "Merge K sorted": put first element of each list in min-heap, pop and push next

// INVARIANTS:
// - Heap size is maintained at k for Top-K problems
// - After processing all elements, heap contains the answer
// - For two-heap median: maxHeap.size >= minHeap.size (or differ by at most 1)

// ─── INLINE HEAP IMPLEMENTATIONS ────────────────────────────────────────────

class MinHeap {
  constructor(compareFn = (a, b) => a - b) {
    this.h = []
    this.cmp = compareFn
  }
  push(val) { this.h.push(val); this.#up(this.h.length - 1) }
  pop() {
    if (this.h.length === 1) return this.h.pop()
    const top = this.h[0]; this.h[0] = this.h.pop(); this.#down(0); return top
  }
  peek() { return this.h[0] }
  size() { return this.h.length }
  #up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1
      if (this.cmp(this.h[p], this.h[i]) <= 0) break
      ;[this.h[p], this.h[i]] = [this.h[i], this.h[p]]; i = p
    }
  }
  #down(i) {
    const n = this.h.length
    while (true) {
      let s = i; const l = 2*i+1, r = 2*i+2
      if (l < n && this.cmp(this.h[l], this.h[s]) < 0) s = l
      if (r < n && this.cmp(this.h[r], this.h[s]) < 0) s = r
      if (s === i) break
      ;[this.h[i], this.h[s]] = [this.h[s], this.h[i]]; i = s
    }
  }
}

class MaxHeap {
  constructor(compareFn = (a, b) => b - a) {
    this.h = []
    this.cmp = compareFn
  }
  push(val) { this.h.push(val); this.#up(this.h.length - 1) }
  pop() {
    if (this.h.length === 1) return this.h.pop()
    const top = this.h[0]; this.h[0] = this.h.pop(); this.#down(0); return top
  }
  peek() { return this.h[0] }
  size() { return this.h.length }
  #up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1
      if (this.cmp(this.h[p], this.h[i]) <= 0) break
      ;[this.h[p], this.h[i]] = [this.h[i], this.h[p]]; i = p
    }
  }
  #down(i) {
    const n = this.h.length
    while (true) {
      let s = i; const l = 2*i+1, r = 2*i+2
      if (l < n && this.cmp(this.h[l], this.h[s]) < 0) s = l
      if (r < n && this.cmp(this.h[r], this.h[s]) < 0) s = r
      if (s === i) break
      ;[this.h[i], this.h[s]] = [this.h[s], this.h[i]]; i = s
    }
  }
}

// ─── PROBLEMS ────────────────────────────────────────────────────────────────

// === TOP K FREQUENT ELEMENTS ===
// Min-heap of size k: evict least frequent when heap exceeds k
function topKFrequent(nums, k) {
  const freq = new Map()
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1)

  // Min-heap ordered by frequency — keep k most frequent
  const heap = new MinHeap((a, b) => a[1] - b[1])

  for (const entry of freq) {
    heap.push(entry)
    if (heap.size() > k) heap.pop() // evict least frequent
  }

  return heap.h.map(([num]) => num)
}

// === KTH LARGEST ELEMENT ===
// Min-heap of size k: root is always the kth largest seen so far
function findKthLargest(nums, k) {
  const heap = new MinHeap()

  for (const n of nums) {
    heap.push(n)
    if (heap.size() > k) heap.pop() // evict smallest
  }

  return heap.peek() // root = kth largest
}

// === MERGE K SORTED LISTS ===
// Min-heap: always pop the globally smallest element, push its successor
function mergeKLists(lists) {
  // Each entry: [value, listIndex, elementIndex]
  const heap = new MinHeap((a, b) => a[0] - b[0])
  const result = []

  // Seed heap with first element of each list
  for (let i = 0; i < lists.length; i++) {
    if (lists[i].length > 0) {
      heap.push([lists[i][0], i, 0])
    }
  }

  while (heap.size() > 0) {
    const [val, li, ei] = heap.pop()
    result.push(val)
    if (ei + 1 < lists[li].length) {
      heap.push([lists[li][ei + 1], li, ei + 1])
    }
  }

  return result
}

// === K CLOSEST POINTS TO ORIGIN ===
// Max-heap of size k on distance: evict farthest when heap exceeds k
function kClosest(points, k) {
  const dist = ([x, y]) => x * x + y * y
  const heap = new MaxHeap((a, b) => dist(b) - dist(a)) // max by distance

  for (const p of points) {
    heap.push(p)
    if (heap.size() > k) heap.pop() // evict farthest
  }

  return heap.h
}

// === RUNNING MEDIAN ===
// Max-heap for lower half, min-heap for upper half
class MedianFinder {
  constructor() {
    this.lo = new MaxHeap() // smaller half
    this.hi = new MinHeap() // larger half
  }

  addNum(num) {
    this.lo.push(num)
    this.hi.push(this.lo.pop())           // balance: lo max <= hi min
    if (this.lo.size() < this.hi.size()) {
      this.lo.push(this.hi.pop())         // lo always >= hi in size
    }
  }

  findMedian() {
    return this.lo.size() > this.hi.size()
      ? this.lo.peek()
      : (this.lo.peek() + this.hi.peek()) / 2
  }
}

// === REORGANIZE STRING ===
// Max-heap by frequency: always place the most frequent remaining char
function reorganizeString(s) {
  const freq = new Map()
  for (const c of s) freq.set(c, (freq.get(c) || 0) + 1)

  const heap = new MaxHeap((a, b) => b[1] - a[1]) // max by count
  for (const entry of freq) heap.push(entry)

  if (heap.peek()[1] > Math.ceil(s.length / 2)) return ""

  let result = ''
  while (heap.size() > 1) {
    const [c1, f1] = heap.pop()
    const [c2, f2] = heap.pop()
    result += c1 + c2
    if (f1 - 1 > 0) heap.push([c1, f1 - 1])
    if (f2 - 1 > 0) heap.push([c2, f2 - 1])
  }

  if (heap.size() === 1) result += heap.pop()[0]
  return result
}

// COMMON MISTAKES:
// - Using max-heap when you need min-heap (or vice versa) for Top-K
// - For "K largest": use MIN-heap of size k (counterintuitive but correct)
// - For "K smallest": use MAX-heap of size k
// - Forgetting to seed merge K heap with first element of each list
// - In median finder: not rebalancing after every insertion
// - In reorganize string: not checking feasibility before building result

// TIME & SPACE:
// - Top K Frequent: O(n log k) time, O(n + k) space
// - Kth Largest: O(n log k) time, O(k) space
// - Merge K Sorted: O(N log k) time, O(k) space (k = number of lists)
// - K Closest Points: O(n log k) time, O(k) space
// - Running Median: O(log n) per addNum, O(n) space
// - Reorganize String: O(n log 26) = O(n) time, O(26) space

// RELATED PROBLEMS:
// - Top K Frequent Elements (LC 347)
// - Kth Largest Element (LC 215)
// - Merge K Sorted Lists (LC 23)
// - K Closest Points to Origin (LC 973)
// - Find Median from Data Stream (LC 295)
// - Reorganize String (LC 767)
// - Task Scheduler (LC 621)
// - Sort Characters by Frequency (LC 451)
// - Ugly Number II (LC 264)
// - Last Stone Weight (LC 1046)

console.log(topKFrequent([1,1,1,2,2,3], 2))        // [1, 2] (order may vary)
console.log(findKthLargest([3,2,1,5,6,4], 2))      // 5
console.log(mergeKLists([[1,4,5],[1,3,4],[2,6]]))   // [1,1,2,3,4,4,5,6]
console.log(kClosest([[1,3],[-2,2],[5,8],[0,1]], 2)) // closest 2 points

const mf = new MedianFinder()
mf.addNum(1); mf.addNum(2)
console.log(mf.findMedian())  // 1.5
mf.addNum(3)
console.log(mf.findMedian())  // 2

console.log(reorganizeString("aab"))   // "aba"
console.log(reorganizeString("aaab"))  // ""
