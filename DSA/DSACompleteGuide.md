# Complete DSA Pattern Guide

## 📑 Table of Contents

1. [Array](#1-array) — Two Pointers, Sliding Window, Prefix/Suffix, Kadane's, Exactly K Trick
2. [Dynamic Programming](#2-dynamic-programming) — 1D, 2D, Knapsack, Partition, String DP, LIS, Bitmask DP, Rerooting DP
3. [Hash Table](#3-hash-table) — O(1) Lookup, Frequency, Complement Search
4. [Segment Tree](#35-segment-tree-advanced-data-structure-) — Range Queries with Updates
5. [DFS](#4-dfs---depth-first-search) — Recursive, Iterative, Tree Traversals, Matrix, Cycle Detection, Topological Sort
6. [BFS](#5-bfs---breadth-first-search) — Level Order, Shortest Path, Multi-Source BFS
7. [Graph](#6-graph) — Dijkstra, Bellman-Ford, Floyd-Warshall, Topological Sort, Union-Find, MST, SCC
8. [String](#7-string) — KMP, Rabin-Karp, Suffix Trie, Manacher's
9. [Tree](#8-tree) — DFS Traversals, BFS Level Order
10. [Binary Search](#9-binary-search) — Standard, On Answer, Rotated Array
11. [Sorting](#10-sorting) — QuickSort, MergeSort, QuickSelect
12. [Stack](#11-stack) — Monotonic Stack, Monotonic Deque
13. [Greedy](#12-greedy) — Intervals, Jump Game
14. [Linked List](#13-linked-list) — Reverse, Cycle Detection, Merge
15. [Backtracking](#14-backtracking) — Permutations, Combinations, N-Queens
16. [Math](#15-math) — GCD, Fast Exponentiation
17. [Heap / Priority Queue](#16-heap--priority-queue) — Top K, Running Median
18. [Design](#17-design) — LRU Cache, Trie
19. [Bit Manipulation](#18-bit-manipulation) — XOR Tricks, Subset Generation

📁 See also: [DSAQuickLookup.md](DSAQuickLookup.md) for keyword → pattern mapping

---

## 🎯 CORE PATTERNS

### 1. Array

- Sort: O(n log n)

1. **Two Pointers (same/opposite direction)**
   - Fast/slow for cycle detection
   - Left/right for two sum, palindrome
   
2. **Sliding Window**
   - Fixed size: Sum/average of k elements
   - Variable: Longest substring with constraint 🔖
   
3. **Prefix/Suffix Arrays**
   - Range sum queries: O(1) after O(n) preprocessing
   - Product except self: prefix × suffix
   
4. **In-place Manipulation**
   - Use array itself to mark visited (negative, modulo)
   - Swap elements instead of creating new array
   
5. **Kadane's Algorithm**
   - Maximum subarray sum
   - Track: maxEndingHere, maxSoFar

**Sample Problems:** Two Sum, 3Sum, Container With Most Water, Product of Array Except Self, Maximum Subarray

Exactly K trick:
```javascript
// Problem: Count subarrays with EXACTLY k distinct elements
// Trick: exactly(k) = atMost(k) - atMost(k-1)
// Note: This approach only works if all nums[i] >= 0 (non-negative integers).
function exactlyK(nums, k) {
  return atMostK(nums, k) - atMostK(nums, k - 1);
}

function atMostK(nums, k) {
  const freqMap = new Map();
  let left = 0, count = 0;
  
  for (let right = 0; right < nums.length; right++) {
    freqMap.set(nums[right], (freqMap.get(nums[right]) || 0) + 1);
    
    while (freqMap.size > k) {
      freqMap.set(nums[left], freqMap.get(nums[left]) - 1);
      if (freqMap.get(nums[left]) === 0) freqMap.delete(nums[left]);
      left++;
    }
    
    count += right - left + 1; // All subarrays ending at right
  }
  
  return count;
}
```

**Sample Problems:** Subarrays with K Distinct, Longest Substring with At Most K Distinct, Minimum Size Subarray Sum, Longest Repeating Character Replacement

---

### 2. Dynamic Programming

**What it is:** Breaking problems into overlapping subproblems, caching results

**Mental Model:** "If I solve this for smaller inputs, can I combine those solutions?"

**DP Decision Framework:**
1. **Can I break it into subproblems?** (Optimal substructure)
2. **Do subproblems overlap?** (Need memoization)
3. **What changes between states?** (Define DP state)
4. **How do I combine subproblem results?** (Recurrence relation)
5. **What are base cases?** (Trivial solutions)

**DP Categories:**

**A. 1D DP (Linear)**
```javascript
// Pattern: dp[i] = answer for first i elements
// Examples: Climbing Stairs, House Robber, Decode Ways

// Template
const dp = new Array(n + 1).fill(0);
dp[0] = baseCase;
for (let i = 1; i <= n; i++) {
  dp[i] = recurrence(dp[i-1], dp[i-2], ...);
}
```

**B. 2D DP (Grid/Two Sequences)**
```javascript
// Pattern: dp[i][j] = answer for first i of A, first j of B
// Examples: LCS, Edit Distance, Unique Paths

// Template
const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
for (let i = 0; i <= m; i++) {
  for (let j = 0; j <= n; j++) {
    if (i === 0 || j === 0) dp[i][j] = baseCase;
    else dp[i][j] = recurrence(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  }
}
```

**C. Knapsack Variations**
- **0/1 Knapsack:** Each item once
- **Unbounded:** Items unlimited
- **Subset Sum:** Can we make target?
- **Partition:** Divide into equal sum subsets

```javascript
// 0/1 Knapsack Template
const dp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));
for (let i = 1; i <= n; i++) {
  for (let w = 0; w <= W; w++) {
    if (weight[i-1] <= w) {
      dp[i][w] = Math.max(
        dp[i-1][w],                           // Don't take
        dp[i-1][w - weight[i-1]] + value[i-1] // Take
      );
    } else {
      dp[i][w] = dp[i-1][w];
    }
  }
}
```

**D. Partition DP (Interval)**
```javascript
// Pattern: Try all split points
// Examples: MCM, Burst Balloons, Palindrome Partitioning

for (let len = 2; len <= n; len++) {
  for (let i = 0; i + len <= n; i++) {
    let j = i + len - 1;
    dp[i][j] = Infinity;
    for (let k = i; k < j; k++) {
      dp[i][j] = Math.min(
        dp[i][j],
        dp[i][k] + dp[k+1][j] + cost(i, k, j)
      );
    }
  }
}
```

**E. String DP**
- Longest Common Subsequence (LCS)
- Edit Distance (Levenshtein)
- Longest Palindromic Subsequence
- Wildcard/Regex Matching

**E.5. [Longest Increasing Subsequence (LIS)](algorithms/array/LIS.js)** ⭐

**Approaches:**
1. **DP:** O(n²) time, O(n) space
2. **DP + Binary Search:** O(n log n) time, O(n) space ⭐

**Optimized Binary Search Solution:**
```javascript
var lengthOfLIS = function(nums) {
    // tails[i] = smallest possible tail for increasing subsequence of length i+1
    // e.g. tails = [2, 5, 7] means:
    //   length-1 subsequence ends with 2
    //   length-2 subsequence ends with 5
    //   length-3 subsequence ends with 7
    let tails = []

    for(let num of nums) {
        // binary search: find first tail >= num
        // i.e. find where num "fits" in tails
        let lo = 0, hi = tails.length
        while(lo < hi) {
            let mid = Math.floor((lo + hi) / 2)
            if(tails[mid] < num) lo = mid + 1
            else hi = mid
        }

        // lo === tails.length → num is larger than all tails → extends LIS
        // lo < tails.length  → replace tails[lo] with num (smaller tail = better for future)
        tails[lo] = num
    }

    // length of tails = length of LIS
    return tails.length
};
```

**Key Insight:** 
- `tails` array maintains smallest ending value for each subsequence length
- Binary search finds where current element fits
- If element is largest seen, it extends LIS (append)
- Otherwise, replace a larger tail to keep better options for future elements

**DP Approach (for reference):**
```javascript
// O(n²) solution
const dp = new Array(nums.length).fill(1);
for (let i = 1; i < nums.length; i++) {
  for (let j = 0; j < i; j++) {
    if (nums[j] < nums[i]) {
      dp[i] = Math.max(dp[i], dp[j] + 1);
    }
  }
}
return Math.max(...dp);
```

**Variations:**
- Longest Decreasing Subsequence (reverse logic)
- Number of LIS (count DP)
- Print actual LIS (backtrack with parent pointers)

**F. DP on Trees**
- Maximum path sum
- Diameter of tree
- House Robber III

**G. Bitmask DP (State Compression)** ⭐
- Traveling Salesman Problem (TSP)
- Subset DP with constraints
- Visiting subsets of items

```javascript
// Pattern: dp[mask][i] = result when visiting subset 'mask' ending at node i
// TSP Example: Minimum cost to visit all cities starting from city 0
const dp = Array(1 << n).fill().map(() => Array(n).fill(Infinity));
dp[1][0] = 0; // Start from city 0

for (let mask = 1; mask < (1 << n); mask++) {
  for (let u = 0; u < n; u++) {
    if (!(mask & (1 << u))) continue; // u not in mask
    if (dp[mask][u] === Infinity) continue;
    
    for (let v = 0; v < n; v++) {
      if (mask & (1 << v)) continue; // v already visited
      const newMask = mask | (1 << v);
      dp[newMask][v] = Math.min(dp[newMask][v], dp[mask][u] + dist[u][v]);
    }
  }
}
```



**Rerooting DP (Tree DP Advanced)**
- Efficiently computes DP values for all possible roots (e.g., subtree sums, distances).
- Two DFS passes:
  1. Bottom-up: Compute DP for each subtree.
  2. Top-down: Reroot and update answers for all nodes.

```javascript
// Example: Minimum Edge Reversals to Make All Paths Lead to Node 0
var minEdgeReversals = function(n, edges) {
    /**
     * Rerooting DP Pattern
     * 1. DFS from root (node 0) to calculate base answer
     * 2. Reroot DFS to propagate answers to all nodes
     * 
     * Key: When moving root parent→child:
     *   Forward edge (cost=0) → becomes backward (+1)
     *   Backward edge (cost=1) → becomes forward (-1)
     */
    
    // Build graph: [neighbor, cost]
    // cost=0: original direction, cost=1: reversed direction
    const graph = Array.from({ length: n }, () => [])
    
    for(const [u, v] of edges) {
        graph[u].push([v, 0])  // u→v forward
        graph[v].push([u, 1])  // v→u backward
    }
    
    const dp = new Array(n).fill(0)
    
    // DFS1: Calculate reversals when node 0 is root
    function calculateRoot(node, parent) {
        let reversals = 0
        for(const [nei, cost] of graph[node]) {
            if(nei === parent) continue
            reversals += cost + calculateRoot(nei, node)
        }
        return reversals
    }
    
    // DFS2: Reroot to compute for all nodes
    function reroot(node, parent) {
        for(const [nei, cost] of graph[node]) {
            if(nei === parent) continue
            
            // Adjust for edge direction flip
            dp[nei] = dp[node] + (cost === 0 ? 1 : -1)
            reroot(nei, node)
        }
    }
    
    dp[0] = calculateRoot(0, -1)
    reroot(0, -1)
    return dp
}
```
- **Applications:** Subtree queries, sum of distances, etc.  **Time:** O(n)



**Common Mistakes:**
- Wrong iteration order (compute dependencies first!)
- Not handling base cases
- Forgetting to consider "don't take" option
- Space complexity when it can be optimized

---

### 3. Hash Table

**What it is:** Key-value pairs with O(1) average lookup

**Mental Model:** "Trade space for time - sacrifice memory to gain speed"

**When to Use:**
- Need fast lookup/existence check
- Count frequency
- Detect duplicates
- Group by property
- Complement search (Two Sum pattern)

**Hash Table vs Array:**
- Use array when keys are 0 to n (frequency of characters, numbers in range)
- Use hash table when keys are arbitrary or large range

**Sample Problems:** Two Sum, Subarray Sum Equals K, Group Anagrams, Longest Substring Without Repeating Characters

---

### 3.5. Segment Tree (Advanced Data Structure) ⭐

**What it is:** Binary tree built on array segments for fast range queries and updates

**When to Use:**
- Range min/max/sum queries with updates
- Point and range update queries
- Need O(log n) per operation

```javascript
// Segment Tree - O(n) build, O(log n) query/update (Sum example)
class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.build(arr, 0, 0, this.n - 1);
  }
  
  build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      this.build(arr, 2 * node + 1, start, mid);
      this.build(arr, 2 * node + 2, mid + 1, end);
      this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
    }
  }
  
  query(node, start, end, l, r) {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return this.tree[node];
    
    const mid = Math.floor((start + end) / 2);
    return this.query(2 * node + 1, start, mid, l, r) +
           this.query(2 * node + 2, mid + 1, end, l, r);
  }
  
  rangeQuery(l, r) { return this.query(0, 0, this.n - 1, l, r); }
}

const seg = new SegmentTree([1, 2, 3, 4, 5]);
console.log(seg.rangeQuery(1, 3)); // Sum of elements 1-3 = 9
```

**Time:** Build O(n), Query O(log n), Update O(log n)  
**Space:** O(n)  
**Alternatives:** Fenwick Tree (simpler), Sparse Table (O(1) queries, no updates)

---

### 4. DFS - Depth First Search

**What it is:** Explore as far as possible before backtracking

**Mental Model:** "Go deep first, use stack or recursion"

**When to Use:**
- Tree/graph traversal
- Path finding (all paths)
- Cycle detection
- Topological sort
- Backtracking
- Connected components

**DFS Implementations:**

**A. Recursive (Most Common)**
```javascript
function dfs(node, visited, graph) {
  if (visited.has(node)) return;
  visited.add(node);
  
  // Process node (preorder)
  
  for (let neighbor of graph[node]) {
    dfs(neighbor, visited, graph);
  }
  
  // Process node (postorder)
}
```

**B. Iterative with Stack**
```javascript
function dfs(start, graph) {
  const stack = [start];
  const visited = new Set([start]);
  
  while (stack.length) {
    const node = stack.pop();
    
    // Process node
    
    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
  }
}
```

**C. DFS for Trees (Inorder, Preorder, Postorder)**
```javascript
// Inorder (Left, Root, Right) - gives sorted for BST
function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}

// Preorder (Root, Left, Right)
function preorder(root, result = []) {
  if (!root) return result;
  result.push(root.val);
  preorder(root.left, result);
  preorder(root.right, result);
  return result;
}

// Postorder (Left, Right, Root)
function postorder(root, result = []) {
  if (!root) return result;
  postorder(root.left, result);
  postorder(root.right, result);
  result.push(root.val);
  return result;
}
```

**D. DFS for Matrix (4-directional)**
```javascript
function dfs(grid, row, col, visited) {
  if (row < 0 || row >= m || col < 0 || col >= n) return;
  if (visited[row][col] || grid[row][col] === 0) return;
  
  visited[row][col] = true;
  
  // 4 directions
  dfs(grid, row + 1, col, visited); // down
  dfs(grid, row - 1, col, visited); // up
  dfs(grid, row, col + 1, visited); // right
  dfs(grid, row, col - 1, visited); // left
}
```

**E. Cycle Detection (Directed Graph)** ⭐
```javascript
// Use 3 colors: white (unvisited), gray (in progress), black (done)
function hasCycle(graph, n) {
  const color = new Array(n).fill(0); // 0=white, 1=gray, 2=black
  
  function dfs(node) {
    color[node] = 1; // Mark as in-progress
    
    for (let neighbor of graph[node]) {
      if (color[neighbor] === 1) return true; // Back edge = cycle
      if (color[neighbor] === 0 && dfs(neighbor)) return true;
    }
    
    color[node] = 2; // Mark as done
    return false;
  }
  
  for (let i = 0; i < n; i++) {
    if (color[i] === 0 && dfs(i)) return true;
  }
  return false;
}
```

**F. Topological Sort (DFS-based)** ⭐
```javascript
function topologicalSort(graph, n) {
  const visited = new Array(n).fill(false);
  const stack = [];
  
  function dfs(node) {
    visited[node] = true;
    for (let neighbor of graph[node]) {
      if (!visited[neighbor]) {
        dfs(neighbor);
      }
    }
    stack.push(node); // Postorder
  }
  
  for (let i = 0; i < n; i++) {
    if (!visited[i]) dfs(i);
  }
  
  return stack.reverse();
}
```

**Time Complexity:** O(V + E) for graphs, O(n) for trees  
**Space Complexity:** O(h) for recursion stack where h = height

**Sample Problems:** Word Search, Binary Tree Inorder Traversal, Validate BST, Number of Islands

---

### 5. BFS - Breadth First Search

**What it is:** Explore level by level using queue

**Mental Model:** "Process all neighbors first before going deeper"

**When to Use:**
- Shortest path (unweighted graph)
- Level order traversal
- Minimum steps/distance
- Nearest neighbor
- Check if reachable

**BFS Template:**
```javascript
function bfs(start, graph) {
  const queue = [start];
  const visited = new Set([start]);
  let level = 0;
  
  while (queue.length) {
    const size = queue.length;
    
    // Process all nodes at current level
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      
      // Process node
      if (isTarget(node)) return level;
      
      for (let neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    
    level++;
  }
  
  return -1; // Not found
}
```

**BFS for Trees (Level Order):**
```javascript
function levelOrder(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
}
```

**BFS for Matrix (Shortest Path):**
```javascript
function shortestPath(grid) {
  const m = grid.length, n = grid[0].length;
  const queue = [[0, 0, 0]]; // [row, col, distance]
  const visited = Array(m).fill().map(() => Array(n).fill(false));
  visited[0][0] = true;
  
  const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
  
  while (queue.length) {
    const [row, col, dist] = queue.shift();
    
    if (row === m-1 && col === n-1) return dist;
    
    for (let [dr, dc] of dirs) {
      const nr = row + dr, nc = col + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && 
          !visited[nr][nc] && grid[nr][nc] === 1) {
        visited[nr][nc] = true;
        queue.push([nr, nc, dist + 1]);
      }
    }
  }
  
  return -1;
}
```

**Multi-Source BFS:**
```javascript
// Start from multiple sources simultaneously
// Example: Rotting Oranges
function bfsMultiSource(grid) {
  const queue = [];
  
  // Add all sources to queue
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (isSource(i, j)) {
        queue.push([i, j, 0]);
      }
    }
  }
  
  // Regular BFS
  while (queue.length) {
    const [row, col, time] = queue.shift();
    // Process neighbors
  }
}
```

**BFS vs DFS:**
- **BFS:** Shortest path, level order, minimum steps
- **DFS:** All paths, backtracking, topological sort, memory efficient

**Sample Problems:** Binary Tree Level Order, Course Schedule, Rotting Oranges, Word Ladder

---

### 6. Graph

**What it is:** Nodes (vertices) connected by edges

**Mental Model:** "Network of relationships"

**Graph Representations:**

**A. Adjacency List (Most Common)**
```javascript
// For directed graph
const graph = new Map();
graph.set(node, [nei1, nei2]);

// For undirected, add both directions
function addEdge(u, v) {
  if (!graph.has(u)) graph.set(u, []);
  if (!graph.has(v)) graph.set(v, []);
  graph.get(u).push(v);
  graph.get(v).push(u);
}
```

**B. Adjacency Matrix**
```javascript
// For weighted graph
const graph = Array(n).fill().map(() => Array(n).fill(Infinity));
for (let i = 0; i < n; i++) graph[i][i] = 0;

// Add edge
graph[u][v] = weight;
```

**C. Edge List**
```javascript
// For MST, Union-Find 🏷️
const edges = [[u1, v1, w1], [u2, v2, w2], ...];
```

**Core Graph Algorithms:**

**1. [Dijkstra's Algorithm](/algorithms/graph/dijkstra.js) (Shortest Path, Non-negative Weights)** ⭐
```javascript
function dijkstra(graph, start, n) {
  const dist = new Array(n).fill(Infinity);
  dist[start] = 0;
  
  // Min heap: [distance, node]
  const pq = new MinPriorityQueue(([dist, node]) => dist)
  const pq.enqueue([0, start]);
  
  while (pq.length) {
    const [d, u] = pq.dequeue();
    
    if (d > dist[u]) continue; // Already processed
    
    for (let [v, weight] of graph[u]) {
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        pq.push([dist[v], v]);
      }
    }
  }
  
  return dist;
}
```

**2. [Bellman-Ford](/algorithms/graph/bellman-ford.js) (Handles Negative Weights)** ⭐
```javascript
function bellmanFord(edges, n, start) {
  const dist = new Array(n).fill(Infinity);
  dist[start] = 0;
  
  // Relax all edges n-1 times
  for (let i = 0; i < n - 1; i++) {
    for (let [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }
  
  // Check for negative cycles
  for (let [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
      return null; // Negative cycle exists
    }
  }
  
  return dist;
}
```

**3. [Floyd-Warshall](/algorithms/graph/floydWarshall.js) (All-Pairs Shortest Path)** ⭐
```javascript
function floydWarshall(graph, n) {
  const dist = Array(n).fill().map(() => Array(n).fill(Infinity));
  
  // Initialize
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (let [u, v, w] of edges) {
    dist[u][v] = w;
  }
  
  // Dynamic programming: try all intermediate nodes
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
      }
    }
  }
  
  return dist;
}
```

**4. [Topological Sort](/algorithms/graph/topologicalSort.js) (DAG)** ⭐

Two methods:
1. DFS-based (postorder)
2. BFS-based (Kahn's algorithm with indegrees)

```javascript
// Kahn's Algorithm (BFS-based)
function topologicalSort(graph, n) {
  const indegree = new Array(n).fill(0);
  
  // Calculate indegrees
  for (let u = 0; u < n; u++) {
    for (let v of graph[u]) {
      indegree[v]++;
    }
  }
  
  // Queue with 0 indegree
  const queue = [];
  for (let i = 0; i < n; i++) {
    if (indegree[i] === 0) queue.push(i);
  }
  
  const result = [];
  while (queue.length) {
    const u = queue.shift();
    result.push(u);
    
    for (let v of graph[u]) {
      indegree[v]--;
      if (indegree[v] === 0) {
        queue.push(v);
      }
    }
  }
  
  return result.length === n ? result : []; // Empty if cycle
}
```

**5. Detect Cycle (Undirected Graph)**
```javascript
function hasCycleUndirected(graph, n) {
  const visited = new Array(n).fill(false);
  
  function dfs(node, parent) {
    visited[node] = true;
    
    for (let neighbor of graph[node]) {
      if (!visited[neighbor]) {
        if (dfs(neighbor, node)) return true;
      } else if (neighbor !== parent) {
        return true; // Visited neighbor that's not parent = cycle
      }
    }
    
    return false;
  }
  
  for (let i = 0; i < n; i++) {
    if (!visited[i] && dfs(i, -1)) {
      return true;
    }
  }
  
  return false;
}
```

**6. [Union-Find](/algorithms/graph/unionFind.js) (Disjoint Set)** ⭐

- **Time Complexity:** O(α(n)) ≈ O(1) with path compression + union by rank

**7. [Bipartite Check](/algorithms/graph/biPartite.js) (Check if Graph is Bipartite)** ⭐

**8. [Kruskal's Algorithm](/algorithms/graph/kruskals.js) (Minimum Spanning Tree)** ⭐

**9. [Prim's Algorithm](/algorithms/graph/prims.js) (Minimum Spanning Tree)** ⭐

**10. [Kosaraju's Algorithm](/algorithms/graph/kosaraju.js) (Strongly Connected Components)** ⭐

**11. [Tarjan's Algorithm](/algorithms/graph/tarjan.js) (Strongly Connected Components)** ⭐

**When to Use Which Algorithm:** ⭐
- **Shortest Path (unweighted):** BFS
- **Shortest Path (positive weights):** Dijkstra's
- **Shortest Path (any weights):** Bellman-Ford
- **All-pairs shortest path:** Floyd-Warshall
- **Cycle detection:** DFS or Union-Find
- **Topological ordering:** DFS or Kahn's algorithm
- **Strongly connected components:** Kosaraju's or Tarjan's

---

### 7. String

**Common Patterns:**

**A. [KMP](/algorithms/string/KMP.js) (Pattern Matching)**

**When to use:**
- Search for a pattern in a string efficiently
- Avoid re-checking characters after a mismatch
- Find all occurrences of a pattern

**B. [Rabin karp](/algorithms/string/Rabin-karp.js.js) (Rolling Hash)**

**When to use:**
- Search for a pattern in a string using hashing
- Find all occurrences of a pattern
- Handle multiple pattern searches efficiently

**String Tricks:**
- Use ASCII for fast frequency: `freq[char.charCodeAt(0) - 'a'.charCodeAt(0)]++`
- KMP for pattern matching (O(n + m))
- Rolling hash for substring comparison (O(n + m) average)

**C. [Suffix Trie](/patterns/suffix-trie.js) (Counting Distinct Substrings)**

**When to use:**
- Count distinct substrings in a string
- Store and query all suffixes efficiently
- String processing with substring/pattern queries

**Approaches:**
```javascript
// 1. Brute Force: O(n³) time, O(n²) space
// - Generate all substrings, use Set for uniqueness

// 2. Suffix Trie: O(n²) time, O(n²) space
// - Insert all suffixes into trie
// - Each new node = new distinct substring
// - Count = number of nodes created

// 3. Suffix Array + LCP: O(n log n) time, O(n) space ⭐
// - Build suffix array (sorted suffixes)
// - Calculate longest common prefix between adjacent suffixes
// - distinct_count = Σ(suffix_length - lcp_with_previous)
```

**Key Insight:** Each node in a suffix trie represents a unique substring. By sorting suffixes and using LCP, we eliminate duplicates efficiently.

**Sample Problems:** Count Distinct Substrings, Find Longest Repeated Substring, Suffix Array Construction

**Time Complexity:**
- Naive: O(n * m)
- KMP: O(n + m)
- Rabin-Karp: O(n + m) average
- Suffix Trie: O(n²)
- Suffix Array + LCP: O(n log n)

**Sample Problems:** Longest Substring Without Repeating Characters, Group Anagrams, Valid Palindrome II

**D. Manacher's Algorithm (Longest Palindromic Substring)** ⭐

**When to use:**
- Find longest palindrome in O(n) time
- More elegant than center expansion approach

```javascript
// Transform "abc" → "#a#b#c#" to handle both odd/even palindromes
const transformed = '#' + s.split('').join('#') + '#';
const p = new Array(transformed.length).fill(0); // radius at each position
let center = 0, right = 0;

for (let i = 1; i < transformed.length - 1; i++) {
  const mirror = 2 * center - i;
  if (i < right) p[i] = Math.min(right - i, p[mirror]);
  
  while (i + p[i] + 1 < transformed.length &&
         transformed[i + p[i] + 1] === transformed[i - p[i] - 1]) {
    p[i]++;
  }
  
  if (i + p[i] > right) {
    center = i;
    right = i + p[i];
  }
}
// Extract result: start = (maxCenterIndex - maxLen) / 2, length = maxLen
```

**Time:** O(n), **Space:** O(n). Far superior to O(n²) center expansion.

---

### 8. Tree

**What it is:** Hierarchical data structure with nodes connected by edges (no cycles)

**Mental Model:** "Recursive by nature - solve for subtrees, combine at root"

**Tree Traversals:**

**A. DFS Traversals**
```javascript
// Recursive
function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}

// Iterative Inorder
function inorderIterative(root) {
  const result = [];
  const stack = [];
  let curr = root;
  
  while (curr || stack.length) {
    while (curr) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop();
    result.push(curr.val);
    curr = curr.right;
  }
  
  return result;
}
```

**B. BFS (Level Order)**
```javascript
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  
  while (queue.length) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
}
```
---

### 9. Binary Search

**What it is:** Eliminate half the search space each iteration

**Mental Model:** "Keep halving until you find the answer"

**When to Use:**
- Sorted array
- Find first/last occurrence
- Search in rotated array
- Minimize maximum / maximize minimum (binary search on answer)

**Templates:**

**A. Standard Binary Search**
```javascript
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}
```

**B. Binary Search on Answer**
```javascript
// Example: Aggressive Cows, Minimum Days to Make Bouquets
function binarySearchOnAnswer(arr, k) {
  let left = 0, right = Math.max(...arr);
  let result = -1;
  
  function isFeasible(mid) {
    // Check if answer 'mid' is possible
    // Return true/false
  }
  
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    
    if (isFeasible(mid)) {
      result = mid;
      right = mid - 1; // Try to minimize
    } else {
      left = mid + 1;
    }
  }
  
  return result;
}
```

**C. Search in Rotated Array**
```javascript
function search(nums, target) {
  let left = 0, right = nums.length - 1;
  
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    
    if (nums[mid] === target) return mid;
    
    // Check which half is sorted
    if (nums[left] <= nums[mid]) {
      // Left half is sorted
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  
  return -1;
}
```

**Common Mistakes:**
- Integer overflow: Use `left + (right - left) / 2`
- Wrong loop condition: `left <= right` vs `left < right`
- Wrong pointer update: `mid - 1` vs `mid` vs `mid + 1`

---

### 10. Sorting

**Key Sorting Algorithms:**

**A. [QuickSort](/algorithms/sorting/quickSort.js)**
```javascript
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
```

[quickSelect](/algorithms/sorting/quickSelect.js) (Find k-th smallest) ⭐

**B. [MergeSort](/algorithms/sorting/mergeSort.js)**
```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}
```

**When to Sort:**
- Two Sum → Sort first, use two pointers
- Intervals → Sort by start time, then merge
- Anagrams → Sort characters to group
- Find duplicates → Sort, then linear scan

---

### 11. Stack

**When to Use:**
- Matching parentheses/brackets
- Evaluate expressions
- Undo operations
- Function call simulation

Monotonic Stack:
**When to Use:**
- Next greater/smaller element
- Stock span
- Largest rectangle in histogram

**Example: Next Greater Element**
```javascript
function nextGreaterElement(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = [];
  
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  
  return result;
}
```

**Monotonic Deque Extension** ⭐

**When to Use:**
- Sliding window min/max queries
- Stock price span problems
- Building heights & visibility

```javascript
// Sliding Window Maximum - O(n) using Monotonic Deque
function maxSlidingWindow(nums, k) {
  const deque = []; // Decreasing order of values
  const result = [];
  
  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside window
    while (deque.length && deque[0] < i - k + 1) deque.shift();
    
    // Remove smaller elements (maintain decreasing)
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();
    
    deque.push(i);
    
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  
  return result; // [1,3,-1,-3,5,3,6,7], k=3 → [3,3,5,5,6,7]
}
```

**Key:** Each element added/removed once. Time O(n), Space O(k). Better than using heap!

---

### 12. Greedy

**What it is:** Make locally optimal choice at each step

**When to Use:**
- Interval scheduling
- Activity selection
- Huffman coding
- Dijkstra's algorithm

**Key:** Must prove greedy choice property and optimal substructure

**Common Patterns:**
- **Intervals:** Sort by end time, select non-overlapping
- **Array:** Process in order, maintain running state
- **Min/Max:** Sort, pick greedily

**Example: Jump Game**
```javascript
function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}
```

---

### 13. Linked List

**Common Operations:**

**A. Reverse**
```javascript
function reverseList(head) {
  let prev = null, curr = head;
  
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  
  return prev;
}
```

**B. Fast/Slow (Cycle Detection)**
```javascript
function hasCycle(head) {
  let slow = head, fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  
  return false;
}
```

**C. Merge Two Sorted Lists**
```javascript
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let curr = dummy;
  
  while (l1 && l2) {
    if (l1.val < l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }
  
  curr.next = l1 || l2;
  return dummy.next;
}
```

---

### 14. Backtracking

**What it is:** Explore all possibilities by making choices and undoing them

**Framework:**
```javascript
function backtrack(state, choices, result) {
  if (isComplete(state)) {
    result.push([...state]);
    return;
  }
  
  for (let choice of choices) {
    // Make choice
    state.push(choice);
    
    // Explore
    backtrack(state, getNextChoices(choice), result);
    
    // Undo choice
    state.pop();
  }
}
```

**Common Problems:**
- Permutations
- Combinations
- Subsets
- N-Queens
- Sudoku Solver

**Optimization:**
- Prune early (check validity before recursing)
- Sort input (enables early termination)
- Use visited set

---

### 15. Math

**Common Patterns:**
- GCD/LCM: Euclidean algorithm
- Prime factorization: Trial division
- Modular arithmetic: (a + b) % m = ((a % m) + (b % m)) % m
- Power: Fast exponentiation O(log n)

**Fast Exponentiation:**
```javascript
function pow(x, n) {
  if (n === 0) return 1;
  if (n < 0) return 1 / pow(x, -n);
  
  if (n % 2 === 0) {
    const half = pow(x, n / 2);
    return half * half;
  } else {
    return x * pow(x, n - 1);
  }
}
```

---

### 16. [Heap](/data-structures/heap/minHeap.js) / [Priority Queue](/data-structures/heap/priorityQueue.js)

**What it is:** Complete binary tree with heap property (min-heap or max-heap)

**When to Use:**
- Top K elements
- Kth largest/smallest
- Merge K sorted lists
- Running median
- Dijkstra's algorithm

**JavaScript Implementation (Min Heap):**
```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }
  
  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return min;
  }
  
  peek() {
    return this.heap[0];
  }
  
  size() {
    return this.heap.length;
  }
  
  bubbleUp(idx) {
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (this.heap[idx] >= this.heap[parentIdx]) break;
      [this.heap[idx], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[idx]];
      idx = parentIdx;
    }
  }
  
  bubbleDown(idx) {
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      
      if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }
      if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }
      
      if (smallest === idx) break;
      [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
      idx = smallest;
    }
  }
}
```

---

### 17. Design

**Common Design Problems:**
- LRU Cache: Hash Map + Doubly Linked List
- LFU Cache: Hash Map + Min Heap + Doubly Linked List
- Trie: Prefix tree for strings
- Design Twitter: Hash Map + Heap
- Circular Queue: Array with head/tail pointers

---

### 18. Bit Manipulation

**Common Operations:**
```javascript
// Check if ith bit is set
(num & (1 << i)) !== 0

// Set ith bit
num | (1 << i)

// Clear ith bit
num & ~(1 << i)

// Toggle ith bit
num ^ (1 << i)

// Clear lowest set bit
num & (num - 1)

// Get lowest set bit
num & -num

// Count set bits
function countBits(n) {
  let count = 0;
  while (n) {
    count++;
    n &= (n - 1); // Clear lowest set bit
  }
  return count;
}
```

**XOR Properties:**
- a ^ a = 0
- a ^ 0 = a
- a ^ b ^ a = b (useful for finding single number)

**Common Patterns:**
- Find single number: XOR all
- Swap without temp: a ^= b; b ^= a; a ^= b;
- Power of 2: (n & (n - 1)) === 0
- Generate subsets: Iterate 0 to 2^n - 1
