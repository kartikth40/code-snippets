// Binary Search on Answer pattern
function minCapacity(weights, days) {
  let l = Math.max(...weights),
    r = weights.reduce((a, b) => a + b)

  const can = (cap) => {
    let need = 1,
      load = 0
    for (const w of weights) {
      if (load + w > cap) {
        need++
        load = 0
      }
      load += w
    }
    return need <= days
  }

  while (l < r) {
    const mid = Math.floor((l + r) / 2)
    if (can(mid)) r = mid
    else l = mid + 1
  }
  return l
}
