// PATTERN NAME: Matrix / Grid Patterns

// WHEN TO USE:
// - 2D grid traversal (islands, shortest path)
// - Matrix rotation, spiral order
// - Search in sorted 2D matrix
// - Flood fill, connected components in grid

// CORE IDEA (INTUITION):
// - Grids are implicit graphs — each cell connects to its neighbors
// - Use DFS/BFS for traversal, visited array to avoid revisiting
// - For sorted matrices: treat as flattened sorted array or use staircase search
// - Direction arrays simplify neighbor iteration

// INVARIANTS:
// - Always check bounds: 0 <= row < m, 0 <= col < n
// - Mark visited BEFORE pushing to queue (BFS) to avoid duplicates
// - Direction array: [[0,1],[0,-1],[1,0],[-1,0]] for 4-directional

// TEMPLATE / SKELETON:

// === DIRECTION HELPERS ===
const DIRS_4 = [[0, 1], [0, -1], [1, 0], [-1, 0]]
const DIRS_8 = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]

function inBounds(r, c, m, n) {
  return r >= 0 && r < m && c >= 0 && c < n
}

// === NUMBER OF ISLANDS (DFS on grid) ===
function numIslands(grid) {
  const m = grid.length, n = grid[0].length
  let count = 0

  function dfs(r, c) {
    if (!inBounds(r, c, m, n) || grid[r][c] === '0') return
    grid[r][c] = '0' // mark visited by sinking

    for (const [dr, dc] of DIRS_4) {
      dfs(r + dr, c + dc)
    }
  }

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === '1') {
        dfs(r, c)
        count++
      }
    }
  }

  return count
}

// === SPIRAL ORDER ===
function spiralOrder(matrix) {
  const result = []
  let top = 0, bottom = matrix.length - 1
  let left = 0, right = matrix[0].length - 1

  while (top <= bottom && left <= right) {
    // Traverse right
    for (let c = left; c <= right; c++) result.push(matrix[top][c])
    top++

    // Traverse down
    for (let r = top; r <= bottom; r++) result.push(matrix[r][right])
    right--

    // Traverse left
    if (top <= bottom) {
      for (let c = right; c >= left; c--) result.push(matrix[bottom][c])
      bottom--
    }

    // Traverse up
    if (left <= right) {
      for (let r = bottom; r >= top; r--) result.push(matrix[r][left])
      left++
    }
  }

  return result
}

// === ROTATE MATRIX 90° CLOCKWISE (in-place) ===
// Step 1: Transpose (swap rows and columns)
// Step 2: Reverse each row
function rotate(matrix) {
  const n = matrix.length

  // Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]
    }
  }

  // Reverse each row
  for (let i = 0; i < n; i++) {
    matrix[i].reverse()
  }

  return matrix
}

// === SEARCH IN SORTED MATRIX ===
// Rows sorted left-to-right, columns sorted top-to-bottom
// Start from top-right corner (staircase search)
function searchMatrix(matrix, target) {
  let r = 0, c = matrix[0].length - 1

  while (r < matrix.length && c >= 0) {
    if (matrix[r][c] === target) return true
    if (matrix[r][c] > target) c--
    else r++
  }

  return false
}

// === SET MATRIX ZEROES (O(1) space) ===
// Use first row and first column as markers
function setZeroes(matrix) {
  const m = matrix.length, n = matrix[0].length
  let firstRowZero = false, firstColZero = false

  // Check if first row/col have zeros
  for (let c = 0; c < n; c++) if (matrix[0][c] === 0) firstRowZero = true
  for (let r = 0; r < m; r++) if (matrix[r][0] === 0) firstColZero = true

  // Mark zeros in first row/col
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0
        matrix[0][c] = 0
      }
    }
  }

  // Zero out cells based on markers
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) {
        matrix[r][c] = 0
      }
    }
  }

  // Handle first row and column
  if (firstRowZero) for (let c = 0; c < n; c++) matrix[0][c] = 0
  if (firstColZero) for (let r = 0; r < m; r++) matrix[r][0] = 0

  return matrix
}

// COMMON MISTAKES:
// - Forgetting bounds check before accessing grid[r][c]
// - Marking visited AFTER pushing to queue (causes duplicates in BFS)
// - Modifying grid in-place when you shouldn't (or not when you should)
// - Wrong direction array (4 vs 8 directional)
// - Spiral order: not checking top <= bottom and left <= right after each direction

// TIME & SPACE:
// - Grid DFS/BFS: O(m * n) time, O(m * n) space (visited)
// - Spiral: O(m * n) time, O(1) extra space
// - Rotate: O(n²) time, O(1) space (in-place)
// - Staircase search: O(m + n) time, O(1) space
// - Set Zeroes: O(m * n) time, O(1) space

// RELATED PROBLEMS:
// - Number of Islands (LC 200)
// - Spiral Matrix (LC 54)
// - Rotate Image (LC 48)
// - Search a 2D Matrix II (LC 240)
// - Set Matrix Zeroes (LC 73)
// - Word Search (LC 79)
// - Surrounded Regions (LC 130)
// - Shortest Path in Binary Matrix (LC 1091)
// - Pacific Atlantic Water Flow (LC 417)
// - Maximal Square (LC 221)

console.log(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]))
// [1,2,3,6,9,8,7,4,5]

console.log(rotate([[1,2,3],[4,5,6],[7,8,9]]))
// [[7,4,1],[8,5,2],[9,6,3]]

console.log(searchMatrix([[1,4,7],[2,5,8],[3,6,9]], 5))  // true
console.log(searchMatrix([[1,4,7],[2,5,8],[3,6,9]], 10)) // false
