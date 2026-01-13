// Kadane’s Algorithm

// Intuition:
// - Kadane’s Algorithm is used to find the maximum sum of a contiguous subarray within a one-dimensional array of numbers.
// - The algorithm iterates through the array, maintaining a running sum of the current subarray and updating the maximum sum found so far.
// - If the running sum becomes negative, it is reset to zero, as starting a new subarray from the next element could yield a higher sum.

// Time Complexity: O(n)
// Space Complexity: O(1)

// When to use:
// - When you need to find the maximum sum of a contiguous subarray in an array of integers.
// - When you want an efficient solution that runs in linear time without using extra space.
// - When dealing with problems related to subarrays, such as finding the maximum product subarray or the longest subarray with a given sum.

function kadane(arr) {
  let best = -Infinity
  let cur = 0

  for (const x of arr) {
    cur = Math.max(x, cur + x)
    best = Math.max(best, cur)
  }
  return best
}