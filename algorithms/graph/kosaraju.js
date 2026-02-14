// PATTERN NAME: Kosaraju's Algorithm for Strongly Connected Components

// WHEN TO USE:
// - When you need to find strongly connected components in a directed graph
// - When analyzing graph structure in social networks, web page linking, or dependency graphs
// - When solving problems related to graph condensation or topological sorting of SCCs
// - When identifying cycles in a directed graph (SCCs can represent cycles)

// CORE IDEA (INTUITION):
// 1. First DFS: Perform DFS on original graph to get finishing times (post-order)
// 2. Transpose: Reverse all edges in the graph
// 3. Second DFS: Perform DFS on transposed graph in decreasing order of finishing times
// Each DFS in step 3 yields one strongly connected component

// INVARIANTS:
// - Each vertex visited exactly once in first DFS
// - Each vertex visited exactly once in second DFS
// - Stack processes vertices in decreasing finishing time order
// - Transposed graph has same vertices with reversed edges

// TEMPLATE / SKELETON:

function kosaraju(adj) {
  //sort according to finishing time
  let stack = []
  let n = adj.length
  let vis = new Array(n).fill(0)

  for (let i = 0; i < n; i++) {
    if (!vis[i]) {
      dfs(i, adj, vis, stack)
    }
  }

  // transpose/reverse edges
  let adjT = Array.from({ length: n }, () => [])
  for (let i = 0; i < n; i++) {
    vis[i] = 0
    for (let nei of adj[i]) {
      adjT[nei].push(i)
    }
  }

  // dfs
  let scc = 0
  while (stack.length > 0) {
    let node = stack.pop()
    if (!vis[node]) {
      scc++
      dfs(node, adjT, vis, null)
    }
  }
  return scc
}

function dfs(i, adj, vis, stack) {
  vis[i] = 1
  for (let nei of adj[i]) {
    if (!vis[nei]) {
      dfs(nei, adj, vis, stack)
    }
  }
  if (stack) stack.push(i)
}

// EXAMPLE:
let adj = [[2, 3], [0], [1], [4], []]
console.log(kosaraju(adj)) // 3

// COMMON MISTAKES:
// - Forgetting to reverse the graph correctly
// - Not processing nodes in correct order during second DFS
// - Not marking visited nodes properly in both DFS passes

// TIME & SPACE:
// - Time complexity
// O(V + E) for both DFS passes and transposition
// - Space complexity
// O(V) for visited array and stack

// RELATED PROBLEMS:
// - Tarjan's Algorithm for Strongly Connected Components
// - Finding bridges and articulation points in a graph
// - Condensation of a directed graph into its strongly connected components