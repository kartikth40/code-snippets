// Graph Data Structure Implementation

// A graph is a collection of nodes (vertices) connected by edges.
// This file provides adjacency list and adjacency matrix representations,
// plus common helper utilities used across graph problems.

// Time Complexity:
// - Add vertex: O(1)
// - Add edge: O(1)
// - Remove edge: O(E) for adjacency list
// - Has edge: O(degree) for list, O(1) for matrix
// - Get neighbors: O(1) for list, O(V) for matrix
// - Space: O(V + E) for list, O(V²) for matrix

// When to use:
// - Adjacency List: sparse graphs, most interview problems
// - Adjacency Matrix: dense graphs, Floyd-Warshall, quick edge lookup
// - Edge List: Kruskal's MST, Bellman-Ford

// === ADJACENCY LIST (most common for interviews) ===

class Graph {
  constructor(directed = false) {
    this.adj = new Map()
    this.directed = directed
  }

  addVertex(v) {
    if (!this.adj.has(v)) this.adj.set(v, [])
  }

  addEdge(u, v, weight = 1) {
    this.addVertex(u)
    this.addVertex(v)
    this.adj.get(u).push({ node: v, weight })
    if (!this.directed) {
      this.adj.get(v).push({ node: u, weight })
    }
  }

  getNeighbors(v) {
    return this.adj.get(v) || []
  }

  hasEdge(u, v) {
    if (!this.adj.has(u)) return false
    return this.adj.get(u).some(e => e.node === v)
  }

  getVertices() {
    return [...this.adj.keys()]
  }

  get size() {
    return this.adj.size
  }
}

// === BUILD FROM COMMON INPUT FORMATS ===

// From edge list: [[0,1], [1,2], [2,0]]
function buildAdjList(n, edges, directed = false) {
  const graph = Array.from({ length: n }, () => [])

  for (const [u, v] of edges) {
    graph[u].push(v)
    if (!directed) graph[v].push(u)
  }

  return graph
}

// From weighted edge list: [[0,1,5], [1,2,3]]
function buildWeightedAdjList(n, edges, directed = false) {
  const graph = Array.from({ length: n }, () => [])

  for (const [u, v, w] of edges) {
    graph[u].push([v, w])
    if (!directed) graph[v].push([u, w])
  }

  return graph
}

// From adjacency matrix to adjacency list
function matrixToAdjList(matrix) {
  const n = matrix.length
  const graph = Array.from({ length: n }, () => [])

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] !== 0 && matrix[i][j] !== Infinity) {
        graph[i].push(j)
      }
    }
  }

  return graph
}

// === ADJACENCY MATRIX ===

function buildAdjMatrix(n, edges, directed = false) {
  const matrix = Array.from({ length: n }, () => new Array(n).fill(0))

  for (const [u, v, w = 1] of edges) {
    matrix[u][v] = w
    if (!directed) matrix[v][u] = w
  }

  return matrix
}

// === UTILITY: COMPUTE INDEGREES (for topological sort / Kahn's) ===

function computeIndegrees(n, graph) {
  const indegree = new Array(n).fill(0)

  for (let u = 0; u < n; u++) {
    for (const v of graph[u]) {
      indegree[v]++
    }
  }

  return indegree
}

// Examples
const g = new Graph(true) // directed
g.addEdge(0, 1, 4)
g.addEdge(0, 2, 1)
g.addEdge(2, 1, 2)
g.addEdge(1, 3, 1)
console.log(g.getNeighbors(0))   // [{node:1,weight:4}, {node:2,weight:1}]
console.log(g.hasEdge(0, 1))     // true
console.log(g.hasEdge(1, 0))     // false (directed)
console.log(g.size)              // 4

const adj = buildAdjList(4, [[0,1],[1,2],[2,3],[3,0]])
console.log(adj)  // [[1,3],[0,2],[1,3],[2,0]]

const weighted = buildWeightedAdjList(3, [[0,1,5],[1,2,3],[0,2,10]])
console.log(weighted)  // [[[1,5],[2,10]], [[0,5],[2,3]], [[1,3],[0,10]]]

const matrix = buildAdjMatrix(3, [[0,1,2],[1,2,3],[0,2,7]])
console.log(matrix)  // [[0,2,7],[2,0,3],[7,3,0]]
