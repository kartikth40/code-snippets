// Kahn's Algorithm (BFS)
function topoSort(n, edges) {
  const graph = Array.from({ length: n }, () => [])
  const indegree = Array(n).fill(0)

  for (const [u, v] of edges) {
    graph[u].push(v)
    indegree[v]++
  }

  const q = []
  for (let i = 0; i < n; i++) {
    if (indegree[i] === 0) q.push(i)
  }

  const res = []

  while (q.length) {
    const node = q.shift()
    res.push(node)

    for (const nei of graph[node]) {
      indegree[nei]--
      if (indegree[nei] === 0) q.push(nei)
    }
  }

  return res.length === n ? res : []
}