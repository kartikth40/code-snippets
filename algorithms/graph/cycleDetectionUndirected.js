// Detect cycle in undirected graph using DFS
function hasCycle(graph) {
  const visited = new Set()
  
  // Check all nodes to handle disconnected components
  for (let node in graph) {
    node = parseInt(node) // Convert string (cause: for in loop) key to integer
    if (!visited.has(node)) {
      if (dfs(node, -1, visited, graph)) {
        return true
      }
    }
  }
  return false

  function dfs(node, parent, visited, graph) {
    visited.add(node)

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, node, visited, graph)) return true
      } else if (neighbor !== parent) {
        // Found a back edge - cycle detected
        return true
      }
    }
    return false
  }
}

const graph = {
  0: [1, 2],
  1: [0, 3],
  2: [0, 3],
  3: [1, 2],
}

console.log(hasCycle(graph)) // true