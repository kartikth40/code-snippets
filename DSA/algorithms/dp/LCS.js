// ALGORITHM: Longest Common Subsequence (LCS)
// CATEGORY: 2D DP (Two Sequences)

// PROBLEM:
// Given two strings, find the length of their longest common subsequence.
// A subsequence is a sequence derived by deleting some (or no) elements
// without changing the order of remaining elements.

// INTUITION:
// dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]
// If chars match: dp[i][j] = dp[i-1][j-1] + 1
// If not: dp[i][j] = max(dp[i-1][j], dp[i][j-1])

// TIME: O(m * n)  |  SPACE: O(m * n), optimizable to O(min(m, n))

function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  return dp[m][n]
}

// Print the actual LCS string (backtrack through DP table)
function printLCS(text1, text2) {
  const m = text1.length, n = text2.length
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack to find the actual subsequence
  let i = m, j = n
  let lcs = ''
  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      lcs = text1[i - 1] + lcs
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }

  return lcs
}

// Space-optimized (O(n) space) — only need previous row
function lcsOptimized(text1, text2) {
  const m = text1.length, n = text2.length
  let prev = new Array(n + 1).fill(0)

  for (let i = 1; i <= m; i++) {
    const curr = new Array(n + 1).fill(0)
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        curr[j] = prev[j - 1] + 1
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1])
      }
    }
    prev = curr
  }

  return prev[n]
}

// RELATED PROBLEMS:
// - Longest Common Subsequence (LC 1143)
// - Longest Palindromic Subsequence (LC 516) — LCS(s, reverse(s))
// - Shortest Common Supersequence (LC 1092)
// - Edit Distance (LC 72) — related recurrence
// - Minimum Insertions to Make Palindrome (LC 1312)

console.log(longestCommonSubsequence("abcde", "ace"))  // 3
console.log(printLCS("abcde", "ace"))                   // "ace"
console.log(lcsOptimized("abcde", "ace"))               // 3
