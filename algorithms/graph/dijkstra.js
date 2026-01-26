// Dijkstra's Algorithm (Single Source Shortest Path)


// Can solve for cyclic and acyclic graphs with non-negative weights
// Greedy Algorithm
// Time Complexity: O((V + E) log V) where V is the number of vertices and E is the number of edges

// Greedy choice: always expand the least costly node first
// Finds the shortest path from source to all other nodes in the graph
// Can't find shortest paths with constraints on number of edges or negative weights (bellman-ford can)

import { MinPriorityQueue } from "../../data-structures/heap/PriorityQueue.js"
function dijkstra(graph, src) {
  const nodes = Object.keys(graph)
  const n = nodes.length
  const dist = Array(n).fill(Infinity)
  dist[src] = 0

  const pq = new MinPriorityQueue((a, b) => a[0] - b[0])
  pq.enqueue([0, src]) // [dist, node]

  while (pq.size() > 0) {
    const [d, node] = pq.dequeue()
    if (d > dist[node]) continue

    for (const [nei, w] of graph[node]) {
      const nd = d + w
      if (nd < dist[nei]) {
        dist[nei] = nd
        pq.enqueue([nd, nei])
      }
    }
  }

  return dist
}

// Example usage:
const graph = {
  0: [[1, 4], [2, 1]],
  1: [[3, 1]],
  2: [[1, 2], [3, 5]],
  3: [],
}

console.log(dijkstra(graph, 0)) // [0, 3, 1, 4]

export default { dijkstra }