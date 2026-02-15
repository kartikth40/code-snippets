// Merge Sort

// A divide-and-conquer algorithm that divides the array into halves, sorts each half, and then merges them back together.

// Time Complexity: O(n log n)
// Space Complexity: O(n) for the temporary arrays used during merging

// Algorithm Steps:
// 1. If the array has one or zero elements, it is already sorted; return it.
// 2. Divide the array into two halves.
// 3. Recursively apply merge sort to each half.
// 4. Merge the two sorted halves into a single sorted array.

// Count of Smaller Numbers After Self
// Given an integer array nums, return an integer array counts where counts[i] is the number of smaller elements to the right of nums[i].

class ElementWithIndex {
  constructor(value, originalIndex) {
    this.value = value
    this.originalIndex = originalIndex
  }
}

var countSmaller = function (nums) {
  if (nums.length === 0) return []
  
  // Track count of smaller elements to the right for each index
  let counts = new Array(nums.length).fill(0)
  
  // Wrap each element with its original index to track positions during merge
  let elementsWithIndices = nums.map((num, index) => new ElementWithIndex(num, index))

  mergeSortAndCount(0, nums.length - 1, elementsWithIndices, counts)
  return counts
}

function mergeSortAndCount(left, right, elements, counts) {
  // Base case: single element is already sorted
  if (left === right) return [elements[left]]

  const mid = Math.floor((left + right) / 2)

  // Recursively sort left and right halves
  let sortedLeft = mergeSortAndCount(left, mid, elements, counts)
  let sortedRight = mergeSortAndCount(mid + 1, right, elements, counts)

  return mergeAndCount(sortedLeft, sortedRight, counts)
}

function mergeAndCount(leftArray, rightArray, counts) {
  let mergedArray = []
  let leftIndex = 0
  let rightIndex = 0

  while (leftIndex < leftArray.length && rightIndex < rightArray.length) {
    // If left element is greater, all remaining right elements are smaller
    if (leftArray[leftIndex].value > rightArray[rightIndex].value) {
      // Count all remaining elements in right array as smaller
      counts[leftArray[leftIndex].originalIndex] += rightArray.length - rightIndex
      mergedArray.push(leftArray[leftIndex++])
    } else {
      mergedArray.push(rightArray[rightIndex++])
    }
  }

  // Append remaining elements from left array
  while (leftIndex < leftArray.length) mergedArray.push(leftArray[leftIndex++])
  
  // Append remaining elements from right array
  while (rightIndex < rightArray.length) mergedArray.push(rightArray[rightIndex++])

  return mergedArray
}

// Example usage:
console.log(countSmaller([5, 2, 6, 1])) // Output: [2, 1, 1, 0]
console.log(countSmaller([-1])) // Output: [0]




// Sort List
// Given the head of a linked list, return the list after sorting it in ascending order.

var sortList = function (head) {
  if (!head || !head.next) return head

  let slow = head
  let fast = head
  let prev = head

  while (fast && fast.next) {
    prev = slow
    slow = slow.next
    fast = fast.next.next
  }
  prev.next = null

  let left = sortList(head)
  let right = sortList(slow)

  return mergeLists(left, right)

  function mergeLists(left, right) {
    let cur1 = left
    let cur2 = right
    let dummy = new ListNode(-1)
    let cur = dummy
    while (cur1 && cur2) {
      if (cur1.val < cur2.val) {
        cur.next = cur1
        cur = cur.next
        cur1 = cur1.next
      } else {
        cur.next = cur2
        cur = cur.next
        cur2 = cur2.next
      }
    }

    if (cur1 || cur2) cur.next = cur1 || cur2

    return dummy.next
  }
}