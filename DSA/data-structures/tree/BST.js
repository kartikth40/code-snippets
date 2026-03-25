// Binary Search Tree (BST) Implementation

// A BST is a binary tree where for every node:
//   - All values in left subtree < node.val
//   - All values in right subtree > node.val

// Time Complexity (balanced):
// - Search: O(log n)
// - Insert: O(log n)
// - Delete: O(log n)
// Worst case (skewed): O(n) for all operations

// When to use:
// - Ordered data with dynamic insertions/deletions
// - Range queries, floor/ceiling lookups
// - Inorder traversal gives sorted output
// - Interview problems: validate BST, kth smallest, LCA in BST

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val
    this.left = left
    this.right = right
  }
}

class BST {
  constructor() {
    this.root = null
  }

  // Insert a value
  insert(val) {
    this.root = this.#insertNode(this.root, val)
  }

  #insertNode(node, val) {
    if (!node) return new TreeNode(val)
    if (val < node.val) node.left = this.#insertNode(node.left, val)
    else if (val > node.val) node.right = this.#insertNode(node.right, val)
    return node // duplicates ignored
  }

  // Search for a value
  search(val) {
    return this.#searchNode(this.root, val)
  }

  #searchNode(node, val) {
    if (!node) return false
    if (val === node.val) return true
    if (val < node.val) return this.#searchNode(node.left, val)
    return this.#searchNode(node.right, val)
  }

  // Delete a value
  delete(val) {
    this.root = this.#deleteNode(this.root, val)
  }

  #deleteNode(node, val) {
    if (!node) return null

    if (val < node.val) {
      node.left = this.#deleteNode(node.left, val)
    } else if (val > node.val) {
      node.right = this.#deleteNode(node.right, val)
    } else {
      // Found the node to delete
      // Case 1: leaf node
      if (!node.left && !node.right) return null
      // Case 2: one child
      if (!node.left) return node.right
      if (!node.right) return node.left
      // Case 3: two children — replace with inorder successor
      const successor = this.#findMin(node.right)
      node.val = successor.val
      node.right = this.#deleteNode(node.right, successor.val)
    }

    return node
  }

  #findMin(node) {
    while (node.left) node = node.left
    return node
  }

  // Inorder traversal (sorted output)
  inorder() {
    const result = []
    this.#inorderHelper(this.root, result)
    return result
  }

  #inorderHelper(node, result) {
    if (!node) return
    this.#inorderHelper(node.left, result)
    result.push(node.val)
    this.#inorderHelper(node.right, result)
  }
}

// === COMMON BST INTERVIEW PROBLEMS ===

// Validate BST
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true
  if (root.val <= min || root.val >= max) return false
  return isValidBST(root.left, min, root.val) &&
         isValidBST(root.right, root.val, max)
}

// Kth Smallest Element in BST (inorder traversal)
function kthSmallest(root, k) {
  let count = 0, result = null

  function inorder(node) {
    if (!node || result !== null) return
    inorder(node.left)
    count++
    if (count === k) { result = node.val; return }
    inorder(node.right)
  }

  inorder(root)
  return result
}

// Lowest Common Ancestor in BST
// Exploit BST property: if both values < node, go left; both > node, go right
function lowestCommonAncestor(root, p, q) {
  while (root) {
    if (p < root.val && q < root.val) root = root.left
    else if (p > root.val && q > root.val) root = root.right
    else return root // split point = LCA
  }
  return null
}

// Convert Sorted Array to Balanced BST
function sortedArrayToBST(nums) {
  function build(lo, hi) {
    if (lo > hi) return null
    const mid = (lo + hi) >> 1
    const node = new TreeNode(nums[mid])
    node.left = build(lo, mid - 1)
    node.right = build(mid + 1, hi)
    return node
  }
  return build(0, nums.length - 1)
}

// Examples (only run when executed directly)
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const bst = new BST()
  for (const val of [5, 3, 7, 1, 4, 6, 8]) bst.insert(val)
  console.log(bst.inorder())    // [1, 3, 4, 5, 6, 7, 8]
  console.log(bst.search(4))    // true
  console.log(bst.search(9))    // false

  bst.delete(3)
  console.log(bst.inorder())    // [1, 4, 5, 6, 7, 8]

  const balanced = sortedArrayToBST([1, 2, 3, 4, 5, 6, 7])
  console.log(isValidBST(balanced))  // true
  console.log(kthSmallest(balanced, 3))  // 3
}

export { TreeNode, BST, isValidBST, kthSmallest, lowestCommonAncestor, sortedArrayToBST }
