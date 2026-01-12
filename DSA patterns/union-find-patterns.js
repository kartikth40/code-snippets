// PATTERN NAME: Union-Find (Disjoint Set Union)

// PROBLEM TYPES:
// - Dynamic connectivity problems
// - Network connectivity
// - Clustering problems
// - Image processing (connected components)
// - Kruskal's algorithm for Minimum Spanning Tree

// WHEN TO USE:
// - When you need to efficiently manage and merge disjoint sets
// - When you need to check if two elements are in the same set
// - When you need to dynamically connect components
// - When you need to track connected components in a graph

// CORE IDEA (INTUITION):
// - Represent each element as a node in a tree
// - Each tree represents a set, with the root node as the representative
// - Use path compression to flatten the tree during 'find' operations
// - Use union by rank/size to keep trees shallow during 'union' operations

// INVARIANTS:
// - Each element points to its parent, and the root points to itself
// - The rank/size of a tree is maintained to optimize unions
// - Path compression ensures that future 'find' operations are faster
// - Union by rank/size ensures that the smaller tree is always added under the larger tree

// COMMON OPERATIONS:
// - find(x): Returns the representative (root) of the set containing x
// - union(x, y): Merges the sets containing x and y
// - isConnected(x, y): Checks if x and y are in the same set

// TEMPLATE / SKELETON:

class UnionFind {
  constructor() {
    this.parents = new Map()
    this.ranks = new Map()
  }

  find(x) {
    if (!this.parents.has(x)) {
      this.parents.set(x, x)
      this.ranks.set(x, 0)
    }

    if (this.parents.get(x) !== x) {
      this.parents.set(x, this.find(this.parents.get(x)))
    }

    return this.parents.get(x)
  }

  union(x, y) {
    let rootX = this.find(x)
    let rootY = this.find(y)

    if (rootX === rootY) {
      // already united
      return false
    }

    if (this.ranks.get(rootX) > this.ranks.get(rootY)) {
      this.parents.set(rootY, rootX)
    } else if (this.ranks.get(rootY) > this.ranks.get(rootX)) {
      this.parents.set(rootX, rootY)
    } else {
      this.parents.set(rootY, rootX)
      this.ranks.set(rootX, this.ranks.get(rootX) + 1)
    }

    return true
  }

  isConnected(x, y) {
    return this.find(x) === this.find(y)
  }
}

var distanceLimitedPathsExist = function (n, edgeList, queries) {
  let answer = new Array(queries.length).fill(false)

  for (let i = 0; i < queries.length; i++) {
    queries[i] = [...queries[i], i]
  }

  queries = queries.sort((a, b) => a[2] - b[2])
  edgeList = edgeList.sort((a, b) => a[2] - b[2])

  let uf = new UnionFind()

  let edgeIdx = 0
  for (let [p, q, limit, orgIdx] of queries) {
    while (edgeIdx < edgeList.length && limit > edgeList[edgeIdx][2]) {
      let [x, y] = edgeList[edgeIdx]
      uf.union(x, y)
      edgeIdx++
    }

    if (uf.isConnected(p, q)) {
      answer[orgIdx] = true
    }
  }

  return answer
}

// COMMON MISTAKES:
// - Not implementing path compression in 'find' operation
// - Not using union by rank/size in 'union' operation
// - Forgetting to initialize parent and rank for new elements
// - Assuming all elements are known beforehand
// - Not handling edge cases where elements are not connected

// TIME & SPACE:
// - Time Complexity: O(α(N)) per operation, where α is the inverse Ackermann function
// which grows very slowly, effectively constant for all practical N.
// For interviews, we can consider it O(1) amortized time per operation.
// - Space Complexity: O(N) for storing parent and rank maps

// RELATED PROBLEMS:
// - Number of Connected Components in an Undirected Graph
// - Redundant Connection
// - Satisfiability of Equality Equations
// - Accounts Merge
// - Graph Valid Tree
// - Friend Circles
// - Smallest String With Swaps
