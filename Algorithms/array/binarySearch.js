// Binary Search (classic)
function binarySearch(arr, target) {
  let l = 0,
    r = arr.length - 1

  while (l <= r) {
    const mid = (l + r) >> 1
    if (arr[mid] === target) return mid
    if (arr[mid] < target) l = mid + 1
    else r = mid - 1
  }
  return -1
}

// more patterns in DSA patterns/binary-search.js