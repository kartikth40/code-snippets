// PATTERN NAME: Breadth-First Search (BFS)

// WHEN TO USE:
// - Problems involving shortest path in unweighted graphs or grids
// - Level-order traversal of trees
// - Finding connected components in graphs
// - Problems requiring exploration of all neighbors before going deeper
// - Examples: Shortest Path in a Grid, Word Ladder, Clone Graph

// CORE IDEA (INTUITION):
// - Explore all neighbors at the present depth prior to moving on to nodes at the next depth level
// - Use a queue to keep track of nodes to visit next
// - Mark nodes as visited to avoid cycles and redundant work

// INVARIANTS:
// - All nodes at the current depth are processed before moving to the next depth
// - Each node is visited at most once
// - The queue maintains the order of exploration
// - The distance from the start node to any other node is minimized
// - Level information can be tracked using a counter or by processing nodes level by level

// TEMPLATE / SKELETON:

// EXAMPLE: Shortest Path in a Grid with Obstacles Elimination
// Given a m x n grid, where each cell is either 0 (empty) or 1 (obstacle), and an integer k,
// return the minimum number of steps to walk from the top-left corner to the bottom-right corner
// of the grid, given that you can eliminate at most k obstacles.

var shortestPath = function(grid, k) {
    let m = grid.length
    let n = grid[0].length
    let visited = Array.from({length: m}, () => new Array(n).fill(0))
    let q = new Queue()
    q.enqueue([0,0,0,k]) // [row, col, steps, remainingEliminations]

    let directions = [[0,1],[1,0],[0,-1],[-1,0]]

    while(!q.isEmpty()) {
        let [row, col, steps, remaining] = q.pop()
        if(remaining < 0) continue

        for(let [dr, dc] of directions) {
            let newRow = row + dr
            let newCol = col + dc

            if(newRow < 0 || newCol < 0 || newRow >= m || newCol >= n || visited[newRow][newCol]) continue

            if(newRow === m-1 && newCol === n-1) return steps

            if(grid[newRow][newCol] === 1) {
                // break wall
                visited[newRow][newCol] = 1
                q.enqueue([newRow, newCol, steps+1, remaining-1])
            }else {
                visited[newRow][newCol] = 1
                q.enqueue([newRow, newCol, steps+1, remaining])
            }
        }
    }

    return -1
};

// COMMON MISTAKES:
// - Not marking nodes as visited, leading to infinite loops
// - Forgetting to check boundary conditions in grids
// - Not handling the case when the start node is the target node
// - Mixing up row and column indices
// - Not accounting for obstacles or special conditions in the grid
// - Failing to track the number of steps or levels correctly

// TIME & SPACE:
// TIME COMPLEXITY: O(V + E) where V is the number of vertices and E is the number of edges
// SPACE COMPLEXITY: O(V) for the queue and visited set

// RELATED PROBLEMS:
// - Word Ladder
// - Clone Graph
// - Minimum Depth of Binary Tree
// - Rotting Oranges
// - Number of Islands
// - Shortest Path in Binary Matrix
// - Course Schedule
// - Sliding Puzzle
