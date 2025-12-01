class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i)
    this.rank = Array(n).fill(1)
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x])
    }
    return this.parent[x]
  }

  union(a, b) {
    const pa = this.find(a)
    const pb = this.find(b)
    if (pa === pb) return false

    if (this.rank[pa] < this.rank[pb]) {
      this.parent[pa] = pb
    } else if (this.rank[pb] < this.rank[pa]) {
      this.parent[pb] = pa
    } else {
      this.parent[pb] = pa
      this.rank[pa]++
    }
    return true
  }
}