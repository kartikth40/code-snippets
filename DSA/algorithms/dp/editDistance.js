// ALGORITHM: Edit Distance (Levenshtein Distance)
// CATEGORY: 2D DP (String DP)

// PROBLEM:
// Given two strings word1 and word2, return the minimum number of operations
// to convert word1 into word2. Operations: insert, delete, replace.

// INTUITION:
// dp[i][j] = min operations to convert word1[0..i-1] to word2[0..j-1]
// If chars match: dp[i][j] = dp[i-1][j-1] (no operation needed)
// If not: dp[i][j] = 1 + min(
//   dp[i-1][j],     // delete from word1
//   dp[i][j-1],     // insert into word1
//   dp[i-1][j-1]    // replace in word1
// )

// TIME: O(m * n)  |  SPACE: O(m * n), optimizable to O(n)

function minDistance(word1, word2) {
  const m = word1.length, n = word2.length
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

  // Base cases: converting empty string
  for (let i = 0; i <= m; i++) dp[i][0] = i  // delete all chars
  for (let j = 0; j <= n; j++) dp[0][j] = j  // insert all chars

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // delete
          dp[i][j - 1],     // insert
          dp[i - 1][j - 1]  // replace
        )
      }
    }
  }

  return dp[m][n]
}

// Space-optimized (O(n) space)
function minDistanceOptimized(word1, word2) {
  const m = word1.length, n = word2.length
  let prev = Array.from({ length: n + 1 }, (_, j) => j)

  for (let i = 1; i <= m; i++) {
    const curr = new Array(n + 1)
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        curr[j] = prev[j - 1]
      } else {
        curr[j] = 1 + Math.min(prev[j], curr[j - 1], prev[j - 1])
      }
    }
    prev = curr
  }

  return prev[n]
}

// COMMON MISTAKES:
// - Forgetting base cases (empty string conversions)
// - Wrong index mapping (dp is 1-indexed, strings are 0-indexed)
// - Confusing which operation maps to which dp transition

// RELATED PROBLEMS:
// - Edit Distance (LC 72)
// - One Edit Distance (LC 161)
// - Delete Operation for Two Strings (LC 583)
// - Minimum ASCII Delete Sum (LC 712)

console.log(minDistance("horse", "ros"))              // 3
console.log(minDistance("intention", "execution"))    // 5
console.log(minDistanceOptimized("horse", "ros"))    // 3
