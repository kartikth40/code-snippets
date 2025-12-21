// Quick Select

// Quick Select is an efficient algorithm for finding the k-th smallest (or largest) element in an unordered list.
// It is related to the Quick Sort sorting algorithm and works by partitioning the array around a pivot element.
// The average time complexity of Quick Select is O(n), making it faster than sorting the entire array when only a single element is needed.
// The worst-case time complexity is O(n^2), but this can be mitigated with good pivot selection strategies.
// Time Complexity: O(n) on average, O(n^2) in the worst case
// Space Complexity: O(1) for iterative version, O(log n) for recursive version due to call stack

// Algorithm Steps (Hoare's Partitioning):
// 1. Choose a pivot element from the array.
// 2. Partition the array into two halves: elements less than the pivot and elements greater than the pivot.
// 3. Determine which partition contains the k-th smallest element.
// 4. Recursively apply the same process to the relevant partition until the k-th smallest element is found.

function quickSelect(low, high, nums, target) {
  let i = low
  let j = high

  // Choose middle element as pivot
  let pivotIndex = Math.floor((i + j) / 2)
  let pivot = nums[pivotIndex]

  // Partition array around pivot
  while (i <= j) {
    // Find element from left that should be on right
    while (i <= j && nums[i] < pivot) i++
    // Find element from right that should be on left
    while (i <= j && nums[j] > pivot) j--
    // Swap elements if needed
    if (i <= j) {
      [nums[i], nums[j]] = [nums[j], nums[i]]
      i++
      j--
    }
  }

  // Recursively search in the partition containing target

  // After partitioning, check which side contains the target index
  // If target is in the right partition (i <= target)
  // i points to the start of elements >= pivot
  
  // After partitioning:
  // - Elements at indices [low...j] are <= pivot
  // - Elements at indices [i...high] are >= pivot
  // - j < i (they crossed over)
  
  // If target is in the right partition
  // We use `i <= target` because i marks the START of the right partition
  // If i <= target, then target is somewhere in [i...high]
  if (i <= target) {
    return quickSelect(i, high, nums, target)
  }
  // If target is in the left partition
  // j marks the END of the left partition
  // If j >= target, then target is somewhere in [low...j]
  if (j >= target) {
    return quickSelect(low, j, nums, target)
  }
  // Target is at correct position
  return nums[target]
}

var findKthLargest = function (nums, k) {
  // Convert k-th largest to index: k-th largest = (n-k)-th smallest (0-indexed)
  let target = nums.length - k
  return quickSelect(0, nums.length - 1, nums, target)
}

// Example usage:
console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2)) // Output: 5
console.log(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)) // Output: 4