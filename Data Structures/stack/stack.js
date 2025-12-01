class Stack {
  constructor() {
    this.s = []
  }
  push(x) {
    this.s.push(x)
  }
  pop() {
    return this.s.pop()
  }
  peek() {
    return this.s[this.s.length - 1]
  }
  isEmpty() {
    return this.s.length === 0
  }
}