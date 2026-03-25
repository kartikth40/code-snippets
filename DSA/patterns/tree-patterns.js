// PATTERN NAME: Binary Tree Patterns

// WHEN TO USE:
// - Any problem involving binary trees (not just BSTs)
// - Depth, diameter, path sum, LCA, invert, serialize
// - Most tree problems are naturally recursive: solve for subtrees, combine at root

// CORE IDEA (INTUITION):
// - Trees are recursive: every subtree is itself a tree
// - Most solutions follow: process left, process right, combine at current node
// - Two main approaches: top-down (pass info down) vs bottom-up (return info up)
// - Bottom-up is more common and usually cleaner

// INVARIANTS:
// - Base case: null node returns a neutral value (0, -Infinity, null, true)
// - Each node is visited exactly once → O(n) time
// - Recursion depth = tree height → O(h) space, worst case O(n) for skewed

// TEMPLATE / SKELETON:

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val
    this.left = left
    this.right = right
  }
}

// === MAX DEPTH ===
function maxDepth(root) {
  if (!root) return 0
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))
}

// === INVERT BINARY TREE ===
function invertTree(root) {
  if (!root) return null
  ;[root.left, root.right] = [invertTree(root.right), invertTree(root.left)]
  return root
}

// === DIAMETER OF BINARY TREE ===
// Longest path between any two nodes (may not pass through root)
function diameterOfBinaryTree(root) {
  let diameter = 0

  function height(node) {
    if (!node) return 0
    const left = height(node.left)
    const right = height(node.right)
    diameter = Math.max(diameter, left + right) // path through this node
    return 1 + Math.max(left, right)
  }

  height(root)
  return diameter
}

// === LOWEST COMMON ANCESTOR (general binary tree) ===
// Different from BST LCA — can't use value comparison
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root

  const left = lowestCommonAncestor(root.left, p, q)
  const right = lowestCommonAncestor(root.right, p, q)

  if (left && right) return root // p and q are in different subtrees
  return left || right           // both in same subtree
}

// === PATH SUM (root to leaf) ===
function hasPathSum(root, targetSum) {
  if (!root) return false
  if (!root.left && !root.right) return root.val === targetSum

  return hasPathSum(root.left, targetSum - root.val) ||
         hasPathSum(root.right, targetSum - root.val)
}

// === MAXIMUM PATH SUM (any node to any node) ===
// Path can start and end at any node, but can't branch
function maxPathSum(root) {
  let maxSum = -Infinity

  function dfs(node) {
    if (!node) return 0

    const left = Math.max(0, dfs(node.left))   // ignore negative paths
    const right = Math.max(0, dfs(node.right))

    maxSum = Math.max(maxSum, left + right + node.val) // path through node
    return node.val + Math.max(left, right)            // return best single path
  }

  dfs(root)
  return maxSum
}

// === SAME TREE ===
function isSameTree(p, q) {
  if (!p && !q) return true
  if (!p || !q) return false
  return p.val === q.val &&
         isSameTree(p.left, q.left) &&
         isSameTree(p.right, q.right)
}

// === SUBTREE OF ANOTHER TREE ===
function isSubtree(root, subRoot) {
  if (!root) return false
  if (isSameTree(root, subRoot)) return true
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot)
}

// === SERIALIZE / DESERIALIZE (preorder with nulls) ===
function serialize(root) {
  const result = []

  function dfs(node) {
    if (!node) { result.push('null'); return }
    result.push(String(node.val))
    dfs(node.left)
    dfs(node.right)
  }

  dfs(root)
  return result.join(',')
}

function deserialize(data) {
  const vals = data.split(',')
  let i = 0

  function dfs() {
    if (vals[i] === 'null') { i++; return null }
    const node = new TreeNode(Number(vals[i]))
    i++
    node.left = dfs()
    node.right = dfs()
    return node
  }

  return dfs()
}

// === RIGHT SIDE VIEW (BFS level order, take last of each level) ===
function rightSideView(root) {
  if (!root) return []
  const result = []
  const queue = [root]

  while (queue.length) {
    const size = queue.length
    for (let i = 0; i < size; i++) {
      const node = queue.shift()
      if (i === size - 1) result.push(node.val) // rightmost at this level
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
  }

  return result
}

// COMMON MISTAKES:
// - Forgetting base case (null node)
// - Confusing top-down vs bottom-up — diameter/max path sum MUST be bottom-up
// - In max path sum: forgetting to clamp negative paths to 0
// - In LCA: not handling the case where p or q IS the root
// - In serialize: not handling null markers correctly during deserialize

// TIME & SPACE:
// - All above: O(n) time (visit every node once)
// - Space: O(h) for recursion stack, O(n) worst case for skewed tree
// - BFS (right side view): O(n) time, O(w) space where w = max width

// RELATED PROBLEMS:
// - Maximum Depth of Binary Tree (LC 104)
// - Invert Binary Tree (LC 226)
// - Diameter of Binary Tree (LC 543)
// - Lowest Common Ancestor (LC 236)
// - Binary Tree Maximum Path Sum (LC 124)
// - Path Sum (LC 112), Path Sum II (LC 113)
// - Same Tree (LC 100)
// - Subtree of Another Tree (LC 572)
// - Serialize and Deserialize (LC 297)
// - Binary Tree Right Side View (LC 199)
// - Symmetric Tree (LC 101)
// - Construct Binary Tree from Preorder and Inorder (LC 105)
// - Flatten Binary Tree to Linked List (LC 114)

// Examples
const root = new TreeNode(1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3)
)

console.log(maxDepth(root))              // 3
console.log(diameterOfBinaryTree(root))  // 3 (path: 4→2→1→3 or 5→2→1→3)
console.log(hasPathSum(root, 7))         // true (1→2→4)
console.log(rightSideView(root))         // [1, 3, 5]

const serialized = serialize(root)
console.log(serialized)                  // "1,2,4,null,null,5,null,null,3,null,null"
const deserialized = deserialize(serialized)
console.log(maxDepth(deserialized))      // 3 (same tree)
