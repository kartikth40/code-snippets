// Boyer-moore Majority Voting Algorithm

// WHEN TO USE:
// - Problems that require finding the majority element in a sequence
// - Situations where you need to identify an element that appears more than n/2 times in an array
// - Examples: Majority Element problem, finding dominant colors in images

// CORE IDEA (INTUITION):
// - Use a counting mechanism to track a potential majority candidate
// - Increment the count when the same element is found, decrement when a different element is found
// - When the count reaches zero, select a new candidate
// - The final candidate after one pass is guaranteed to be the majority element if it exists

// INVARIANTS:
// - The majority element appears more than n/2 times
// - The count variable reflects the balance between the candidate and other elements
// - When count is zero, the current candidate cannot be the majority element

// TEMPLATE / SKELETON:

// EXAMPLE: Majority Element
// Given an array nums of size n, return the majority element.
// The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.

function majorityElement(nums) {
  let candidate = null
  let count = 0
  for (let num of nums) {
    if (count === 0) {
      candidate = num
    }
    count += (num === candidate) ? 1 : -1
  }
  return candidate
}

// COMMON MISTAKES:
// - Assuming the majority element always exists without validation
// - Not resetting the count when a new candidate is chosen
// - Failing to understand that this algorithm only works when a majority element is guaranteed
// - Misinterpreting the count variable's role in tracking the candidate's dominance

// TIME & SPACE:
// - Time Complexity: O(n) where n is the number of elements in the array
// - Space Complexity: O(1) as it uses a constant amount of space

// RELATED PROBLEMS:
// - Majority Element II (finding elements that appear more than n/3 times)
// - Finding the mode in a dataset
// - Detecting dominant colors in image processing tasks


// Another Example: Majority Element II
// Given an integer array of size n, find all elements that appear more than ⌊ n/3 ⌋ times.

// Note: The algorithm can be extended to find all elements that appear more than n/k times by maintaining k-1 candidates.

// Intuition:
// Since we are looking for elements that appear more than n/3 times, there can be at most 2 such elements.
// We can use a similar counting mechanism as in the majority element problem, but maintain two candidates and their counts.

function majorityElementII(nums) {
  let candidate1 = null, candidate2 = null
  let count1 = 0, count2 = 0
  for (let num of nums) {
    if (num === candidate1) {
      count1++
    } else if (num === candidate2) {
      count2++
    }
    else if (count1 === 0) {
      candidate1 = num
      count1 = 1
    }
    else if (count2 === 0) {
      candidate2 = num
      count2 = 1
    }
    else {
      count1--
      count2--
    }
  }

  // Verify candidates
  count1 = 0
  count2 = 0
  for (let num of nums) {
    if (num === candidate1) count1++
    else if (num === candidate2) count2++
  }
  const result = []
  if (count1 > Math.floor(nums.length / 3)) result.push(candidate1)
  if (count2 > Math.floor(nums.length / 3)) result.push(candidate2)
  return result
}