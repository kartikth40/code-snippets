// BFS template
function bfs(start, graph) {
  const q = new Queue()
  q.push(start)
  const visited = new Set([start])

  while (!q.isEmpty()) {
    const node = q.pop()
    for (const nei of graph[node]) {
      if (!visited.has(nei)) {
        visited.add(nei)
        q.push(nei)
      }
    }
  }

  return visited
}
