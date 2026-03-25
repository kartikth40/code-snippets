// Stack Implementation

// A stack is a LIFO (Last In, First Out) data structure.
// Think of it like a stack of plates — you add and remove from the top.

// Time Complexity:
// - push: O(1)
// - pop: O(1)
// - peek: O(1)
// - isEmpty: O(1)

// When to use:
// - Matching parentheses/brackets
// - Undo/redo operations
// - DFS traversal (iterative)
// - Expression evaluation (infix, postfix)
// - Monotonic stack problems (next greater element)
// - Function call simulation (recursion stack)

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

  size() {
    return this.s.length
  }
}

// === MIN STACK (O(1) getMin) ===
// Common interview problem: design a stack that supports getMin in O(1)
class MinStack {
  constructor() {
    this.stack = []
    this.minStack = [] // tracks minimum at each level
  }

  push(val) {
    this.stack.push(val)
    const min = this.minStack.length === 0
      ? val
      : Math.min(val, this.minStack[this.minStack.length - 1])
    this.minStack.push(min)
  }

  pop() {
    this.stack.pop()
    this.minStack.pop()
  }

  top() {
    return this.stack[this.stack.length - 1]
  }

  getMin() {
    return this.minStack[this.minStack.length - 1]
  }
}

// Examples
const stack = new Stack()
stack.push(1)
stack.push(2)
stack.push(3)
console.log(stack.peek())    // 3
console.log(stack.pop())     // 3
console.log(stack.size())    // 2
console.log(stack.isEmpty()) // false

const minStack = new MinStack()
minStack.push(5)
minStack.push(2)
minStack.push(7)
console.log(minStack.getMin())  // 2
minStack.pop()
console.log(minStack.getMin())  // 2
minStack.pop()
console.log(minStack.getMin())  // 5
