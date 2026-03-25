// PATTERN NAME: Two Pointers

// WHEN TO USE:
// - Sorted array problems (pair sum, triplet sum, remove duplicates)
// - Palindrome checking
// - Merging two sorted arrays
// - Partitioning (Dutch National Flag)
// - Container with most water, trapping rain water

// CORE IDEA (INTUITION):
// - Use two pointers moving toward each other (opposite direction)
//   or in the same direction (fast/slow) to reduce O(n²) to O(n).
// - Opposite direction: start from both ends, converge based on condition.
// - Same direction: fast pointer explores, slow pointer tracks valid position.

// INVARIANTS:
// - Pointers never cross (opposite) or slow never passes fast (same direction)
// - The search space shrinks with each step
// - For sorted arrays: moving left pointer right increases sum, moving right pointer left decreases sum

// TEMPLATE / SKELETON:

// === OPPOSITE DIRECTION ===

// Two Sum (sorted array)
function twoSumSorted(nums, target) {
  let left = 0, right = nums.length - 1

  while (left < right) {
    const sum = nums[left] + nums[right]
    if (sum === target) return [left, right]
    if (sum < target) left++
    else right--
  }

  return [-1, -1]
}

// Container With Most Water
function maxArea(height) {
  let left = 0, right = height.length - 1
  let maxWater = 0

  while (left < right) {
    const width = right - left
    const h = Math.min(height[left], height[right])
    maxWater = Math.max(maxWater, width * h)

    // Move the shorter side — it's the bottleneck
    if (height[left] < height[right]) left++
    else right--
  }

  return maxWater
}

// Valid Palindrome (with alphanumeric filter)
function isPalindrome(s) {
  let left = 0, right = s.length - 1

  while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++
    while (left < right && !isAlphaNum(s[right])) right--

    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false
    left++
    right--
  }

  return true
}

function isAlphaNum(c) {
  return /[a-zA-Z0-9]/.test(c)
}

// === SAME DIRECTION (Fast/Slow) ===

// Remove Duplicates from Sorted Array (in-place)
function removeDuplicates(nums) {
  if (nums.length === 0) return 0

  let slow = 0 // points to last unique element

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++
      nums[slow] = nums[fast]
    }
  }

  return slow + 1 // length of unique portion
}

// === DUTCH NATIONAL FLAG (3-way partition) ===

// Sort Colors (0s, 1s, 2s)
function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]]
      low++
      mid++
    } else if (nums[mid] === 1) {
      mid++
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]]
      high--
      // don't increment mid — swapped element needs checking
    }
  }

  return nums
}

// COMMON MISTAKES:
// - Forgetting to sort the array first (two pointers on unsorted = wrong)
// - Off-by-one: using left <= right when it should be left < right
// - Not skipping duplicates in problems like 3Sum
// - Moving the wrong pointer (always move the one that improves the condition)
// - In Dutch National Flag: incrementing mid after swapping with high

// TIME & SPACE:
// - Time: O(n) for single pass, O(n log n) if sorting needed first
// - Space: O(1) — in-place pointer manipulation

// RELATED PROBLEMS:
// - Two Sum II (LC 167)
// - 3Sum (LC 15)
// - Container With Most Water (LC 11)
// - Trapping Rain Water (LC 42)
// - Valid Palindrome (LC 125)
// - Remove Duplicates from Sorted Array (LC 26)
// - Sort Colors (LC 75)
// - Move Zeroes (LC 283)
// - Squares of a Sorted Array (LC 977)

console.log(twoSumSorted([2, 7, 11, 15], 9))   // [0, 1]
console.log(maxArea([1,8,6,2,5,4,8,3,7]))       // 49
console.log(isPalindrome("A man, a plan, a canal: Panama"))  // true
console.log(removeDuplicates([1,1,2,2,3]))       // 3
console.log(sortColors([2,0,2,1,1,0]))           // [0,0,1,1,2,2]
