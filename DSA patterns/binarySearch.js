// PATTERN NAME: Binary Search

// WHEN TO USE:
// - Problems that require searching in a sorted array or range
// - Finding an element, boundary conditions, or optimal values

// CORE IDEA (INTUITION):
// - Repeatedly divide the search interval in half
// - Compare the target value to the middle element of the array
// - Narrow down the search to the left or right half based on comparison

// INVARIANTS:
// - The array or range is sorted
// - The search space is halved in each step
// - The target value, if present, remains within the search space

// TEMPLATE / SKELETON:

// EXAMPLE: Find Peak Element
// A peak element is an element that is strictly greater than its neighbors
// arr[i] is a peak if arr[i] > arr[i-1] and arr[i] > arr[i+1]

function findPeakElement(nums) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    
    // If mid element is less than next element, peak must be on right
    if (nums[mid] < nums[mid + 1]) {
      left = mid + 1;
    } else {
      // Otherwise, peak is on left (including mid)
      right = mid;
    }
  }
  
  return left; // or right, both point to same index
}

// COMMON MISTAKES:
// - Not updating left/right pointers correctly
// - Off-by-one errors in mid calculation
// - Not handling edge cases (e.g., single element array)

// TIME & SPACE:
// TIME COMPLEXITY: O(log n)
// SPACE COMPLEXITY: O(1)

// RELATED PROBLEMS:
// - Find Minimum in Rotated Sorted Array
// - Search in Rotated Sorted Array
// - First and Last Position of Element in Sorted Array
// - Median of Two Sorted Arrays
// - Kth Smallest Element in a Sorted Matrix



// Another Example: Kth Missing Positive Number

// Given a sorted array arr of positive integers and an integer k,
// return the kth positive integer that is missing from this array.

// Intuition:
// Use binary search to find the smallest index where the number of missing
// positive integers is at least k.

// Explanation:
// For each index mid, the number of missing integers before arr[mid] can be calculated as:
// missing = arr[mid] - (mid + 1)
// This works because if there were no missing numbers, arr[mid] would be equal to mid + 1.
// If the number of missing integers is less than k, we need to search in the right half.
// Otherwise, we search in the left half.

var findKthPositive = function (arr, k) {
  let l = 0
  let r = arr.length

  while (l < r) {
    let mid = Math.floor((l + r) / 2)

    // How many numbers are missing before arr[mid]?
    // arr[mid] = actual value, (mid+1) = expected value if no missing
    // Example: arr[3] = 7 means 3 missing (7 - 4 = 3)
    let missing = arr[mid] - (mid + 1)

    if (missing < k) {
      // Not enough missing yet, search right
      l = mid + 1
    } else {
      // Too many missing (or exactly k), search left
      r = mid
    }
  }

  // l = index where we'd insert kth missing number
  // l + k = adjust for position + missing count
  // Example: l=2 means after 2 elements, k=3 missing → answer = 2+3 = 5
  return l + k
}



// Another Example: Capacity To Ship Packages Within D Days
// A conveyor belt has packages that must be shipped from one port to another within D days.
// The ith package on the conveyor belt has a weight of weights[i].
// Each day, we load the ship with packages on the conveyor belt (in the order given by weights).

// Intuition:
// Use binary search to find the minimum ship capacity needed to ship all packages within D days.
// The lower bound is the maximum weight of a single package (since we can't split packages).
// The upper bound is the sum of all package weights (if we ship everything in one day).
// We check for each mid capacity if it's possible to ship all packages within D days.

// Explanation:
// We define a helper function canShip(capacity, weights, days) that checks if we can ship
// all packages within the given number of days with the specified ship capacity.
// We then perform binary search on the capacity range to find the minimum capacity that works.

var shipWithinDays = function(weights, days) {
    let maxW = Math.max(...weights)
    let sumW = weights.reduce((a, b) => a + b, 0)

    let i = maxW
    let j = sumW
    while(i <= j) {
        let cap = Math.floor((i+j)/2)
        if(canShip(cap, weights, days)) {
            j = cap-1
        }else{
            i = cap+1
        }
    }
    return i < maxW || i > sumW ? -1 : i
};

function canShip(capacity, weights, days) {
    let daysNeeded = 1
    let currentLoad = 0

    for(let w of weights) {
        if(currentLoad + w > capacity) {
            daysNeeded++
            currentLoad = w
        }else{
            currentLoad += w
        }
    }

    return days >= daysNeeded
}


