// PATTERN NAME: Backtracking

// WHEN TO USE:
// - Generate all permutations, combinations, or subsets
// - Constraint satisfaction (N-Queens, Sudoku, crossword)
// - Path finding with constraints (word search, maze)
// - Partition problems (palindrome partitioning)
// - Any "find ALL valid configurations" problem

// CORE IDEA (INTUITION):
// - Build a solution incrementally, one choice at a time
// - At each step, if the current partial solution can't lead to a valid answer, PRUNE (backtrack)
// - Undo the last choice and try the next option
// - Think of it as DFS on a decision tree

// INVARIANTS:
// - State is restored after each recursive call (undo the choice)
// - Pruning conditions are checked BEFORE making a recursive call
// - Base case: solution is complete (add to results)
// - Each level of recursion represents one decision point

// TEMPLATE / SKELETON:

// === GENERAL TEMPLATE ===
// function backtrack(state, choices, result) {
//   if (isComplete(state)) { result.push([...state]); return }
//   for (choice of choices) {
//     if (!isValid(choice)) continue   // prune
//     state.push(choice)               // make choice
//     backtrack(state, nextChoices, result)
//     state.pop()                      // undo choice
//   }
// }

// === SUBSETS ===
// Generate all subsets (power set)
function subsets(nums) {
  const result = []

  function backtrack(start, current) {
    result.push([...current])

    for (let i = start; i < nums.length; i++) {
      current.push(nums[i])
      backtrack(i + 1, current)
      current.pop()
    }
  }

  backtrack(0, [])
  return result
}

// Subsets II (with duplicates — skip consecutive duplicates)
function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b)
  const result = []

  function backtrack(start, current) {
    result.push([...current])

    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue // skip duplicates
      current.push(nums[i])
      backtrack(i + 1, current)
      current.pop()
    }
  }

  backtrack(0, [])
  return result
}

// === PERMUTATIONS ===
function permute(nums) {
  const result = []

  function backtrack(current, used) {
    if (current.length === nums.length) {
      result.push([...current])
      return
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue
      used[i] = true
      current.push(nums[i])
      backtrack(current, used)
      current.pop()
      used[i] = false
    }
  }

  backtrack([], new Array(nums.length).fill(false))
  return result
}

// === COMBINATIONS ===
// Choose k elements from 1..n
function combine(n, k) {
  const result = []

  function backtrack(start, current) {
    if (current.length === k) {
      result.push([...current])
      return
    }

    // Pruning: need (k - current.length) more, so stop early
    for (let i = start; i <= n - (k - current.length) + 1; i++) {
      current.push(i)
      backtrack(i + 1, current)
      current.pop()
    }
  }

  backtrack(1, [])
  return result
}

// Combination Sum (can reuse elements, target sum)
function combinationSum(candidates, target) {
  const result = []

  function backtrack(start, current, remaining) {
    if (remaining === 0) { result.push([...current]); return }
    if (remaining < 0) return

    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i])
      backtrack(i, current, remaining - candidates[i]) // i, not i+1 (reuse allowed)
      current.pop()
    }
  }

  backtrack(0, [], target)
  return result
}

// === N-QUEENS ===
function solveNQueens(n) {
  const result = []
  const cols = new Set()
  const diag1 = new Set() // row - col
  const diag2 = new Set() // row + col

  function backtrack(row, board) {
    if (row === n) {
      result.push(board.map(r => r.join('')))
      return
    }

    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue

      cols.add(col)
      diag1.add(row - col)
      diag2.add(row + col)
      board[row][col] = 'Q'

      backtrack(row + 1, board)

      cols.delete(col)
      diag1.delete(row - col)
      diag2.delete(row + col)
      board[row][col] = '.'
    }
  }

  const board = Array(n).fill(null).map(() => Array(n).fill('.'))
  backtrack(0, board)
  return result
}

// === WORD SEARCH ===
function exist(board, word) {
  const m = board.length, n = board[0].length

  function backtrack(r, c, idx) {
    if (idx === word.length) return true
    if (r < 0 || r >= m || c < 0 || c >= n) return false
    if (board[r][c] !== word[idx]) return false

    const temp = board[r][c]
    board[r][c] = '#' // mark visited

    const found = backtrack(r + 1, c, idx + 1) ||
                  backtrack(r - 1, c, idx + 1) ||
                  backtrack(r, c + 1, idx + 1) ||
                  backtrack(r, c - 1, idx + 1)

    board[r][c] = temp // restore
    return found
  }

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (backtrack(r, c, 0)) return true
    }
  }
  return false
}

// === PALINDROME PARTITIONING ===
function partition(s) {
  const result = []

  function isPalindrome(str, l, r) {
    while (l < r) {
      if (str[l] !== str[r]) return false
      l++; r--
    }
    return true
  }

  function backtrack(start, current) {
    if (start === s.length) {
      result.push([...current])
      return
    }

    for (let end = start; end < s.length; end++) {
      if (!isPalindrome(s, start, end)) continue
      current.push(s.substring(start, end + 1))
      backtrack(end + 1, current)
      current.pop()
    }
  }

  backtrack(0, [])
  return result
}

// COMMON MISTAKES:
// - Forgetting to undo the choice (backtrack step)
// - Not cloning the current state when adding to results ([...current])
// - Missing pruning — leads to TLE on large inputs
// - Wrong start index: i+1 for combinations (no reuse), i for reuse allowed
// - Not sorting input before handling duplicates
// - Modifying shared state without restoring it

// TIME & SPACE:
// - Subsets: O(2^n) time, O(n) space (recursion depth)
// - Permutations: O(n!) time, O(n) space
// - Combinations C(n,k): O(C(n,k)) time, O(k) space
// - N-Queens: O(N!) time, O(N) space
// - Word Search: O(m*n*4^L) time where L = word length

// RELATED PROBLEMS:
// - Subsets (LC 78), Subsets II (LC 90)
// - Permutations (LC 46), Permutations II (LC 47)
// - Combinations (LC 77)
// - Combination Sum (LC 39), Combination Sum II (LC 40)
// - N-Queens (LC 51)
// - Word Search (LC 79)
// - Palindrome Partitioning (LC 131)
// - Letter Combinations of Phone Number (LC 17)
// - Generate Parentheses (LC 22)
// - Sudoku Solver (LC 37)

console.log(subsets([1, 2, 3]))
// [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]

console.log(permute([1, 2, 3]).length)  // 6

console.log(combine(4, 2))
// [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]

console.log(combinationSum([2, 3, 6, 7], 7))
// [[2,2,3],[7]]

console.log(solveNQueens(4).length)  // 2
