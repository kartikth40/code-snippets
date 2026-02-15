// PATTERN NAME: Monotonic Stack

// WHEN TO USE:
// - Problems that require finding the next/previous greater/smaller element
// - Stock span problems
// - Histogram area calculations
// - Sliding window maximum/minimum problems
// - Problems involving maintaining a sequence of elements in sorted order

// CORE IDEA (INTUITION):
// - Use a stack to keep track of indices of elements in a way that the elements
//   corresponding to those indices are in a specific order (increasing or decreasing)
// - When processing a new element, pop elements from the stack that violate the order
// - The top of the stack always represents the most recent element that maintains the order

// INVARIANTS:
// - The stack maintains a monotonic order (either increasing or decreasing)
// - Each element is pushed and popped at most once
// - The indices in the stack correspond to elements that are relevant for comparison

// TEMPLATE / SKELETON:

// Next Greater Element using Monotonic Stack
function nextGreater(arr) {
  const res = Array(arr.length).fill(-1)
  const stack = [] // indexes

  for (let i = 0; i < arr.length; i++) {
    while (stack.length && arr[i] > arr[stack[stack.length - 1]]) {
      const idx = stack.pop()
      res[idx] = arr[i]
    }
    stack.push(i)
  }

  return res
}

// COMMON MISTAKES:
// - Not maintaining the correct order in the stack (increasing vs decreasing)
// - Forgetting to handle elements that do not have a next/previous greater/smaller element
// - Pushing values instead of indices onto the stack, leading to incorrect comparisons
// - Not initializing the result array properly

// TIME & SPACE:
// - Time Complexity: O(n) where n is the number of elements in the array
// - Space Complexity: O(n) for the stack and result array

// RELATED PROBLEMS:
// - Daily Temperatures
// - Largest Rectangle in Histogram
// - Sliding Window Maximum
// - Trapping Rain Water


// Another Example: Largest Rectangle in Histogram
// Given an array of integers heights representing the histogram's bar height
// where the width of each bar is 1, return the area of the largest rectangle in the histogram.

// Intuition:
// Use two monotonic stacks to find the previous smaller and next smaller elements for each bar.
// The width of the largest rectangle that can be formed with each bar as the smallest height
// is determined by the distance between the previous and next smaller bars.

// Explanation:
// For each bar, we find the index of the previous smaller bar and the next smaller bar.
// The width of the rectangle that can be formed with the current bar as the smallest height
// is given by (nextSmallerIndex - prevSmallerIndex - 1).
// The area is then height * width. We compute this for each bar and keep track of the maximum area.

var largestRectangleArea = function(heights) {
    const n = heights.length
    let prevSmaller = new Array(n).fill(-1)  // Index of previous smaller, -1 if none
    let nextSmaller = new Array(n).fill(n)   // Index of next smaller, n if none
    
    // Find previous smaller element for each position
    let stack = []
    for(let i = 0; i < n; i++) {
        // Pop elements >= current (we want strictly smaller)
        while(stack.length > 0 && heights[stack[stack.length - 1]] >= heights[i]) {
            stack.pop()
        }
        
        // If stack not empty, top is the previous smaller
        if(stack.length > 0) {
            prevSmaller[i] = stack[stack.length - 1]
        }
        
        stack.push(i)
    }
    
    // Find next smaller element for each position
    stack = []
    for(let i = n - 1; i >= 0; i--) {
        // Pop elements >= current (we want strictly smaller)
        while(stack.length > 0 && heights[stack[stack.length - 1]] >= heights[i]) {
            stack.pop()
        }
        
        // If stack not empty, top is the next smaller
        if(stack.length > 0) {
            nextSmaller[i] = stack[stack.length - 1]
        }
        
        stack.push(i)
    }
    
    // Calculate max area
    let maxArea = 0
    for(let i = 0; i < n; i++) {
        let h = heights[i]
        // Width = range between next and prev smaller (exclusive)
        let w = nextSmaller[i] - prevSmaller[i] - 1
        let area = h * w
        maxArea = Math.max(maxArea, area)
    }
    
    return maxArea
}


// Another Example: Remove K Digits
// Given a non-negative integer num represented as a string, remove k digits from the number
// so that the new number is the smallest possible. Return the new number as a string.

// Intuition:
// Use a monotonic increasing stack to build the smallest number.
// Iterate through each digit, and while the current digit is smaller than the top of the stack
// and we still have digits to remove (k > 0), pop the stack.
// This ensures that we are removing larger digits that appear before smaller digits.

// Explanation:
// We maintain a stack that represents the digits of the resulting number.
// For each digit in the input number, we compare it with the top of the stack.
// If the current digit is smaller and we can still remove digits (k > 0), we pop the stack.
// After processing all digits, if we still have digits to remove, we remove them from the end of the stack.
// Finally, we construct the result from the stack, removing any leading zeros.

