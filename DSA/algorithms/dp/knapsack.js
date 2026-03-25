// ALGORITHM: 0/1 Knapsack
// CATEGORY: 2D DP / Knapsack

// PROBLEM:
// Given n items with weights and values, and a knapsack of capacity W,
// find the maximum value you can carry. Each item can be used at most once.

// INTUITION:
// dp[i][w] = max value using first i items with capacity w
// For each item: take it (if it fits) or skip it
// dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight[i]] + value[i])

// TIME: O(n * W)  |  SPACE: O(n * W), optimizable to O(W)

// 2D approach
function knapsack(weights, values, W) {
  const n = weights.length
  const dp = Array(n + 1).fill(null).map(() => Array(W + 1).fill(0))

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      dp[i][w] = dp[i - 1][w] // skip item i
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1] // take item i
        )
      }
    }
  }

  return dp[n][W]
}

// Space-optimized 1D approach (O(W) space)
// Key: iterate w from RIGHT to LEFT so we don't overwrite values we still need
function knapsackOptimized(weights, values, W) {
  const n = weights.length
  const dp = new Array(W + 1).fill(0)

  for (let i = 0; i < n; i++) {
    for (let w = W; w >= weights[i]; w--) {  // RIGHT to LEFT
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i])
    }
  }

  return dp[W]
}

// Subset Sum — can we make target sum from array?
// Special case of 0/1 knapsack where value = weight
function subsetSum(nums, target) {
  const dp = new Array(target + 1).fill(false)
  dp[0] = true

  for (const num of nums) {
    for (let t = target; t >= num; t--) {  // RIGHT to LEFT
      dp[t] = dp[t] || dp[t - num]
    }
  }

  return dp[target]
}

// Partition Equal Subset Sum — can we split array into two equal-sum subsets?
// Reduces to: subsetSum(nums, totalSum / 2)
function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0)
  if (total % 2 !== 0) return false
  return subsetSum(nums, total / 2)
}

// COMMON MISTAKES:
// - Wrong iteration direction in 1D optimization (must go right-to-left for 0/1)
// - Confusing 0/1 knapsack (right-to-left) with unbounded (left-to-right)
// - Off-by-one errors with 1-indexed vs 0-indexed items

// RELATED PROBLEMS:
// - Partition Equal Subset Sum (LC 416)
// - Target Sum (LC 494)
// - Last Stone Weight II (LC 1049)
// - Ones and Zeroes (LC 474)

console.log(knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7))           // 9
console.log(knapsackOptimized([1, 3, 4, 5], [1, 4, 5, 7], 7))  // 9
console.log(subsetSum([3, 34, 4, 12, 5, 2], 9))                 // true
console.log(canPartition([1, 5, 11, 5]))                         // true
console.log(canPartition([1, 2, 3, 5]))                          // false
