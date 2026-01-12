// PATTERN NAME: DP - Dynamic Programming

// WHEN TO USE:
// - Problems that can be broken down into overlapping subproblems
// - Optimal substructure property
// - Problems involving sequences, paths, or combinations
// - Examples: Fibonacci, Knapsack, Coin Change, Longest Common Subsequence

// CORE IDEA (INTUITION):
// - Store results of subproblems to avoid redundant calculations
// - Build up solutions to larger problems using solutions to smaller problems

// INVARIANTS:
// - Subproblem solutions are reused
// - Optimal solutions can be constructed from optimal subproblem solutions
// - State representation is crucial (e.g., indices, remaining capacity)

// TEMPLATE / SKELETON:

// Problem: Jump Game II
// Given an array of non-negative integers nums, where each element represents the maximum jump length at that position,
// return the minimum number of jumps to reach the last index.

 // Greedy Optimal - O(n)
var jump = function(nums) {
    let n = nums.length
    let far = 0
    let end = 0
    let smallest = 0

    for(let i = 0; i < n-1; i++) {
        const curJump = nums[i]
        far = Math.max(far, curJump + i)
        if(i === end) {
            smallest++
            end = far
        }
    }

    return smallest
};

// Top-Down DP (Memoization) - O(n^2) worst
var jump = function(nums) {
    const n = nums.length;
    const memo = new Array(n).fill(-1);
    
    function dfs(i) {
        // Base case: reached the end
        if (i >= n - 1) return 0;
        
        // Return cached result
        if (memo[i] !== -1) return memo[i];
        
        let minJumps = Infinity;
        const maxJump = nums[i];
        
        // Try all possible jumps from current position
        for (let jump = 1; jump <= maxJump; jump++) {
            if (i + jump < n) {
                minJumps = Math.min(minJumps, 1 + dfs(i + jump));
            }
        }
        
        memo[i] = minJumps;
        return minJumps;
    }
    
    return dfs(0);
};

// Bottom-Up - O(n^2) worst
var jump = function(nums) {
    const n = nums.length;
    const dp = new Array(n).fill(Infinity);
    dp[n - 1] = 0; // 0 jumps needed at last position
    
    // Work backwards
    for (let i = n - 2; i >= 0; i--) {
        const maxJump = nums[i];
        
        // Check all positions reachable from i
        for (let jump = 1; jump <= maxJump && i + jump < n; jump++) {
            dp[i] = Math.min(dp[i], 1 + dp[i + jump]);
        }
    }
    
    return dp[0];
};

// COMMON MISTAKES:
// - Not identifying overlapping subproblems
// - Ignoring base cases
// - Incorrect state representation
// - Failing to memoize or store subproblem results
// - Misunderstanding optimal substructure
// - Off-by-one errors in indexing
// - Not considering all possible transitions between states

// RELATED PROBLEMS:
// - Fibonacci Sequence
// - 0/1 Knapsack Problem
// - Coin Change Problem
// - Longest Common Subsequence
// - Edit Distance
// - Partition Problem
// - Unique Paths
// - House Robber Problem
// - Climbing Stairs
// - Maximum Subarray Problem



// Another Example: Best Time to Buy and Sell Stock with Cooldown
// Given an array prices where prices[i] is the price of a given stock on the ith day,
// find the maximum profit you can achieve. You may complete as many transactions as you like
// (i.e., buy one and sell one share of the stock multiple times) with the following restrictions:

// Top-Down DP (Memoization) - O(n)

// Intuition:
// We can define our state with two parameters: the current day and whether we can buy or not.
// If we can buy, we have two choices: buy the stock or skip.
// If we cannot buy (we are holding a stock), we can either sell it or hold onto it.
// After selling, we enter a cooldown day where we cannot buy the next day.

