// PATTERN NAME: Monotonic Queue (Deque)

// WHEN TO USE:
// - Sliding window minimum/maximum
// - Problems needing min/max over a moving window in O(1) per element
// - Stock span, jump game variants with window constraints

// CORE IDEA (INTUITION):
// - Maintain a deque of indices where corresponding values are in DECREASING order (for max)
// - Front of deque = index of maximum in current window
// - When a new element arrives, remove all smaller elements from back (they can never be max)
// - Remove elements from front that fall outside the current window

// INVARIANTS:
// - Deque stores indices, not values
// - Values at deque indices are always in decreasing order (for max variant)
// - Front of deque is always within the current window
// - Each element is added and removed at most once → O(n) total

// TEMPLATE / SKELETON:

// Sliding Window Maximum — O(n) using array as deque
function maxSlidingWindow(nums, k) {
  const deque = [] // stores indices, values in decreasing order
  const result = []

  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside current window from front
    while (deque.length && deque[0] < i - k + 1) {
      deque.shift()
    }

    // Remove smaller elements from back (they'll never be the max)
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop()
    }

    deque.push(i)

    // Window is fully formed once i >= k - 1
    if (i >= k - 1) {
      result.push(nums[deque[0]]) // front has the maximum
    }
  }

  return result
}

// Sliding Window Minimum — same idea, keep INCREASING order
function minSlidingWindow(nums, k) {
  const deque = []
  const result = []

  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] < i - k + 1) {
      deque.shift()
    }

    while (deque.length && nums[deque[deque.length - 1]] >= nums[i]) {
      deque.pop()
    }

    deque.push(i)

    if (i >= k - 1) {
      result.push(nums[deque[0]])
    }
  }

  return result
}

// COMMON MISTAKES:
// - Removing from wrong end of deque (front = oldest, back = newest)
// - Forgetting to check window bounds (remove expired indices from front)
// - Using values instead of indices in the deque
// - Not waiting until window is fully formed before collecting results
// - Using strict < instead of <= when removing (depends on problem: duplicates matter)

// TIME & SPACE:
// - Time: O(n) — each element pushed and popped at most once
// - Space: O(k) — deque holds at most k elements

// RELATED PROBLEMS:
// - Sliding Window Maximum (LC 239)
// - Shortest Subarray with Sum at Least K (LC 862)
// - Longest Continuous Subarray with Abs Diff <= Limit (LC 1438)
// - Jump Game VI (LC 1696)
// - Constrained Subsequence Sum (LC 1425)

console.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3))  // [3,3,5,5,6,7]
console.log(minSlidingWindow([1,3,-1,-3,5,3,6,7], 3))  // [-1,-3,-3,-3,3,3]
