// Linked List Implementation & Common Operations

// A singly linked list where each node points to the next node.
// Fundamental data structure for interviews — tests pointer manipulation skills.

// Time Complexity:
// - Access: O(n)
// - Search: O(n)
// - Insert at head: O(1)
// - Insert at tail: O(n) without tail pointer, O(1) with
// - Delete: O(n) to find, O(1) to remove

// When to use:
// - When you need O(1) insertion/deletion at known positions
// - When you don't need random access
// - Implementing stacks, queues, LRU cache
// - Problems involving pointer manipulation (reverse, merge, cycle detection)

class ListNode {
  constructor(val = 0, next = null) {
    this.val = val
    this.next = next
  }
}

// === REVERSE LINKED LIST (iterative) ===
// The single most important linked list operation for interviews
function reverseList(head) {
  let prev = null
  let curr = head

  while (curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }

  return prev
}

// === REVERSE LINKED LIST (recursive) ===
function reverseListRecursive(head) {
  if (!head || !head.next) return head

  const newHead = reverseListRecursive(head.next)
  head.next.next = head
  head.next = null

  return newHead
}

// === DETECT CYCLE (Floyd's Tortoise & Hare) ===
function hasCycle(head) {
  let slow = head, fast = head

  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) return true
  }

  return false
}

// === FIND CYCLE START ===
function detectCycle(head) {
  let slow = head, fast = head

  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next

    if (slow === fast) {
      // Move one pointer to head, advance both by 1
      slow = head
      while (slow !== fast) {
        slow = slow.next
        fast = fast.next
      }
      return slow // cycle start
    }
  }

  return null
}

// === FIND MIDDLE NODE ===
function middleNode(head) {
  let slow = head, fast = head

  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
  }

  return slow
}

// === MERGE TWO SORTED LISTS ===
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0)
  let curr = dummy

  while (l1 && l2) {
    if (l1.val <= l2.val) {
      curr.next = l1
      l1 = l1.next
    } else {
      curr.next = l2
      l2 = l2.next
    }
    curr = curr.next
  }

  curr.next = l1 || l2
  return dummy.next
}

// === REMOVE NTH NODE FROM END ===
// Two pointers: advance fast by n, then move both until fast reaches end
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head)
  let fast = dummy, slow = dummy

  for (let i = 0; i <= n; i++) fast = fast.next

  while (fast) {
    fast = fast.next
    slow = slow.next
  }

  slow.next = slow.next.next
  return dummy.next
}

// === PALINDROME LINKED LIST ===
// Find middle → reverse second half → compare
function isPalindrome(head) {
  let slow = head, fast = head

  // Find middle
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
  }

  // Reverse second half
  let prev = null
  while (slow) {
    const next = slow.next
    slow.next = prev
    prev = slow
    slow = next
  }

  // Compare both halves
  let left = head, right = prev
  while (right) {
    if (left.val !== right.val) return false
    left = left.next
    right = right.next
  }

  return true
}

// === ADD TWO NUMBERS (digits stored in reverse) ===
function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0)
  let curr = dummy
  let carry = 0

  while (l1 || l2 || carry) {
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry
    carry = Math.floor(sum / 10)
    curr.next = new ListNode(sum % 10)
    curr = curr.next

    if (l1) l1 = l1.next
    if (l2) l2 = l2.next
  }

  return dummy.next
}

// Helper: build list from array
function buildList(arr) {
  const dummy = new ListNode(0)
  let curr = dummy
  for (const val of arr) {
    curr.next = new ListNode(val)
    curr = curr.next
  }
  return dummy.next
}

// Helper: list to array
function toArray(head) {
  const result = []
  while (head) {
    result.push(head.val)
    head = head.next
  }
  return result
}

// Examples (only run when executed directly)
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const list1 = buildList([1, 2, 4])
  const list2 = buildList([1, 3, 4])
  console.log(toArray(mergeTwoLists(list1, list2)))  // [1,1,2,3,4,4]

  const list3 = buildList([1, 2, 3, 4, 5])
  console.log(toArray(reverseList(list3)))  // [5,4,3,2,1]

  console.log(middleNode(buildList([1,2,3,4,5])).val)  // 3

  console.log(isPalindrome(buildList([1,2,2,1])))  // true
  console.log(isPalindrome(buildList([1,2,3])))    // false
}

export { ListNode, reverseList, hasCycle, detectCycle, middleNode, mergeTwoLists, removeNthFromEnd, isPalindrome, addTwoNumbers, buildList, toArray }
