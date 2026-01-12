/**
 * Finds the maximum value in each sliding window of size k using a monotonic queue pattern.
 * 
 * **Pattern: Monotonic Decreasing Queue (stores indices, not values)**
 * 
 * **Intuition:**
 * - We maintain a deque of indices where corresponding values are in DECREASING order
 * - The back of the queue always contains the index of the maximum element in current window
 * - When a new element arrives, remove all smaller elements from front (they can never be max)
 * - Remove elements from back that fall outside the current window
 * 
 * **Why this works:**
 * - We only keep potentially useful elements (those that could be max in current or future windows)
 * - By storing indices instead of values, we can track window boundaries
 * 
 * **Simple Terms:**
 * Think of it like standing in line for a rollercoaster - if someone taller comes behind you,
 * you'll never be the tallest person visible from the back. We keep removing shorter people
 * from front until we find someone taller than the newcomer.
 * 
 * **Time Complexity:** O(n) - each element is added and removed at most once
 * **Space Complexity:** O(k) - deque stores at most k elements
 * 
 * @param {number[]} nums - The input array
 * @param {number} k - The size of the sliding window
 * @returns {number[]} Array containing maximum value of each window
 * 
 * @example
 * maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3) // returns [3,3,5,5,6,7]
 */
var maxSlidingWindow = function (nums, k) {
  let indexQueue = new Deque() // Stores indices in increasing order of their values
  let result = []

  for (let i = 0; i < nums.length; i++) {
    // Remove indices from front whose values are smaller than current
    // This maintains increasing order (largest at back)
    while (!indexQueue.isEmpty() && nums[indexQueue.front()] <= nums[i]) {
      indexQueue.popFront()
    }
    indexQueue.pushFront(i)

    // Remove indices that are outside current window
    // Window range: [i-k+1, i]
    let windowStart = i - k + 1
    if (indexQueue.back() < windowStart) {
      indexQueue.popBack()
    }

    // Add maximum of current window to result
    // Start adding results once we have a complete window
    if (i >= k - 1) {
      result.push(nums[indexQueue.back()]) // Back has the maximum
    }
  }

  return result
}
