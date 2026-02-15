// PATTERN NAME:
// Bellman-Ford Algorithm

// WHEN TO USE:
// - When you need to find the shortest path in a graph that may contain negative weight edges.
// - When the graph is represented as an edge list rather than an adjacency list or matrix.
// - When you need to detect negative weight cycles in a graph.

// DIjkstra vs Bellman-Ford:
// - Dijkstra's algorithm is more efficient for graphs with non-negative weights, with a time complexity of O((V + E) log V) using a priority queue.
// - Bellman-Ford has a higher time complexity of O(V * E) but can handle negative weight edges and detect negative weight cycles.
// - Dijkstra's algorithm uses a greedy approach, while Bellman-Ford uses dynamic programming to relax edges iteratively.

// CORE IDEA (INTUITION):
// The Bellman-Ford algorithm works by iteratively relaxing all edges in the graph.
// It updates the shortest path estimates for each vertex by considering each edge multiple times.
// After V-1 iterations (where V is the number of vertices), the shortest paths are guaranteed to be found if no negative weight cycles exist.

// INVARIANTS:
// - After the i-th iteration, the shortest path from the source to any vertex using at most i edges is known.
// - If a vertex's distance can still be updated after V-1 iterations, a negative weight cycle exists in the graph.
// STEP-BY-STEP ALGORITHM:
// 1. Initialize distances from the source to all vertices as infinite, except for the source itself which is set to 0.
// 2. For each vertex, repeat the following for V-1 times:
//    a. For each edge (u, v) with weight w, if the distance to u plus w is less than the distance to v, update the distance to v.
// 3. After V-1 iterations, check for negative weight cycles by trying to relax the edges one more time. If any distance can still be updated, a negative weight cycle exists.
// 4. Return the shortest path distances from the source to all vertices.

// TEMPLATE / SKELETON:

// Bellman-Ford Algorithm for finding the cheapest flight within K stops
// PROBLEM STATEMENT:
// Given a list of flights represented as edges (from, to, price), find the cheapest price from source to destination with at most K stops.

function bellmanFord(V, edges, src) {
        const MAX = Infinity
        let dist = new Array(V).fill(MAX)
        dist[src] = 0
        
        for(let i = 0; i < V-1; i++) {
            for(let [u, v, w] of edges) {
                if(dist[u] === MAX) continue // make sure to first get to u then only to v
                let newDist = dist[u] + w
                if(newDist < dist[v]) {
                    dist[v] = newDist
                }
            }
        }
        
        for(let [u, v, w] of edges) {
            if(dist[u] === MAX) continue
            let newDist = dist[u] + w
            if(newDist < dist[v]) {
                return [-1]
            }
        }
        
        return dist
    }
// Example usage:
const V = 5
const edges = [
  [0, 1, 100],
  [1, 2, 100],
  [0, 2, 500],
  [2, 3, 100],
  [3, 4, 100],
  [1, 4, 600],
]
console.log(bellmanFord(V, edges, 0)) // Output: [0, 100, 200, 300, 400]

// COMMON MISTAKES:

// TIME & SPACE:
// - Time complexity
// - Space complexity

// RELATED PROBLEMS:
