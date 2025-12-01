// Next Greater Element using Monotonic Stack
function nextGreater(arr) {
  const res = Array(arr.length).fill(-1)
  const stack = [] // indexes

  for (let i = 0; i < arr.length; i++) {
    while (stack.length && arr[i] > arr[stack[stack.length - 1]]) {
      const idx = stack.pop()
      res[idx] = arr[i]
    }
    stack.push(i)
  }

  return res
}