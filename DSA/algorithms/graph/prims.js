// Prim's MST Algorithm

// Can solve for undirected, connected, cyclic graphs with non-negative weights
// Greedy Algorithm
// Time Complexity: O(E log V) where V is the number of vertices and E is the number of edges
// Greedy choice: always expand the least costly edge that connects a new vertex to the growing MST

// CORE IDEA (INTUITION):
// Prim's algorithm builds the Minimum Spanning Tree (MST) by starting from an arbitrary vertex and repeatedly adding the smallest edge that connects a vertex in the MST to a vertex outside the MST.

// INVARIANTS:
// - At each step, the set of vertices included in the MST is connected and has the minimum possible total edge weight.
// - The algorithm maintains a priority queue of edges that connect the MST to vertices not yet included.


import { MinPriorityQueue } from "../../data-structures/heap/PriorityQueue.js"
function spanningTree(V, edges) {
  let graph = Array.from({ length: V }, () => [])
  for (let [u, v, w] of edges) {
    graph[u].push([v, w])
    graph[v].push([u, w])
  }
  let visited = new Array(V).fill(0)
  let pq = new MinPriorityQueue((a,b) => a[1] - b[1]) // [node, weight]
  pq.enqueue([0, 0])
  let sum = 0
  while (!pq.isEmpty()) {
    let [node, weight] = pq.dequeue()

    if (visited[node]) continue
    visited[node] = 1
    sum += weight

    for (let [nei, wei] of graph[node]) {
      if (!visited[nei]) {
        pq.enqueue([nei, wei])
      }
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