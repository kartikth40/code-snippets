// BiPartite Graph Check using BFS

/*
  A bipartite graph is a graph whose vertices can be divided into two disjoint and independent 
  sets U and V such that every edge connects a vertex in U to one in V. In other words, 
  there are no edges between vertices within the same set.

  Alternate coloring method can also be used to check bipartiteness.
    - A graph is bipartite if and only if it contains NO odd-length cycles

  Algorithm Steps:
    1. Start coloring from an unvisited node, assign it one color (e.g., 0)
    2. Use BFS to traverse the graph:
        - Color all adjacent nodes with the alternate color (e.g., 1)
        - If an adjacent node is already colored with the same color, return false
    3. Repeat for all unvisited nodes to handle disconnected components
    4. If no conflicts found, return true

  Time Complexity: O(V + E) where V is vertices and E is edges
  Space Complexity: O(V) for the color map and queue
*/


function isBipartite(graph) {
  const nodes = Object.keys(graph)
  let colors = {}

  for(let node of nodes) {
    node = parseInt(node)
    colors[node] = -1 // -1 indicates uncolored
  }

  for(let nei of nodes) {
    nei = parseInt(nei)
    if(colors[nei] === -1 && !bfsCheck(nei)) {
      return false
    }
  }

  return true

  function bfsCheck(start) {
    const queue = [start]
    colors[start] = 0 // Start coloring with color 0

    while(queue.length > 0) {
      const current = queue.shift()

      for(let nei of graph[current]) {
        if(colors[nei] === -1) {
          colors[nei] = 1 - colors[current]
          queue.push(nei)
        }else if(colors[nei] === colors[current]) {
          return false // Conflict in coloring
        }
      }
    }
    return true
  }
}

const graph = { // Not Bipartite due to odd-length cycle
  0: [1, 2],
  1: [0, 3],
  2: [0, 4],
  3: [4, 1],
  4: [3, 2],
}

const graph2 = { // Bipartite graph
  0: [1, 2],
  1: [0, 3],
  2: [0, 4],
  3: [5, 1],
  4: [5, 2],
  5: [3, 4]
}

console.log('Graph  - BFS:', isBipartite(graph)) // false
console.log('Graph2 - BFS:', isBipartite(graph2)) // true

/*
  Questions to practice:
  - Possible Bipartition - LeetCode (https://leetcode.com/problems/possible-bipartition/)
*/


// BiPartite Graph Check using DFS
function isBipartiteDFS(graph) {
  const nodes = Object.keys(graph)
  let colors = {}

  for(let node of nodes) {
    node = parseInt(node)
    colors[node] = -1 // -1 indicates uncolored
  }

  for(let nei of nodes) {
    nei = parseInt(nei)
    if(colors[nei] === -1 && !dfsCheck(nei, 0)) {
      return false
    }
  }

  return true

  function dfsCheck(node, color) {
    colors[node] = color

    for(let nei of graph[node]) {
      if(colors[nei] === -1 && !dfsCheck(nei, 1 - color)) {
        return false
      } else if(colors[nei] === colors[node]) {
        return false
      }
    }

    return true
  }
}

console.log('Graph  - DFS:', isBipartiteDFS(graph)) // false
console.log('Graph2 - DFS:', isBipartiteDFS(graph2)) // true