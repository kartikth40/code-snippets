// PATTERN NAME: Cycle Detection in a Directed Graph

// WHEN TO USE:
// - Problems involving directed graphs where you need to detect cycles
// - Course scheduling problems with prerequisites
// - Dependency resolution problems
// - Topological sorting applications

// CORE IDEA (INTUITION):
// - Use Depth-First Search (DFS) to explore the graph
// - Maintain a state for each node: unvisited, visiting, visited
// - If you encounter a node that is currently being visited, a cycle exists

// INVARIANTS:
// - Each node can be in one of three states: unvisited, visiting, visited
// - A cycle is detected if a node is revisited while it is in the 'visiting' state
// - Once a node is fully explored, it is marked as 'visited' to prevent reprocessing

// TEMPLATE / SKELETON:

// EXAMPLE: Course Schedule
// There are a total of numCourses courses you have to take, labeled from 0 to numCourses-1.
// Some courses may have prerequisites, represented as a list of prerequisite pairs.
// Determine if you can finish all courses.

var canFinish = function(numCourses, prerequisites) {
    let graph = Array.from({length: numCourses}, () => [])

    for(let [course, prereq] of prerequisites) {
        graph[prereq].push(course)
    }


    const UNVISITED = 0
    const VISITING = 1
    const VISITED = 2
    let state = new Array(numCourses).fill(UNVISITED)

    function hasCycle(course) {
        if(state[course] === VISITING) {
            return true // cycle detected!
        }

        if(state[course] === VISITED) {
            return false // back edge - backtracking - safe to skip
        }

        state[course] = VISITING

        for(let neighbor of graph[course]) {
            if(hasCycle(neighbor)) return true
        }

        state[course] = VISITED
        return false
    }

    for(let course = 0; course < numCourses; course++) {
        if(hasCycle(course)) return false
    }

    return true
};

// COMMON MISTAKES:
// - Not maintaining proper state for each node
// - Forgetting to mark nodes as visited after exploration
// - Not handling disconnected components in the graph
// - Misinterpreting the direction of edges in the graph
// - Using BFS instead of DFS for cycle detection in directed graphs

// TIME & SPACE:
// - Time Complexity: O(V + E) where V is the number of vertices and E is the number of edges
// - Space Complexity: O(V) for the recursion stack and state array

// RELATED PROBLEMS:
// - Course Schedule II
// - Alien Dictionary
// - Minimum Height Trees
// - Graph Valid Tree
// - Eventual Safe States
// - Find Eventual Safe States



// EXAMPLE: Network Delay Time
// You are given a network of n nodes, labeled from 1 to n.
// You are also given times, a list of travel times as directed edges times[i] = (ui, vi, wi),

// Dijkstra's Algorithm Implementation

var networkDelayTime = function(times, n, k) {
    let graph = Array.from({length: n+1}, () => [])
    let visited = Array.from({length: n+1}, () => new Array(n+1).fill(0))

    for(let [u, v, w] of times) {
        graph[u].push([v, w])
    }

    let q = new Queue()
    q.enqueue([k, 0])
    let res = -1
    let nodes = 1

    while(!q.isEmpty()) {
        let [node, curTime] = q.dequeue()
        res = curTime

        for(let [nei, time] of graph[node]) {
            if(visited[node][nei]) continue
            visited[node][nei] = 1
            q.enqueue([nei, time + 1])
            nodes++
        }
    }

    if(nodes !== n) return -1
    return res
};