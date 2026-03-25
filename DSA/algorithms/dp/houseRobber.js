// ALGORITHM: House Robber
// CATEGORY: 1D DP (Linear)

// PROBLEM:
// Given an array of non-negative integers representing money at each house,
// determine the maximum amount you can rob without robbing two adjacent houses.

// INTUITION:
// At each house i, you either:
//   1. Rob it: take nums[i] + best from dp[i-2] (skip previous)
//   2. Skip it: take dp[i-1]
// dp[i] = max(dp[i-1], dp[i-2] + nums[i])

// TIME: O(n)  |  SPACE: O(1) with optimization

function rob(nums) {
  if (nums.length === 0) return 0
  if (nums.length === 1) return nums[0]

  let prev2 = 0         // dp[i-2]
  let prev1 = nums[0]   // dp[i-1]

  for (let i = 1; i < nums.length; i++) {
    const curr = Math.max(prev1, prev2 + nums[i])
    prev2 = prev1
    prev1 = curr
  }

  return prev1
}

// House Robber II (circular arrangement)
// First and last houses are adjacent, so we can't rob both.
// Solution: max(rob(0..n-2), rob(1..n-1))
function robCircular(nums) {
  if (nums.length === 1) return nums[0]

  function robRange(start, end) {
    let prev2 = 0, prev1 = 0
    for (let i = start; i <= end; i++) {
      const curr = Math.max(prev1, prev2 + nums[i])
      prev2 = prev1
      prev1 = curr
    }
    return prev1
  }

  return Math.max(
    robRange(0, nums.length - 2),  // exclude last
    robRange(1, nums.length - 1)   // exclude first
  )
}

// RELATED PROBLEMS:
// - House Robber II (LC 213) - circular
// - House Robber III (LC 337) - tree DP
// - Delete and Earn (LC 740)
// - Maximum Alternating Subsequence Sum (LC 1911)

console.log(rob([1, 2, 3, 1]))          // 4 (rob house 0 and 2)
console.log(rob([2, 7, 9, 3, 1]))       // 12 (rob house 0, 2, 4)
console.log(robCircular([2, 3, 2]))      // 3
console.log(robCircular([1, 2, 3, 1]))   // 4