// Another Example: Median in a Row-Wise Sorted Matrix
// Given a matrix mat of size m x n where each row is sorted in non-decreasing order,
// return the median of the matrix.

// Intuition:
// Use binary search on the value range (not indices) to find the median.
// The minimum value is the smallest element in the matrix,
// and the maximum value is the largest element.
// For each mid value, count how many elements are less than or equal to mid.
// If the count is less than the target (half of total elements), search in the higher half.
// Otherwise, search in the lower half.

// Explanation:
// The median is the (m*n)/2 + 1 th smallest element in the sorted order.
// We perform binary search on the value range from min to max in the matrix.
// For each mid value, we count how many elements are less than or equal to mid using
// an upper bound function for each row (since rows are sorted).

function median(mat) {
    let m = mat.length      // number of rows
    let n = mat[0].length   // number of columns
    
    // Find search space: min and max values in entire matrix
    let low = Infinity
    let high = -Infinity
    
    for(let i = 0; i < m; i++) {
        low = Math.min(low, mat[i][0])         // smallest in each row
        high = Math.max(high, mat[i][n-1])     // largest in each row
    }
    
    // Median will have exactly this many elements before it
    let target = Math.floor((m*n)/2) + 1
    
    // Binary search on VALUES (not indices)
    while(low <= high) {
        let mid = Math.floor((low+high)/2)
        
        // Count how many elements are <= mid across all rows
        let count = 0
        for(let i = 0; i < m; i++) {
            count += this.getCount(mat[i], mid)
        }
        
        // If count < target, median is larger
        if(count < target) {
            low = mid+1
        } else {
            // If count >= target, median is smaller or equal
            high = mid-1
        }
    }
    
    // low converges to the median value
    return low
}

// Upper bound: count elements <= limit in a sorted array
function getCount(arr, limit) {
    let left = 0, right = arr.length
    
    // Find first position where arr[pos] > limit
    while(left <= right) {
        let mid = Math.floor((left+right)/2)
        if(arr[mid] <= limit) {
            left = mid+1   // move right to find larger elements
        } else {
            right = mid-1  // move left, current is too large
        }
    }
    
    // left is the count of elements <= limit
    return left
}



// Another Example: Median of Two Sorted Arrays
// Given two sorted arrays nums1 and nums2 of size m and n respectively,
// return the median of the two sorted arrays.

// Intuition:
// Use binary search on the smaller array to find the correct partition
// that divides both arrays into left and right halves such that
// all elements in the left halves are less than or equal to those in the right halves.
// The median can then be calculated from the maximum of the left halves
// and the minimum of the right halves.

var findMedianSortedArrays = function(nums1, nums2) {

    // Always binary search on the smaller array
    // This guarantees O(log(min(m, n)))
    if (nums1.length > nums2.length)
        return findMedianSortedArrays(nums2, nums1)

    const A = nums1
    const B = nums2
    const m = A.length
    const n = B.length

    const total = m + n
    const half = Math.floor(total / 2)

    // Binary search on A's partition index
    let l = 0
    let r = m - 1

    while (true) {

        // i = last index on the left partition of A
        const i = Math.floor((l + r) / 2)

        // j = last index on the left partition of B
        // leftSize(A) + leftSize(B) = half
        const j = half - (i + 1) - 1

        // Handle out-of-bounds using +/- infinity
        const Aleft  = i >= 0 ? A[i] : -Infinity
        const Aright = i + 1 < m ? A[i + 1] : Infinity
        const Bleft  = j >= 0 ? B[j] : -Infinity
        const Bright = j + 1 < n ? B[j + 1] : Infinity

        // Correct partition:
        // all left elements <= all right elements
        if (Aleft <= Bright && Bleft <= Aright) {

            // Even total → average of two middle values
            if (total % 2 === 0) {
                return (
                    Math.max(Aleft, Bleft) +
                    Math.min(Aright, Bright)
                ) / 2
            }

            // Odd total → first element of right partition
            return Math.min(Aright, Bright)

        }
        // Too many elements taken from A → move left
        else if (Aleft > Bright) {
            r = i - 1
        }
        // Too few elements taken from A → move right
        else {
            l = i + 1
        }
    }
};
