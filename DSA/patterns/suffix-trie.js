// PATTERN NAME: Suffix Trie for Counting Distinct Substrings
// PROBLEM STATEMENT: Given a string s, count the number of distinct substrings of s.

// WHEN TO USE:
// - When you need to count the number of distinct substrings in a string
// - When you want to efficiently store and query all suffixes of a string
// - When solving problems related to string processing, pattern matching, or substring queries

// CORE IDEA (INTUITION):
// - A suffix trie is a tree-like data structure that stores all suffixes of a string.
// - Each path from the root to a leaf represents a suffix of the string.
// - By inserting all suffixes into the trie, we can count the number of distinct substrings by counting the number of nodes in the trie.
// - Alternatively, we can use a suffix array and longest common prefix (LCP) array to count distinct substrings more efficiently.


// INVARIANTS:
// - Each node in the trie represents a unique substring of the original string.
// - The number of distinct substrings is equal to the number of nodes in the trie (excluding the root).
// - In the suffix array approach, the number of distinct substrings can be calculated using the lengths of the suffixes and their longest common prefixes.

// TEMPLATE / SKELETON:

class Solution {
  countSubs(s) {
    // return bruteForce(s)
    // return suffixTrie(s)
    return suffixeTrie_LCP(s)
  }
}
function bruteForce(s) {
  // Time: O(n^3) (substring creation + hashing)
  // Space: O(n^2)

  const set = new Set()
  const n = s.length

  for (let i = 0; i < n; i++) {
    let cur = ''
    for (let j = i; j < n; j++) {
      cur += s[j] // build substring
      set.add(cur) // store it
    }
  }

  return set.size
}

function suffixTrie(s) {
  // Time: O(n^2)
  // Space: O(n^2)
  class TrieNode {
    constructor() {
      this.children = new Map()
    }
  }

  const root = new TrieNode()
  let count = 0

  for (let i = 0; i < s.length; i++) {
    let node = root

    // insert suffix starting at i
    for (let j = i; j < s.length; j++) {
      const ch = s[j]
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode())
        count++ // new node = new substring
      }
      node = node.children.get(ch)
    }
  }

  return count
}

function suffixeTrie_LCP(s) {
  //Longest Common Prefix
  // Time: O(nlogn)
  // Space: O(n)

  const n = s.length

  // 1. Build suffix array (store starting indices)
  const suffixes = Array.from({ length: n }, (_, i) => i)

  suffixes.sort((i, j) => {
    // Compare suffixes s[i:] and s[j:]
    while (i < n && j < n && s[i] === s[j]) {
      i++
      j++
    }

    if (i === n) return -1
    if (j === n) return 1
    return s[i] < s[j] ? -1 : 1
  })

  // 2. LCP helper
  function lcp(i, j) {
    let len = 0
    while (i < n && j < n && s[i] === s[j]) {
      len++
      i++
      j++
    }
    return len
  }

  // 3. Count distinct substrings
  let result = n - suffixes[0] // first suffix contributes all its prefixes

  for (let i = 1; i < n; i++) {
    const curLen = n - suffixes[i]
    const common = lcp(suffixes[i], suffixes[i - 1])
    result += curLen - common
  }

  return result
}

// EXAMPLE:
const sol = new Solution()
console.log(sol.countSubs('abc')) // 6 (a, b, c, ab, bc, abc)
console.log(sol.countSubs('aaa')) // 3 (a, aa, aaa)


// COMMON MISTAKES:
// - Not counting the empty substring if required by the problem statement.
// - Not handling duplicate substrings correctly, leading to overcounting.
// - Not optimizing the solution, resulting in timeouts for larger inputs when using brute force.
// - Forgetting to consider all suffixes of the string when building the trie or suffix array.

// TIME & SPACE:
// - Time complexity
// Brute Force: O(n^3) due to substring creation and hashing.
// Suffix Trie: O(n^2) due to inserting all suffixes and counting nodes.
// Suffix Array + LCP: O(n log n) due to sorting suffixes and calculating LCP.

// - Space complexity
// Brute Force: O(n^2) for storing all distinct substrings in a set.
// Suffix Trie: O(n^2) in the worst case when all substrings are distinct.
// Suffix Array + LCP: O(n) for storing suffix indices and LCP values.

// RELATED PROBLEMS:
// - Longest Repeating Substring
// - Longest Common Substring of Two Strings
// - Palindromic Substrings
// - Substring with Concatenation of All Words
// - Distinct Echo Substrings