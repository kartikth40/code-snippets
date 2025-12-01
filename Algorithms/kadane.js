// Kadane’s Algorithm
function kadane(arr) {
  let best = -Infinity
  let cur = 0

  for (const x of arr) {
    cur = Math.max(x, cur + x)
    best = Math.max(best, cur)
  }
  return best
}