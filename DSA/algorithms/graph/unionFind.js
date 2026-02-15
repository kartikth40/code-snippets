// Union-Find (Disjoint Set Union) implementation with path compression and union by rank

// Detect cycle in undirected graph using Union-Find
// Algorithm steps:
// 1. Initialize each element to be its own parent (self root) and rank 0.
// 2. For each union operation, find the roots of the elements.
// 3. If roots are different, union them by rank.
// 4. If roots are the same, a cycle is detected.

// Time Complexity: O(α(N)) per operation, where α is the inverse Ackermann function
// which grows very slowly, effectively constant for all practical N.
// For interviews, we can consider it O(1) amortized time per operation.
// Space Complexity: O(N) for storing parent and rank

// usage of Union-Find data structure:
// 1. Cycle detection in undirected graphs
// 2. Connected components in graphs
// 3. Kruskal's algorithm for Minimum Spanning Tree
// 4. Network connectivity problems

class UnionFind {
  constructor() {
    this.parent = new Map();
    this.rank = new Map();
  }

  find(x) {
    // Step 1: Initialize new element if not seen before
    if (!this.parent.has(x)) {
      this.parent.set(x, x);    // Element is its own parent (root)
      this.rank.set(x, 0);      // Initial rank is 0
    }
    
    // Step 2: Path compression optimization
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x))); // Recursive call
    }
    
    // Step 3: Return the root
    return this.parent.get(x);
  }

  union(x, y) {
    const rootX = this.find(x)
    const rootY = this.find(y)

    if (rootX === rootY) {
      return false // Already in the same set
    }

    // Union by rank
    // Case 1: rootX has higher rank
    if (this.rank.get(rootX) > this.rank.get(rootY)) {
      this.parent.set(rootY, rootX)
      // No rank change needed - rootX's rank stays the same
    }

    // Case 2: rootY has higher rank
    else if (this.rank.get(rootX) < this.rank.get(rootY)) {
      this.parent.set(rootX, rootY)
      // No rank change needed - rootY's rank stays the same
    }

    // Case 3: Both have equal rank
    else {
      this.parent.set(rootY, rootX) // rootX becomes the new root
      this.rank.set(rootX, this.rank.get(rootX) + 1) // Only rootX rank increases
    }
    return true
  }

  connected(x, y) {
    return this.find(x) === this.find(y);
  }
}

export {UnionFind}


// Example usage:
// const uf = new UnionFind();
// uf.union(1, 2);
// uf.union(2, 3);
// uf.union(4, 5);
// uf.union(5, 6);

// console.log(uf.connected(1, 3)); // true
// console.log(uf.connected(1, 4)); // false
// uf.union(3, 4);
// console.log(uf.connected(1, 4)); // true


// Questions for practice:
// - Checking Existence of Edge Length Limited Paths
