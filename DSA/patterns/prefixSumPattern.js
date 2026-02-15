// PATTERN NAME: Prefix Sum Pattern

// WHEN TO USE:
// - When you need to calculate the sum of elements in a subarray multiple times.
// - When you need to find the number of subarrays that meet a certain sum condition.
// - When you want to optimize brute-force solutions that involve nested loops for sum calculations.

// CORE IDEA (INTUITION):
// - Precompute the cumulative sums of the array elements.
// - Use these precomputed sums to quickly calculate the sum of any subarray in constant time.
// - Utilize hash maps to store frequencies of prefix sums for counting subarrays with specific properties.

// TEMPLATE / SKELETON:

// Problem: Subarray Sum Equals K
// Given an array of integers and an integer k, you need to find the total number of continuous subarrays whose sum equals to k.

// Subarray sum == k using prefix sums
function subarraySum(nums, k) {
  let count = 0
  const map = { 0: 1 }
  let sum = 0

  for (const n of nums) {
    sum += n
    if (map[sum - k]) count += map[sum - k]
    map[sum] = (map[sum] || 0) + 1
  }

  return count
}

// COMMON MISTAKES:
// - Not initializing the prefix sum map with the base case (sum 0).
// - Forgetting to update the prefix sum map after checking for subarrays.
// - Misunderstanding the relationship between current sum, target sum, and previous sums.

// TIME & SPACE:
// - Time Complexity: O(n), where n is the length of the input array.
// - Space Complexity: O(n), for storing the prefix sums in the hash map.

// RELATED PROBLEMS:
// - Continuous Subarray Sum
// - Count of Range Sum
// - Maximum Size Subarray Sum Equals k
// - Longest Subarray with Sum Divisible by K
// - Number of Subarrays with Bounded Maximum