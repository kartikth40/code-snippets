// Segment Tree Implementation

// A binary tree built on array segments for fast range queries and point updates.
// Each node stores aggregate info (sum, min, max) for a range of the array.

// Time Complexity:
// - Build: O(n)
// - Query: O(log n)
// - Update: O(log n)
// Space: O(4n) ≈ O(n)

// When to use:
// - Range sum/min/max queries WITH updates
// - Need O(log n) per query AND per update
// - Alternatives: Fenwick Tree (simpler, sum only), Sparse Table (O(1) query, no updates)

class SegmentTree {
  constructor(arr) {
    this.n = arr.length
    this.tree = new Array(4 * this.n).fill(0)
    if (this.n > 0) this.#build(arr, 0, 0, this.n - 1)
  }

  #build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start]
      return
    }

    const mid = (start + end) >> 1
    this.#build(arr, 2 * node + 1, start, mid)
    this.#build(arr, 2 * node + 2, mid + 1, end)
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2]
  }

  // Point update: set arr[idx] = val
  update(idx, val) {
    this.#updateHelper(0, 0, this.n - 1, idx, val)
  }

  #updateHelper(node, start, end, idx, val) {
    if (start === end) {
      this.tree[node] = val
      return
    }

    const mid = (start + end) >> 1
    if (idx <= mid) {
      this.#updateHelper(2 * node + 1, start, mid, idx, val)
    } else {
      this.#updateHelper(2 * node + 2, mid + 1, end, idx, val)
    }

    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2]
  }

  // Range sum query [l, r]
  query(l, r) {
    return this.#queryHelper(0, 0, this.n - 1, l, r)
  }

  #queryHelper(node, start, end, l, r) {
    // No overlap
    if (r < start || end < l) return 0
    // Complete overlap
    if (l <= start && end <= r) return this.tree[node]
    // Partial overlap
    const mid = (start + end) >> 1
    return this.#queryHelper(2 * node + 1, start, mid, l, r) +
           this.#queryHelper(2 * node + 2, mid + 1, end, l, r)
  }
}

// Min Segment Tree variant
class MinSegmentTree {
  constructor(arr) {
    this.n = arr.length
    this.tree = new Array(4 * this.n).fill(Infinity)
    if (this.n > 0) this.#build(arr, 0, 0, this.n - 1)
  }

  #build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start]
      return
    }

    const mid = (start + end) >> 1
    this.#build(arr, 2 * node + 1, start, mid)
    this.#build(arr, 2 * node + 2, mid + 1, end)
    this.tree[node] = Math.min(this.tree[2 * node + 1], this.tree[2 * node + 2])
  }

  update(idx, val) {
    this.#updateHelper(0, 0, this.n - 1, idx, val)
  }

  #updateHelper(node, start, end, idx, val) {
    if (start === end) {
      this.tree[node] = val
      return
    }

    const mid = (start + end) >> 1
    if (idx <= mid) this.#updateHelper(2 * node + 1, start, mid, idx, val)
    else this.#updateHelper(2 * node + 2, mid + 1, end, idx, val)

    this.tree[node] = Math.min(this.tree[2 * node + 1], this.tree[2 * node + 2])
  }

  query(l, r) {
    return this.#queryHelper(0, 0, this.n - 1, l, r)
  }

  #queryHelper(node, start, end, l, r) {
    if (r < start || end < l) return Infinity
    if (l <= start && end <= r) return this.tree[node]
    const mid = (start + end) >> 1
    return Math.min(
      this.#queryHelper(2 * node + 1, start, mid, l, r),
      this.#queryHelper(2 * node + 2, mid + 1, end, l, r)
    )
  }
}

// Examples
const seg = new SegmentTree([1, 3, 5, 7, 9, 11])
console.log(seg.query(1, 3))   // 15 (3 + 5 + 7)
seg.update(2, 10)              // change index 2 from 5 to 10
console.log(seg.query(1, 3))   // 20 (3 + 10 + 7)

const minSeg = new MinSegmentTree([2, 5, 1, 4, 9, 3])
console.log(minSeg.query(0, 5))  // 1
console.log(minSeg.query(3, 5))  // 3
minSeg.update(2, 7)
console.log(minSeg.query(0, 2))  // 2
