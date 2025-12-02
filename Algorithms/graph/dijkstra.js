const MinHeap = require('../data_structures/minHeap')

// Dijkstra's Algorithm
function dijkstra(graph, src) {
  const dist = Array(graph.length).fill(Infinity)
  dist[src] = 0

  const pq = new MinHeap()
  pq.push([0, src]) // [dist, node]

  while (pq.h.length) {
    const [d, node] = pq.pop()
    if (d > dist[node]) continue

    for (const [nei, w] of graph[node]) {
      const nd = d + w
      if (nd < dist[nei]) {
        dist[nei] = nd
        pq.push([nd, nei])
      }
    }
  }

  return dist
}