// useful for traversing all nodes in a graph depth-wise
function dfs(node, graph, visited = new Set()) {
  if (visited.has(node)) return
  visited.add(node)
 
  for (const nei of graph[node]) {
    dfs(nei, graph, visited)
  }
}

// example usage:
// number of islands in a grid
function numIslands(grid) {
  let res = 0
  let m = grid.length
  let n = grid[0].length

  let visited = Array.from({ length: m }, () => new Array(n).fill(false)) // m x n

  let directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]

  function dfs(i, j) {
    if (i < 0 || j < 0 || i >= m || j >= n || visited[i][j] || grid[i][j] === '0') return

    visited[i][j] = true

    for (let [dr, dc] of directions) {
      let newR = i + dr
      let newC = j + dc

      dfs(newR, newC)
    }
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1' && !visited[i][j]) {
        res++
        dfs(i, j)
      }
    }
  }
  return res
}

// example usage:
// Get subtree size for each node in a tree
function getSubtreeSizes(node, graph, visited = new Set(), sizes = {}) {
  if (visited.has(node)) return 0
  visited.add(node)
  
  let size = 1 // Count the current node
  
  for (const child of graph[node]) {
    if (!visited.has(child)) {
      const childSize = getSubtreeSizes(child, graph, visited, sizes)
      size += childSize
    }
  }
  
  sizes[node] = size
  return size
}


// bonus (bfs + dfs): Shortest Bridge Between Islands