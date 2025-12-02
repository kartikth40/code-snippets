// Detect cycle in directed graph using DFS
function hasCycle(graph) {

  const visited = new Set()
  const pathVisited = new Set() // Nodes currently in the recursion stack (current path)

  function dfs(node) {
    if (pathVisited.has(node)) return true // cycle found
    if (visited.has(node)) return false // already processed, no cycle from this node

    visited.add(node)
    pathVisited.add(node)

    for (const nei of graph[node]) {
      if (dfs(nei)) return true // cyle found
    }

    pathVisited.delete(node)
    return false // no cycle found from this node
  }

  for (let node in graph) {
    node = parseInt(node) // Convert string (cause: for in loop) key to integer
    if (!visited.has(node) && dfs(node)) return true
  }

  return false
}

const graph = {
  0: [1],
  1: [2],
  2: [3],
  3: [0, 4],
  4: []
}

console.log(hasCycle(graph)) // true