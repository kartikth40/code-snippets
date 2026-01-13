// Kahn's Algorithm (BFS)

/*
   Kahn's Algorithm for Topological Sort (BFS-based)

   - can be used to detect cycles in a directed graph
   - works only for Directed Acyclic Graphs (DAGs)
   
   Algorithm Steps:
    1. Calculate indegrees: Count incoming edges for each node
    2. Find starting nodes: Nodes with indegree 0 (no dependencies)
    3. Process iteratively:
        - Remove a node with indegree 0
        - Decrease indegree of its neighbors
        - Add neighbors with indegree 0 to queue
    4. Return result: If all nodes processed, return topological order
   
   Time Complexity: O(V + E) where V is vertices and E is edges
   Space Complexity: O(V) for the indegree array and queue
*/

function topoSort(graph) {
  // Step 1: Calculate indegree for all nodes
  const indegree = {}
  const nodes = Object.keys(graph)

  // Initialize all indegrees to 0
  for (const node of nodes) {
    indegree[node] = 0
  }

  // Calculate actual indegrees
  for (const node of nodes) {
    for (const neighbor of graph[node]) {
      indegree[neighbor] = (indegree[neighbor] || 0) + 1
    }
  }

  // Step 2: Find all nodes with indegree 0
  const queue = []
  for (const node of nodes) {
    if (indegree[node] === 0) {
      queue.push(parseInt(node))
    }
  }

  // Step 3: Process nodes and reduce indegrees
  const result = []

  while (queue.length > 0) {
    const current = queue.shift()
    result.push(current)

    // Reduce indegree of neighbors
    for (const neighbor of graph[current]) {
      indegree[neighbor]--

      // If indegree becomes 0, add to queue
      if (indegree[neighbor] === 0) {
        queue.push(neighbor)
      }
    }
  }

  // Check if topological sort is possible (no cycles)
  if (result.length !== nodes.length) {
    return null // Cycle detected
  }

  return result
}


const graph = {
  0: [1],
  1: [4],
  2: [3, 5],
  3: [4],
  4: [],
  5: [1],
  6: [0],
}

console.log('output with BFS:' ,topoSort(graph)) // one possible output: [ 2, 6, 3, 5, 0, 1, 4]

/*
  Questions to practice: Course Schedule on LeetCode 
  - https://leetcode.com/problems/course-schedule
*/

// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

// Alternative Approach: Depth-First Search (DFS)
function topoSortDFS(graph) {
  const visited = new Set()
  const stack = []
  const nodes = Object.keys(graph)

  for (let node of nodes) {
    node = parseInt(node)
    if (!visited.has(node)) {
      dfs(node, visited, stack, graph)
    }
  }

  function dfs(node, visited, stack, graph) {
    visited.add(node)
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, visited, stack, graph)
      }
    }
    stack.push(node)
  }

  return stack.reverse()
}

console.log('output with DFS:' ,topoSortDFS(graph)) // one possible output: [ 6, 2, 5, 3, 0, 1, 4 ]


// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+


// Shortest Path in Directed Acyclic Graph (DAG) using Topological Sort
/*
  - Can solve for acyclic graphs with negative weights (unlike Dijkstra's)
  - Time Complexity: O(V + E) where V is vertices and E is edges
*/

function shortestPathDAG(graph, src) {
  const nodes = Object.keys(graph)
  const n = nodes.length
  const dist = Array(n).fill(Infinity)
  dist[src] = 0

  let stack = []
  let visited = new Set()

  for(let node of nodes) {
    node = parseInt(node)
    if (!visited.has(node)) {
      tSort(node, graph, visited, stack)
    }
  }

  // Topological Sort using DFS
  function tSort(node, graph, visited, stack) {
    visited.add(node)
    for (const [neighbor, weight] of graph[node]) {
      if (!visited.has(neighbor)) {
        tSort(neighbor, graph, visited, stack)
      }
    }
    stack.push(node)
  }

  while(stack.length > 0) {
    const node = stack.pop()
    if (dist[node] !== Infinity) { // perform relaxation only if node is reachable - performance optimization
      for (const [neighbor, weight] of graph[node]) {
        if (dist[node] + weight < dist[neighbor]) {
          dist[neighbor] = dist[node] + weight
        }
      }
    }
  }
  return dist
}

const weightedGraph = {
  0: [[1, 2], [4, 1]],
  1: [[2, 3]],
  2: [[3, 6]],
  3: [],
  4: [[5, 4],[2, 2]],
  5: [[3, 1]]
}

console.log("Shortest paths from source 0:", shortestPathDAG(weightedGraph, 0))