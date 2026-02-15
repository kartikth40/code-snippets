// PATTERN NAME: Sliding Window

// WHEN TO USE:
// - When you need to find a contiguous subarray or substring that satisfies certain conditions.
// - When you need to optimize a brute-force solution that involves nested loops over a linear data structure.
// - When you need to maintain a running total or count of elements in a dynamic window.

// CORE IDEA (INTUITION):
// - Use two pointers to represent the boundaries of the window.
// - Expand and contract the window based on the problem's requirements.
// - Maintain necessary data structures (like hash maps or counters) to keep track of elements within the window.

// TEMPLATE / SKELETON:

// Problem: Longest Repeating Character Replacement
// Given a string s that consists of only uppercase English letters, you can perform at most k operations on that string.
// In one operation, you can choose any character of the string and change it to any other uppercase English character.

var characterReplacement = function(s, k) {
    let map = new Map()
    let l = r = 0
    let maxLen = 0
    let maxFreq = 0
    while(r < s.length) {
        let char = s[r]
        map.set(char, (map.get(char) || 0) + 1)
        maxFreq = Math.max(maxFreq, map.get(char))

        // window size - maxFreq > k
        while(r-l+1 - maxFreq > k) {
            let charToRemove = s[l]
            map.set(charToRemove, (map.get(charToRemove) || 0) - 1)
            if(map.get(charToRemove) === 0) map.delete(charToRemove)
            l++
        }

        maxLen = Math.max(maxLen, r-l+1)
        r++
    }
    return maxLen
};

// COMMON MISTAKES:
// - Not updating the window boundaries correctly.
// - Forgetting to maintain necessary data structures for tracking elements within the window.
// - Not handling edge cases, such as empty strings or arrays.

// TIME & SPACE:
// - Time Complexity: O(n), where n is the length of the input string or array.
// - Space Complexity: O(1) or O(k), depending on the number of unique elements in the window.

// RELATED PROBLEMS:
// - Minimum Size Subarray Sum
// - Longest Substring Without Repeating Characters
// - Permutation in String
// - Find All Anagrams in a String
// - Sliding Window Maximum
// - Subarrays with K Different Integers
// - Longest Substring with At Most K Distinct Characters


// Problem: Binary Subarrays With Sum
// Given a binary array nums and an integer goal, return the number of non-empty subarrays with a sum goal.
// A subarray is a contiguous part of the array.

// Intuition:
// - We can use the sliding window technique to count the number of subarrays with at most a certain sum.
// - By calculating the number of subarrays with at most 'goal' and subtracting the number of subarrays with at most 'goal - 1',
// - we can get the number of subarrays with exactly 'goal' sum.
// - This approach reduces the space complexity compared to using a hashmap to store prefix sums.


var numSubarraysWithSum = function (nums, goal) {
  // can be solved like subarrays with sum k (hashmap approach) but that takes O(n) space, lets reduce the space

  // no. of subarrays with exact sum goal =
  //      (no. of subarrays with atmost sum goal)
  //      - (no. of subarrays with atmost sum goal-1)
  return atMost(goal) - atMost(goal - 1)

  function atMost(goal) {
    if (goal < 0) return 0
    let l = (r = 0)
    let count = 0
    let sum = 0

    while (r < nums.length) {
      sum += nums[r]

      while (sum > goal) {
        sum -= nums[l]
        l++
      }

      count += r - l + 1
      r++
    }
    return count
  }
}

// Problem: Subarrays with K Different Integers
// Given an array A of positive integers, call a (contiguous, not necessarily distinct) 
// subarray of A good if the number of different integers in that subarray is exactly K.
// return the number of good subarrays of A.

// Intuition:
// - Similar to the previous problem, we can use the sliding window technique to count the number of subarrays with at most K distinct integers.
// - By calculating the number of subarrays with at most K distinct integers and subtracting the number of subarrays with at most K-1 distinct integers,
// - we can get the number of subarrays with exactly K distinct integers.


var subarraysWithKDistinct = function (nums, k) {
  return atMost(k) - atMost(k - 1)

  function atMost(k) {
    if (k < 0) return 0

    let l = 0,
      r = 0
    let freqMap = new Map()
    let count = 0

    while (r < nums.length) {
      freqMap.set(nums[r], (freqMap.get(nums[r]) || 0) + 1)

      while (freqMap.size > k) {
        let freq = freqMap.get(nums[l]) - 1
        if (freq === 0) freqMap.delete(nums[l])
        else freqMap.set(nums[l], freq)
        l++
      }

      count += r - l + 1
      r++
    }
    return count
  }
}