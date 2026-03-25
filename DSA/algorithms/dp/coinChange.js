// ALGORITHM: Coin Change
// CATEGORY: Unbounded Knapsack / 1D DP

// PROBLEM:
// Given coins of different denominations and a total amount,
// find the fewest number of coins needed to make up that amount.
// Return -1 if it's not possible.

// INTUITION:
// dp[amount] = minimum coins to make 'amount'
// For each amount, try every coin: dp[a] = min(dp[a], dp[a - coin] + 1)
// This is unbounded knapsack — each coin can be used unlimited times.

// TIME: O(amount * coins.length)  |  SPACE: O(amount)

function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity)
  dp[0] = 0

  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a && dp[a - coin] !== Infinity) {
        dp[a] = Math.min(dp[a], dp[a - coin] + 1)
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount]
}

// Coin Change II — count number of combinations that make up amount
// dp[a] = number of ways to make amount 'a'
// Key: iterate coins in outer loop to avoid counting permutations
function coinChangeII(coins, amount) {
  const dp = new Array(amount + 1).fill(0)
  dp[0] = 1

  for (const coin of coins) {        // outer: coins (combinations, not permutations)
    for (let a = coin; a <= amount; a++) {
      dp[a] += dp[a - coin]
    }
  }

  return dp[amount]
}

// COMMON MISTAKES:
// - Initializing dp with 0 instead of Infinity (for min problems)
// - Iterating coins in inner loop for Coin Change II (gives permutations, not combinations)
// - Forgetting dp[0] = 0 (or dp[0] = 1 for counting)

// RELATED PROBLEMS:
// - Coin Change (LC 322)
// - Coin Change II (LC 518)
// - Perfect Squares (LC 279)
// - Minimum Cost for Tickets (LC 983)

console.log(coinChange([1, 5, 10, 25], 30))  // 2 (25 + 5)
console.log(coinChange([2], 3))               // -1
console.log(coinChangeII([1, 2, 5], 5))       // 4 ways
