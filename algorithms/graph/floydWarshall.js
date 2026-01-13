// Floyd-Warshall Algorithm (All Pairs Shortest Path)

// Can solve for cyclic and acyclic graphs with negative weights (but no negative cycles)
// Time Complexity: O(V^3) where V is the number of vertices
// Space Complexity: O(V^2)

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