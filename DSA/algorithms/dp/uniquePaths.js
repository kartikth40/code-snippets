// ALGORITHM: Unique Paths
// CATEGORY: 2D DP (Grid)

// PROBLEM:
// A robot is at the top-left corner of an m x n grid.
// It can only move right or down. How many unique paths exist
// to reach the bottom-right corner?

// INTUITION:
// dp[i][j] = number of ways to reach cell (i, j)
// dp[i][j] = dp[i-1][j] + dp[i][j-1]  (from above + from left)

// TIME: O(m * n)  |  SPACE: O(n) with optimization

function uniquePaths(m, n) {
  const dp = new Array(n).fill(1) // first row is all 1s

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1]
    }
  }

  return dp[n - 1]
}

// Unique Paths II — with obstacles (grid[i][j] = 1 means obstacle)
function uniquePathsWithObstacles(grid) {
  const m = grid.length, n = grid[0].length
  if (grid[0][0] === 1 || grid[m - 1][n - 1] === 1) return 0

  const dp = new Array(n).fill(0)
  dp[0] = 1

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        dp[j] = 0
      } else if (j > 0) {
        dp[j] += dp[j - 1]
      }
    }
  }

  return dp[n - 1]
}

// Minimum Path Sum — find path with minimum sum from top-left to bottom-right
function minPathSum(grid) {
  const m = grid.length, n = grid[0].length
  const dp = new Array(n).fill(Infinity)
  dp[0] = 0

  for (let i = 0; i < m; i++) {
    dp[0] += grid[i][0]
    for (let j = 1; j < n; j++) {
      if (i === 0) {
        dp[j] = dp[j - 1] + grid[i][j]
      } else {
        dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j]
      }
    }
  }

  return dp[n - 1]
}

// RELATED PROBLEMS:
// - Unique Paths (LC 62)
// - Unique Paths II (LC 63)
// - Minimum Path Sum (LC 64)
// - Dungeon Game (LC 174)
// - Triangle (LC 120)

console.log(uniquePaths(3, 7))                          // 28
console.log(uniquePathsWithObstacles([[0,0,0],[0,1,0],[0,0,0]]))  // 2
console.log(minPathSum([[1,3,1],[1,5,1],[4,2,1]]))      // 7
