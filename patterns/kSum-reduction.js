/**
 * PATTERN: k-Sum Reduction (Recursive Two Pointer)
 *
 * INTUITION:
 * - Reduce k-Sum problem to 2-Sum by recursively fixing elements
 * - Use two-pointer technique for the base case (2-Sum)
 * - Sort array to enable two-pointer approach and easy duplicate skipping
 *
 * ALGORITHM:
 * 1. Sort the array to enable two-pointer technique
 * 2. Recursively reduce k-Sum to (k-1)-Sum by fixing one element at a time
 * 3. Base case (k=2): Use two-pointer technique
 *    - Left pointer starts from current position
 *    - Right pointer starts from end
 *    - Move pointers based on sum comparison with target
 * 4. Skip duplicates to avoid duplicate quadruplets
 *
 * TIME COMPLEXITY: O(n^(k-1))
 * - For 4-Sum: O(n³)
 * - Sorting: O(n log n)
 * - Recursion depth: k-2 levels
 * - Each level: O(n) iterations
 * - Base case (2-pointer): O(n)
 *
 * SPACE COMPLEXITY: O(k)
 * - Recursion stack depth: O(k)
 * - Current array storage: O(k)
 *
 * KEY TECHNIQUES:
 * 1. Reduction: Break down k-Sum into smaller subproblems
 * 2. Two Pointers: Efficient O(n) solution for sorted 2-Sum
 * 3. Duplicate Skipping: Avoid processing same elements multiple times
 * 4. Early Termination: Loop bounds adjusted (nums.length - k + 1)
 *
 * GENERALIZABLE:
 * - Works for any k-Sum problem (3-Sum, 4-Sum, 5-Sum, etc.)
 * - Just change initial call: kSum(0, k, [], 0)
 */

var fourSum = function (nums, target) {
  let quads = []
  nums.sort((a, b) => a - b)

  function kSum(start, k, curArr, curSum) {
    if (k <= 2) {
      let i = start
      let j = nums.length - 1
      while (i < j) {
        let sum = nums[i] + nums[j] + curSum
        if (sum === target) {
          quads.push([...curArr, nums[i], nums[j]])
          while (i < j && nums[i] === nums[i + 1]) i++
          while (i < j && nums[j] === nums[j - 1]) j--
          i++
          j--
        } else if (sum < target) {
          i++
        } else {
          j--
        }
      }
    } else {
      for (let i = start; i < nums.length - k + 1; i++) {
        if (i > start && nums[i] === nums[i - 1]) continue
        curArr.push(nums[i])
        kSum(i + 1, k - 1, curArr, curSum + nums[i])
        curArr.pop()
      }
    }
  }

  kSum(0, 4, [], 0)
  return quads
}
