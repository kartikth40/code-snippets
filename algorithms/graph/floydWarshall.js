// Floyd-Warshall Algorithm (All Pairs/Multi source Shortest Path)

// Can solve for cyclic and acyclic graphs with negative weights (but no negative cycles)
// Time Complexity: O(V^3) where V is the number of vertices
// Space Complexity: O(V^2)

// Dijkstra algo will work better for multiple sources if there are no negative weights (O(VE log V) with priority queue)

// CORE IDEA (INTUITION):
// The Floyd-Warshall algorithm uses dynamic programming to find the shortest paths between all pairs of vertices.
// It systematically considers each vertex as an intermediate point and updates the shortest path estimates accordingly.

// INVARIANTS:
// - After considering each intermediate vertex, the distance matrix correctly reflects the shortest paths using only the considered vertices.
// - The algorithm updates the distance matrix in place, ensuring that at each step, the shortest known paths are maintained.

// STEP-BY-STEP ALGORITHM:
// 1. Initialize a distance matrix with direct edge weights; use Infinity for no direct edge and 0 for self-loops.
// 2. For each vertex k (considered as an intermediate point):
//    a. For each pair of vertices (i, j):
//       i. Update the distance from i to j to be the minimum of the current distance and the distance from i to k plus the distance from k to j.
// 3. After considering all vertices as intermediates, the distance matrix contains the shortest paths between all pairs of vertices.

function floydWarshall(graph) {
  // Handle object-based adjacency list
  const nodeKeys = Object.keys(graph)
  const V = nodeKeys.length
  const distances = []

  // Build distance matrix from adjacency list
  for (let i = 0; i < V; i++) {
    distances[i] = []
    for (let j = 0; j < V; j++) {
      const from = nodeKeys[i]
      const to = nodeKeys[j]

      if (i === j) {
        distances[i][j] = 0
      } else if (graph[from] && graph[from][to] !== undefined) {
        distances[i][j] = graph[from][to]
      } else {
        distances[i][j] = Infinity
      }
    }
  }

  // Core Floyd-Warshall algorithm
  for (let intermediate = 0; intermediate < V; intermediate++) {
    for (let source = 0; source < V; source++) {
      for (let destination = 0; destination < V; destination++) {
        const currentPath = distances[source][destination]
        const newPath = distances[source][intermediate] + distances[intermediate][destination]
        distances[source][destination] = Math.min(currentPath, newPath)
      }
    }
  }

  // Check for negative weight cycles
  for (let i = 0; i < V; i++) {
    if (distances[i][i] < 0) {
      throw new Error('Graph contains a negative weight cycle')
    }
  }

  return distances
}

// Example usage:
const graph = {
  0: { 1: 3, 2: 6 },
  1: { 2: 2, 3: 1 },
  2: { 3: 1 },
  3: { 0: 4 },
}

console.log(floydWarshall(graph))
// Output: All-pairs shortest distances matrix: [ [ 0, 3, 5, 4 ], [ 5, 0, 2, 1 ], [ 5, 8, 0, 1 ], [ 4, 7, 9, 0 ] ]