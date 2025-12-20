// Quick Select

// Quick Select is an efficient algorithm for finding the k-th smallest (or largest) element in an unordered list.
// It is related to the Quick Sort sorting algorithm and works by partitioning the array around a pivot element.
// The average time complexity of Quick Select is O(n), making it faster than sorting the entire array when only a single element is needed.
// The worst-case time complexity is O(n^2), but this can be mitigated with good pivot selection strategies.


var findKthLargest = function (nums, k) {
  let target = nums.length - k

  function quickSelect(low, high) {
    let i = low
    let j = high

    let pivotIndex = Math.floor((i + j) / 2)
    let pivot = nums[pivotIndex]

    while (i <= j) {
      while (i <= j && nums[i] < pivot) i++
      while (i <= j && nums[j] > pivot) j--
      if (i <= j) {
        ;[nums[i], nums[j]] = [nums[j], nums[i]]
        i++
        j--
      }
    }

    if (i <= target) {
      return quickSelect(i, high)
    }
    if (j >= target) {
      return quickSelect(low, j)
    }
    return nums[target]
  }

  return quickSelect(0, nums.length - 1)
}