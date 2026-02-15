// PATTERN NAME: Tarjan's Algorithm for Finding Bridges in a Graph, also known as Critical Connections in a Network
// PROBLEM STATEMENT: Given a graph with n vertices and a list of connections (edges), 
// find all the critical connections in the graph. A critical connection is an edge that, 
// if removed, will make some vertex unable to reach some other vertex.

// WHEN TO USE:
// - When you need to find all bridges in an undirected graph
// - When analyzing network reliability or critical connections
// - When solving problems related to graph connectivity

// CORE IDEA (INTUITION):
// 1. Perform DFS and assign discovery times to each vertex
// 2. Compute low values which represent the earliest visited vertex reachable from the subtree rooted at that vertex
// 3. An edge (u, v) is a bridge if low[v] > disc[u], meaning v cannot reach any ancestor of u without using the edge (u, v)

// INVARIANTS:
// - Each vertex is visited exactly once during DFS
// - Discovery times are assigned in increasing order as we visit vertices
// - Low values are updated based on back edges and tree edges

// TEMPLATE / SKELETON:

// Tarjan's algo of finding bridges
var criticalConnections = function(n, connections) {
    // Build adjacency list
    let graph = Array.from({length: n}, () => []);
    for(let [u, v] of connections) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    // disc[i] = discovery time when node i was first visited
    let disc = new Array(n).fill(-1);
    
    // low[i] = lowest discovery time reachable from node i's subtree
    // (including back edges but not parent edge)
    let low = new Array(n).fill(-1);
    
    let time = 0; // global timer for discovery times
    let result = []; // store all bridges
    
    function dfs(node, parent) {
        // Set discovery time and initial low value
        disc[node] = time;
        low[node] = time;
        time++;
        
        for(let neighbor of graph[node]) {
            // Skip the edge we came from (parent)
            if(neighbor === parent) continue;
            
            if(disc[neighbor] === -1) { 
                // Neighbor is unvisited - tree edge
                dfs(neighbor, node);
                
                // After DFS, update low[node] with info from subtree
                low[node] = Math.min(low[node], low[neighbor]);
                
                // BRIDGE CONDITION:
                // If neighbor can't reach any ancestor of node (without using node→neighbor edge)
                // then this edge is a bridge
                if(low[neighbor] > disc[node]) {
                    result.push([node, neighbor]);
                }
            } else {
                // Neighbor already visited - back edge
                // Update low[node] because we found a path to an ancestor
                low[node] = Math.min(low[node], disc[neighbor]);
            }
        }
    }
    
    // Start DFS from node 0 (graph is connected per problem)
    dfs(0, -1);
    return result;
};

// COMMON MISTAKES:
// - Not updating low values correctly based on back edges
// - Forgetting to check the bridge condition after DFS call
// - Not handling the parent edge correctly in undirected graph

// TIME & SPACE:
// - Time complexity
// O(V + E) for DFS traversal of the graph
// - Space complexity
// O(V) for discovery and low arrays, and O(V) for recursion stack in worst case

// RELATED PROBLEMS:
// - Kosaraju's Algorithm for Strongly Connected Components
// - Finding articulation points in a graph
// - Condensation of a directed graph into its strongly connected components
