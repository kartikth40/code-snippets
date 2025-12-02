// useful for shortest path in unweighted graph
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


// example usage:
// shortest path in a grid with obstacles elimination
class Cell {
  constructor(row, col, remaining, distance) {
    this.row = row
    this.col = col
    this.remaining = remaining
    this.distance = distance
  }
}

var shortestPath = function (grid, k) {
  let m = grid.length
  let n = grid[0].length

  let q = new Queue()
  q.push(new Cell(0, 0, k, 0))

  let visited = new Set()
  visited.add(`0,0,${k}`)

  let directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]

  while (!q.isEmpty()) {
    let cell = q.pop()
    if (cell.row === m - 1 && cell.col === n - 1) return cell.distance

    for (let [dr, dc] of directions) {
      let newR = cell.row + dr
      let newC = cell.col + dc

      if (newR < 0 || newC < 0 || newR >= m || newC >= n) continue

      let newRemaining = cell.remaining - grid[newR][newC]
      let key = `${newR},${newC},${newRemaining}`
      if (newRemaining >= 0 && !visited.has(key)) {
        visited.add(key)
        q.push(new Cell(newR, newC, newRemaining, cell.distance + 1))
      }
    }
  }

  return -1
}