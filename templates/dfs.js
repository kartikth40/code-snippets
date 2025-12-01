// DFS template for graphs / grids
function dfs(node, graph, visited = new Set()) {
  if (visited.has(node)) return
  visited.add(node)

  for (const nei of graph[node]) {
    dfs(nei, graph, visited)
  }
}