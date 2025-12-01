// Subarray sum == k using prefix sums
function subarraySum(nums, k) {
  let count = 0
  const map = { 0: 1 }
  let sum = 0

  for (const n of nums) {
    sum += n
    if (map[sum - k]) count += map[sum - k]
    map[sum] = (map[sum] || 0) + 1
  }

  return count
}

module.exports = subarraySum
