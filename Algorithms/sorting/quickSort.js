// quick sort

// Time Complexity: O(n log n) on average, O(n^2) in the worst case
// Space Complexity: O(log n) due to call stack
// Algorithm Steps (Hoare's Partitioning):
// 1. Choose a pivot element from the array.
// 2. Partition the array into two halves: elements less than the pivot and elements greater than the pivot.
// 3. Recursively apply the same process to both partitions until the entire array is sorted.

var quickSort = function (nums) {
  // Helper function to sort a partition of the array
  function sort(low, high) {
    // Base case: if partition has 0 or 1 element, it's already sorted
    if (low >= high) return
    
    // Initialize left and right pointers
    let i = low
    let j = high
    
    // Choose middle element as pivot
    let pivotIndex = Math.floor((i + j) / 2)
    let pivot = nums[pivotIndex]
    
    // Partition: rearrange elements so smaller ones are left, larger ones are right
    while (i <= j) {
      // Move left pointer right until we find element >= pivot
      while (i <= j && nums[i] < pivot) i++
      
      // Move right pointer left until we find element <= pivot
      while (i <= j && nums[j] > pivot) j--
      
      // Swap elements at i and j if pointers haven't crossed
      if (i <= j) {
        [nums[i], nums[j]] = [nums[j], nums[i]]
        i++
        j--
      }
    }
    
    // Recursively sort left partition (elements <= pivot)
    sort(low, j)
    
    // Recursively sort right partition (elements >= pivot)
    sort(i, high)
  }
  
  // Start sorting the entire array
  sort(0, nums.length - 1)
  return nums
}

// Example usage:
console.log('quick sort:')
console.log(quickSort([3, 6, 8, 10, 1, 2, 1])) // Output: [1, 1, 2, 3, 6, 8, 10]
