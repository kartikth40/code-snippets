// Trie (Prefix Tree) Implementation

// A trie is a tree-like data structure that stores a dynamic set of strings,
// where the keys are usually strings. It is used for efficient retrieval of
// strings, especially for prefix-based searches.

// Time Complexity:
// - Insertion: O(m), where m is the length of the word being inserted.
// - Search: O(m), where m is the length of the word being searched.
// - Prefix Search: O(m), where m is the length of the prefix being searched.

// When to use:
// - When you need to store a large number of strings and perform quick lookups.
// - When you want to implement features like autocomplete or spell checking.
// - When you need to efficiently find all words with a given prefix.

class TrieNode {
  constructor() {
    this.children = {}
    this.isEnd = false
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode()
  }

  insert(word) {
    let cur = this.root
    for (const ch of word) {
      if (!cur.children[ch]) cur.children[ch] = new TrieNode()
      cur = cur.children[ch]
    }
    cur.isEnd = true
  }

  search(word) {
    let cur = this.root
    for (const ch of word) {
      if (!cur.children[ch]) return false
      cur = cur.children[ch]
    }
    return cur.isEnd
  }

  startsWith(prefix) {
    let cur = this.root
    for (const ch of prefix) {
      if (!cur.children[ch]) return false
      cur = cur.children[ch]
    }
    return true
  }
}