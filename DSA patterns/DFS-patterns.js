// PATTERN NAME: Depth-First Search (DFS)

// WHEN TO USE:
// - Problems involving traversal of trees or graphs
// - Backtracking problems (e.g., permutations, combinations, N-Queens)
// - Pathfinding problems
// - Topological sorting
// - Connected components in graphs
// - Examples: Number of Islands, Word Search, Course Schedule

// CORE IDEA (INTUITION):
// - Explore as far as possible along each branch before backtracking
// - Use recursion or an explicit stack to keep track of nodes to visit
// - Mark nodes as visited to avoid cycles and redundant work

// INVARIANTS:
// - Each node is visited exactly once
// - The recursion stack or explicit stack maintains the current path
// - Backtracking occurs when all neighbors of a node have been explored
// - The order of exploration can affect the outcome (pre-order, in-order, post-order)

// TEMPLATE / SKELETON:

// EXAMPLE: Number of Provinces
// There are n cities. Some of them are connected, while some are not.
// If city a is connected directly with city b, and city b is connected directly with city c,
// then city a is connected indirectly with city c.

var findCircleNum = function (isConnected) {
  const n = isConnected.length
  let visited = new Array(n).fill(false)
  let provinces = 0

  function dfs(city) {
    visited[city] = true

    // Only check upper triangle of matrix (since it's symmetric)
    for (let i = 0; i < n; i++) {
      if (isConnected[city][i] === 1 && !visited[i]) {
        dfs(i)
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfs(i) // Explore entire connected component
      provinces++ // Count this as one province
    }
  }

  return provinces
}

// COMMON MISTAKES:
// - Not marking nodes as visited, leading to infinite loops
// - Forgetting to backtrack properly in recursive calls
// - Not handling disconnected components in graphs
// - Using DFS where BFS would be more appropriate (e.g., shortest path in unweighted graphs)
// - Stack overflow due to deep recursion in large graphs

// TIME & SPACE:
// - Time Complexity: O(V + E) for graphs, where V is the number of vertices and E is the number of edges
// - Space Complexity: O(V) for the recursion stack and visited set

// RELATED PROBLEMS:
// - Word Ladder
// - Clone Graph
// - Minimum Depth of Binary Tree
// - Rotting Oranges
// - Number of Islands
// - Shortest Path in Binary Matrix
// - Course Schedule
// - Sliding Puzzle




// EXAMPLE: Course Schedule IV
// There are a total of numCourses courses you have to take, labeled from 0 to numCourses-1.
// Some courses may have prerequisites, represented as a list of prerequisite pairs.
// For example, to take course 0 you have to first take course 1, which is expressed as a pair: [1,0].
// Given the total number of courses numCourses, a list of the prerequisite pairs and a list of queries
// pairs, you should answer for each queries[i] whether the course queries[i][0] is a prerequisite of the course queries[i][1] or not.

// Top-Down DFS with Memoization - O(n^2) worst
// Intuition:
// We can use DFS to explore all prerequisites for each course.
// We memoize the results to avoid redundant calculations.

var checkIfPrerequisite = function(numCourses, prerequisites, queries) {
    let graph = Array.from({length: numCourses}, () => [])

    for(let [pre, course] of prerequisites) {
        graph[course].push(pre)
    }

    let preMap = new Map()

    function dfs(course) {
        if(preMap.has(course)) return preMap.get(course)

        let preSet = new Set()
        for(let nei of graph[course]) {
            preSet.add(nei)
            let transitive = dfs(nei)
            for(let pre of transitive) {
                preSet.add(pre)
            }
        }
        preMap.set(course, preSet)
        return preSet
    }

    for(let i = 0; i < numCourses; i++) {
        dfs(i)
    }

    let res = []

    for(let [pre, course] of queries) {
        if(preMap.has(course) && preMap.get(course).has(pre)) {
            res.push(true)
        }else {
            res.push(false)
        }
    }
    return res
};



// Another Example: M-Coloring Problem
// Given an undirected graph and an integer M, determine if the graph can be colored with at most M colors
// such that no two adjacent vertices of the graph are colored with the same color.

// Intuition:
// We can use DFS with backtracking to try assigning colors to each vertex.
// If we reach a point where no color can be assigned to a vertex, we backtrack and try a different color for the previous vertex.

// Explanation:
// We build an adjacency list for the graph.
// We maintain an array to store the color assigned to each vertex.
// For each vertex, we try to assign each of the M colors and check if it's safe (i.e., no adjacent vertex has the same color).
// If it's safe, we recursively attempt to color the next vertex.
// If we successfully color all vertices, we return true. If we exhaust all options, we return false.

function graphColoring(v, edges, m) {
    // Build adjacency list
    const graph = Array.from({ length: v }, () => [])

    for (const [u, w] of edges) {
        graph[u].push(w)
        graph[w].push(u)
    }

    const colors = Array(v).fill(-1)

    function isSafe(node, col) {
        for (const nei of graph[node]) {
            if (colors[nei] === col) return false
        }
        return true
    }

    function backtrack(node) {
        // All vertices colored
        if (node === v) return true

        // Try all colors for current vertex
        for (let col = 0; col < m; col++) {
            if (isSafe(node, col)) {
                colors[node] = col
                if (backtrack(node + 1)) return true
                colors[node] = -1
            }
        }
        return false
    }

    return backtrack(0)
}