var maxProfit = function (prices) {
  // memo[i][canBuy]: max profit from day i onwards
  // canBuy: 1 = can buy, 0 = holding stock
  const memo = Array.from({ length: prices.length }, () => Array(2).fill(-1))

  return dfs(0, 1)

  function dfs(day, canBuy) {
    // Base case: no more days left
    if (day >= prices.length) return 0

    // Return cached result
    if (memo[day][canBuy] !== -1) return memo[day][canBuy]

    if (canBuy) {
      // Option 1: Buy today (pay price, move to holding state tomorrow)
      const buy = dfs(day + 1, 0) - prices[day]
      // Option 2: Skip buying today (stay in canBuy state)
      const skip = dfs(day + 1, 1)

      memo[day][canBuy] = Math.max(buy, skip)
    } else {
      // Option 1: Sell today (gain price, cooldown forces day+2 for next buy)
      const sell = dfs(day + 2, 1) + prices[day]
      // Option 2: Keep holding (stay in holding state)
      const hold = dfs(day + 1, 0)

      memo[day][canBuy] = Math.max(sell, hold)
    }

    return memo[day][canBuy]
  }
}


// Another Example: Edit Distance
// Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.
// You have the following three operations permitted on a word:
// 1. Insert a character
// 2. Delete a character
// 3. Replace a character

// Bottom-Up DP - O(m*n)

// Intuition:
// We can define a 2D DP table where dp[i][j] represents the minimum edit distance
// between the first i characters of word1 and the first j characters of word2.
// We can build this table iteratively based on the allowed operations.

var minDistance = function (word1, word2) {
  const m = word1.length
  const n = word2.length

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  // base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i // i insertions
  for (let j = 0; j <= n; j++) dp[0][j] = j // j deletions

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // delete
            dp[i][j - 1], // insert
            dp[i - 1][j - 1] // replace
          )
      }
    }
  }

  return dp[m][n]
}




// Another Example: Longest Common Subsequence
// Given two strings text1 and text2, return the length of their longest common subsequence.
// A subsequence is a sequence that can be derived from another sequence by deleting some characters
// without changing the order of the remaining characters.

// Bottom-Up DP - O(m*n)

// Intuition:
// We can define a 2D DP table where dp[i][j] represents the length of the longest common subsequence
// between the first i characters of text1 and the first j characters of text2.
// We can build this table iteratively based on character matches.

// If characters match, we extend the subsequence; if not, we take the maximum by excluding one character.

var longestCommonSubsequence = function(text1, text2) {
    // Create DP table: dp[i][j] = LCS length for text1[i:] and text2[j:]
    let dp = Array.from({length: text1.length+1}, () => new Array(text2.length+1).fill(0))

    // Build table backwards from the end of both strings
    for(let i = text1.length-1; i >= 0; i--) {
        for(let j = text2.length-1; j >= 0; j--) {
            // If characters match, extend the subsequence
            if(text1[i] === text2[j]) {
                dp[i][j] = 1 + dp[i+1][j+1]
            } else {
                // If no match, take max of excluding either character
                dp[i][j] = Math.max(dp[i+1][j], dp[i][j+1])
            }
        }
    }

    // Result is LCS length starting from index 0 of both strings
    return dp[0][0]
};



// Another Example: Best Time to Buy and Sell Stock III
// You are given an array prices where prices[i] is the price of a given stock on the ith day.
// Find the maximum profit you can achieve. You may complete at most two transactions.

// Top-Down DP (Memoization) - O(n)

// Intuition:
// We can define our state with three parameters: the current day, whether we are holding a stock or not,
// and the number of transactions left. Based on these states, we can decide to buy, sell, or skip.

