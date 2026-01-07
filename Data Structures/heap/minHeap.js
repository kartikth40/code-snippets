class MinHeap {
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

  #up(i) {
    const h = this.h
    while (i > 0) {
      const p = Math.floor((i - 1) / 2)
      if (h[p] <= h[i]) break
      ;[h[p], h[i]] = [h[i], h[p]]
      i = p
    }
  }

  #down(i) {
    const h = this.h
    const n = h.length
    while (true) {
      let smallest = i
      const l = 2 * i + 1,
        r = 2 * i + 2
      if (l < n && h[l] < h[smallest]) smallest = l
      if (r < n && h[r] < h[smallest]) smallest = r
      if (smallest === i) break
      ;[h[i], h[smallest]] = [h[smallest], h[i]]
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