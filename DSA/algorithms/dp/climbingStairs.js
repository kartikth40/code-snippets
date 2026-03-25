// ALGORITHM: Climbing Stairs
// CATEGORY: 1D DP (Linear)

// PROBLEM:
// You are climbing a staircase. It takes n steps to reach the top.
// Each time you can either climb 1 or 2 steps.
// In how many distinct ways can you climb to the top?

// INTUITION:
// To reach step i, you either came from step i-1 (1 step) or step i-2 (2 steps)
// dp[i] = dp[i-1] + dp[i-2]  (same as Fibonacci)

// TIME: O(n)  |  SPACE: O(1) with optimization

// DP approach (O(n) space)
function climbStairs(n) {
  if (n <= 2) return n

  const dp = new Array(n + 1)
  dp[1] = 1
  dp[2] = 2

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }

  return dp[n]
}

// Space-optimized (O(1) space)
function climbStairsOptimized(n) {
  if (n <= 2) return n

  let prev2 = 1 // dp[i-2]
  let prev1 = 2 // dp[i-1]

  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2
    prev2 = prev1
    prev1 = curr
  }

  return prev1
}

// RELATED PROBLEMS:
// - Min Cost Climbing Stairs (LC 746)
// - Fibonacci Number (LC 509)
// - Decode Ways (LC 91)
// - House Robber (LC 198)

console.log(climbStairs(5))           // 8
console.log(climbStairsOptimized(5))  // 8
console.log(climbStairs(10))          // 89