// Monotonic Increasing Stack to build smallest number

var removeKdigits = function (num, k) {
  if (k >= num.length) return '0'

  let stack = []

  // Build monotonic increasing stack (keep smaller digits)
  for (let char of num) {
    while (stack.length > 0 && stack[stack.length - 1] > char && k > 0) {
      stack.pop()
      k--
    }
    stack.push(char)
  }

  // Remove remaining k digits from end
  while (k > 0) {
    stack.pop()
    k--
  }

  let result = stack.join('')
  // Remove leading zeros
  let i = 0
  while (i < result.length && result[i] === '0') {
    i++
  }

  result = result.slice(i)

  return result || '0' // Return '0' if empty
}


// Another Example: Sum of Subarray Minimums
// Given an array of integers arr, find the sum of min(b), where b ranges over every (contiguous) subarray of arr.
// Since the answer may be large, return the answer modulo 10^9 + 7.

// Intuition:
// For each element, count how many subarrays it is the minimum in.
// The contribution of each element to the final sum is its value multiplied by
// the number of subarrays where it is the minimum.

// Explanation:
// Use two monotonic stacks to find the count of elements to the left and right
// that are greater than the current element.

var sumSubarrayMins = function(arr) {
    const MOD = 1e9 + 7
    const n = arr.length
    
    // leftCount[i]: number of elements to left (including i) where arr[i] is minimum
    // rightCount[i]: number of elements to right (including i) where arr[i] is minimum
    let leftCount = new Array(n).fill(1)
    let rightCount = new Array(n).fill(1)
    
    // Build leftCount using monotonic stack
    // For each element, find how far left it can extend as minimum
    let stack = []
    for(let i = 0; i < n; i++) {
        let count = 1  // At least counts itself
        
        // Pop all elements > current (current is smaller, so they can't be min)
        while(stack.length > 0 && arr[i] < stack[stack.length - 1].val) {
            count += stack.pop().count  // Absorb their count
        }
        
        stack.push({val: arr[i], count})
        leftCount[i] = count
    }
    
    // Build rightCount using monotonic stack (from right to left)
    // Use <= to avoid counting duplicate minimums twice
    stack = []
    for(let i = n - 1; i >= 0; i--) {
        let count = 1
        
        // Pop all elements > current (use <= to handle duplicates correctly)
        while(stack.length > 0 && arr[i] <= stack[stack.length - 1].val) {
            count += stack.pop().count
        }
        
        stack.push({val: arr[i], count})
        rightCount[i] = count
    }
    
    // Calculate total contribution of each element
    let result = 0
    for(let i = 0; i < n; i++) {
        // Number of subarrays where arr[i] is minimum
        let subarrays = (leftCount[i] * rightCount[i]) % MOD
        
        // Contribution = element × number of subarrays
        let contribution = (arr[i] * subarrays) % MOD
        
        result = (result + contribution) % MOD
    }
    
    return result
}



// Another Example: Sum of Subarray Ranges
// Given an integer array nums, return the sum of the ranges of all subarrays of nums.
// The range of a subarray is the difference between the maximum and minimum element in that subarray.

// Intuition:
// The sum of subarray ranges can be computed as the difference between
// the sum of subarray maximums and the sum of subarray minimums.

// Explanation:
// We can use the same monotonic stack approach used in the "Sum of Subarray Minimums"
// problem to compute both the sum of subarray maximums and minimums.
// The final result is obtained by subtracting the sum of minimums from the sum of maximums.

var subArrayRanges = function (nums) {
  return computeSum(nums, 'max') - computeSum(nums, 'min')
}

function computeSum(nums, type) {
  const n = nums.length
  const isMax = type === 'max'
  let leftCount = new Array(n)
  let rightCount = new Array(n)

  // Left pass
  let stack = []
  for (let i = 0; i < n; i++) {
    let count = 1
    while (stack.length > 0) {
      let top = stack[stack.length - 1].val
      let shouldPop = isMax ? nums[i] > top : nums[i] < top
      if (!shouldPop) break
      count += stack.pop().count
    }
    stack.push({ val: nums[i], count })
    leftCount[i] = count
  }

  // Right pass (use >= or <= to handle duplicates)
  stack = []
  for (let i = n - 1; i >= 0; i--) {
    let count = 1
    while (stack.length > 0) {
      let top = stack[stack.length - 1].val
      let shouldPop = isMax ? nums[i] >= top : nums[i] <= top
      if (!shouldPop) break
      count += stack.pop().count
    }
    stack.push({ val: nums[i], count })
    rightCount[i] = count
  }

  // Calculate contribution
  let total = 0
  for (let i = 0; i < n; i++) {
    total += nums[i] * leftCount[i] * rightCount[i]
  }

  return total
}