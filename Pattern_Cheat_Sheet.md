# DSA Pattern Recognition Cheat Sheet

## 🎯 Problem → Pattern Quick Guide

### Keywords → Pattern Map

| **Keyword/Phrase** | **Pattern** | **Approach** |
|-------------------|-------------|--------------|
| "Two elements sum to X" | Two Pointers / Hash Map | Sort + two pointers OR hash map for complements |
| "K elements sum to X" | Two Pointers / Backtracking | Reduce to two-sum, recursively |
| "Subarray sum equals K" | Prefix Sum + Hash Map | Track cumulative sums, check if (sum - K) seen |
| "Maximum subarray sum" | Kadane's Algorithm | DP: maxEndingHere = max(num, maxEndingHere + num) |
| "Longest substring with X" | Sliding Window | Expand right, contract left when invalid |
| "All subsets/combinations" | Backtracking | Include/exclude each element recursively |
| "All permutations" | Backtracking | Swap elements, backtrack |
| "Minimum/Maximum in range" | Segment Tree / Sparse Table | Preprocess for O(log n) queries |
| "Next greater/smaller" | Monotonic Stack | Maintain decreasing/increasing stack |
| "Find in rotated array" | Binary Search | Check which half is sorted |
| "Find first/last occurrence" | Binary Search | Boundary binary search |
| "Minimize maximum" | Binary Search on Answer | Check if answer X is feasible |
| "Shortest path unweighted" | BFS | Level-order traversal |
| "Shortest path weighted" | Dijkstra's | Priority queue with distances |
| "All pairs shortest path" | Floyd-Warshall | DP: dist[i][j] via k |
| "Detect cycle in graph" | DFS / Union-Find | Color states OR find operation |
| "Topological sort" | DFS / BFS (Kahn's) | Postorder DFS OR indegree-based BFS |
| "Connected components" | DFS / BFS / Union-Find | Visit all nodes, count components |
| "Minimum spanning tree" | Kruskal's / Prim's | Sort edges OR greedy with heap |
| "Count ways to X" | DP | Define dp[state] = ways to reach state |
| "Minimum steps/cost to X" | DP / BFS | BFS for unweighted, DP for weighted |
| "Longest increasing subsequence" | DP / Binary Search | O(n²) DP or O(n log n) with binary search |
| "Edit distance" | 2D DP | dp[i][j] = min(insert, delete, replace) |
| "0/1 Knapsack" | DP | dp[i][w] = max value with i items, w capacity |
| "Unbounded knapsack" | DP | Can reuse items: iterate order matters |
| "Partition into K subsets" | DP / Backtracking | Bitmask DP or recursive partitioning |
| "Matrix chain multiplication" | Partition DP | Try all split points |
| "Palindrome partitioning" | DP + Precomputation | Precompute isPalindrome[i][j] |
| "Valid parentheses" | Stack | Push open, pop on close, check balance |
| "Evaluate expression" | Stack | Use two stacks (numbers & operators) |
| "Level order traversal" | BFS | Queue, process by levels |
| "Inorder/Preorder/Postorder" | DFS | Recursive or iterative with stack |
| "Lowest common ancestor" | DFS / Binary Lifting | Find where paths diverge |
| "Serialize tree" | DFS | Preorder with nulls |
| "BST operations" | Binary Search on Tree | Left < Root < Right property |
| "Trie for prefix" | Trie | Insert, search, prefix matching |
| "Find duplicates in array" | Hash Set / Cycle Detection | Set for O(n) space, Floyd's for O(1) |
| "Find missing number" | XOR / Math | XOR all OR sum formula |
| "Intervals: merge/intersect" | Sorting + Greedy | Sort by start, merge overlapping |
| "Meeting rooms" | Sorting + Greedy | Sort by end time, count non-overlapping |