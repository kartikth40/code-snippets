// Detect cycle in directed graph using DFS
function hasCycle(n, edges) {
  const graph = Array.from({ length: n }, () => [])
  for (const [u, v] of edges) graph[u].push(v)

  const visited = new Set()
  const inStack = new Set()

  function dfs(node) {
    if (inStack.has(node)) return true
    if (visited.has(node)) return false

    visited.add(node)
    inStack.add(node)

    for (const nei of graph[node]) {
      if (dfs(nei)) return true
    }

    inStack.delete(node)
    return false
  }

  for (let i = 0; i < n; i++) {
    if (!visited.has(i) && dfs(i)) return true
  }

  return false
}