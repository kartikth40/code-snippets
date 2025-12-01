// Two pointers for sorted array pair sum
function pairSumSorted(arr, target) {
  let l = 0,
    r = arr.length - 1

  while (l < r) {
    const sum = arr[l] + arr[r]
    if (sum === target) return [l, r]
    if (sum < target) l++
    else r--
  }

  return -1
}

module.exports = pairSumSorted