var maxProfit = function (prices) {
    const n = prices.length

    // memo[day][holding][transactionsLeft]
    const memo = Array.from({ length: n }, () =>
        Array.from({ length: 2 }, () =>
            new Array(3).fill(-1)
        )
    )

    function dfs(day, holding, transactionsLeft) {
        // base cases
        if (day === n || transactionsLeft === 0) return 0

        if (memo[day][holding][transactionsLeft] !== -1) {
            return memo[day][holding][transactionsLeft]
        }

        let profit

        if (holding === 0) {
            // can buy
            profit = Math.max(
                -prices[day] + dfs(day + 1, 1, transactionsLeft), // buy
                dfs(day + 1, 0, transactionsLeft)                 // skip
            )
        } else {
            // can sell
            profit = Math.max(
                prices[day] + dfs(day + 1, 0, transactionsLeft - 1), // sell
                dfs(day + 1, 1, transactionsLeft)                    // hold
            )
        }

        memo[day][holding][transactionsLeft] = profit
        return profit
    }

    return dfs(0, 0, 2)
}




// Another Example: Word Break
// Given a string s and a dictionary of strings wordDict, return true if s can be segmented
// into a space-separated sequence of one or more dictionary words.

// Bottom-Up DP - O(n*m) where n is length of s and m is average length of words in wordDict

// Intuition:
// We can use a DP array where dp[i] indicates whether the substring s[0:i] can be segmented
// into words from the dictionary. For each position i, we check all previous positions j
// to see if s[j:i] is in the dictionary and if dp[j] is true.


var wordBreak = function(s, wordDict) {
    let dp = new Array(s.length+1).fill(false)
    dp[0] = true
    let set = new Set(wordDict)

    for(let i = 0; i < s.length; i++) {
        for(let j = i; j < s.length; j++) {
            if(dp[i] && set.has(s.slice(i, j+1))) {
                dp[j+1] = true
            }
        }
    }
    return dp[s.length]
};




// Another Example: Palindrome Partitioning II
// Given a string s, partition s such that every substring of the partition is a palindrome.
// Return the minimum cuts needed for a palindrome partitioning of s.

// Bottom-Up DP - O(n^2)

// Intuition:
// - We can use a DP array where dp[i] represents the minimum cuts needed for the substring s[0:i].
// - We also maintain a 2D boolean array to check if a substring s[j:i] is a palindrome.
// - For each position i, we check all previous positions j to see if s[j:i] is a palindrome.
// - If it is, we update dp[i] with the minimum cuts needed.


var minCut = function(s) {
    // Base cases: empty or single character string needs 0 cuts
    if (s.length === 0 || s.length === 1) return 0

    const n = s.length

    // dp[i] = minimum number of palindrome partitions for substring s[i..n-1]
    // (cuts = partitions - 1)
    const dp = new Array(n).fill(-1)

    // pal[i][j] = true if substring s[i..j] is a palindrome
    const pal = Array.from({ length: n }, () => Array(n).fill(false))

    /*
        Build palindrome DP table

        We treat:
        - i as the END index
        - j as the START index

        Loop order ensures pal[j+1][i-1] is already computed
        when needed.
    */
    for (let i = 0; i < n; i++) {          // end index
        for (let j = 0; j <= i; j++) {     // start index
            /*
                s[j..i] is a palindrome if:
                1) s[j] === s[i]
                2) inner substring is palindrome OR length <= 2
            */
            if (s[i] === s[j] && (i - j <= 2 || pal[j + 1][i - 1])) {
                pal[j][i] = true
            }
        }
    }

    // We count partitions, so final answer = partitions - 1
    return getMinCuts(0) - 1

    /*
        Recursive DP:
        getMinCuts(i) = minimum number of palindrome partitions
                        for substring s[i..n-1]
    */
    function getMinCuts(i) {
        // Reached end of string → no partitions needed
        if (i === n) return 0

        // Return memoized result
        if (dp[i] !== -1) return dp[i]

        let minCuts = Infinity

        // Try all palindromic prefixes starting at index i
        for (let j = i; j < n; j++) {
            if (pal[i][j]) {
                // 1 partition for s[i..j] + partitions for remaining substring
                let cuts = 1 + getMinCuts(j + 1)
                minCuts = Math.min(minCuts, cuts)
            }
        }

        dp[i] = minCuts
        return minCuts
    }
}
