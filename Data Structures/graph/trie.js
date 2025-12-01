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