// Kruskal's Algorithm to find the Minimum Spanning Tree (MST) of a graph

// Can solve for undirected, connected, cyclic graphs with non-negative weights
// Greedy Algorithm
// Time Complexity: O(E log E) where E is the number of edges
// Greedy choice: always add the smallest edge that doesn't form a cycle

// CORE IDEA (INTUITION):
// Kruskal's algorithm builds the Minimum Spanning Tree (MST) by sorting all edges in non-decreasing order of their weight and adding them one by one to the MST, ensuring that no cycles are formed using a Union-Find data structure.

// INVARIANTS:
// - At each step, the edges included in the MST do not form a cycle.
// - The algorithm maintains a sorted list of edges and uses the Union-Find structure to efficiently check for cycles.

// Requires Union-Find (Disjoint Set Union) data structure


import { UnionFind } from "./unionFind.js"
function spanningTree(V, edges) {
  let graph = Array.from({ length: V }, () => [])
  edges.sort((a,b) => a[2] - b[2])
  let uf = new UnionFind()

  let sum = 0
  for(let [u,v,w] of edges) {
    if(!uf.connected(u, v)) {
      uf.union(u, v)
      sum += w
    }
  }
  return sum
}

// Example usage:
const V = 5
const edges = [
  [0, 1, 2],
  [0, 3, 6],
  [1, 2, 3],
  [1, 3, 8],
  [1, 4, 5],
  [2, 4, 7],
  [3, 4, 9],
]
console.log(spanningTree(V, edges)) // Output: 16
