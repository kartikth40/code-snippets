# DSA Cheatsheet (JavaScript)
##### For quick revision before interviews

### Common Time Complexities

| Technique | Time |
|-----------|------|
| Binary Search | O(log n) |
| Sorting | O(n log n) |
| BFS / DFS | O(V + E) |
| Dijkstra | O(E log V) |
| Sliding Window | O(n) |
| Two Pointers | O(n) |
| DP (1D) | O(n) |
| DP (2D) | O(n * m) |
| Monotonic Stack | O(n) |


## Binary Search

template:
```js
function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
```

## DFS

template:
```js
function dfs(node, adj, visited) {
  visited.add(node);

  for (const nei of adj[node]) {
    if (!visited.has(nei)) dfs(nei, adj, visited);
  }
}
```

## BFS

template:
```js
function bfs(start, adj) {
  const q = [start];
  const visited = new Set([start]);

  while (q.length) {
    const node = q.shift();

    for (const nei of adj[node]) {
      if (!visited.has(nei)) {
        visited.add(nei);
        q.push(nei);
      }
    }
  }
}
```

## Kadane’s Algorithm

template:
```js
let cur = nums[0];
let best = nums[0];

for (let i = 1; i < nums.length; i++) {
  cur = Math.max(nums[i], cur + nums[i]);
  best = Math.max(best, cur);
}
```

## Monotonic Stack

template:
```js
const stack = [];
const res = Array(nums.length).fill(-1);

for (let i = nums.length - 1; i >= 0; i--) {
  while (stack.length && stack[stack.length - 1] <= nums[i]) {
    stack.pop();
  }
  if (stack.length) res[i] = stack[stack.length - 1];
  stack.push(nums[i]);
}
```

## Dijkstra’s Algorithm

template:
```js
function dijkstra(adj, src, n) {
  const dist = Array(n).fill(Infinity);
  dist[src] = 0;

  const pq = new MinPriorityQueue({ priority: x => x[1] });
  pq.enqueue([src, 0]);

  while (!pq.isEmpty()) {
    const [node, d] = pq.dequeue().element;
    if (d > dist[node]) continue;

    for (const [nei, w] of adj[node]) {
      if (dist[node] + w < dist[nei]) {
        dist[nei] = dist[node] + w;
        pq.enqueue([nei, dist[nei]]);
      }
    }
  }
  return dist;
}
```

## DP

template (1D):
```js
const dp = Array(n).fill(0);

// fill base cases
dp[0] = ...;

for (let i = 1; i < n; i++) {
  dp[i] = Math.max(
    dp[i - 1],     // or some related states
    dp[i - 2] + ..., 
  );
}
```

#### Classic Patterns (Must Know)
- Kadane -> max subarray

    ```js
    cur = Math.max(arr[i], cur + arr[i]);
    ```

- House Robber (Pick/Not Pick)
    ```js
    dp[i] = Math.max(
      dp[i - 1],          // not pick
      dp[i - 2] + nums[i] // pick
    );
    ```

- Knapsack (0/1)
    ```js
    for (let w = capacity; w >= weight; w--) {
      dp[w] = Math.max(dp[w], dp[w - weight] + value);
    }
    ```

- Longest Common Subsequence (LCS)
    ```js
    if (s1[i - 1] === s2[j - 1])
      dp[i][j] = 1 + dp[i - 1][j - 1];
    else 
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    ```

## Trie (Prefix Tree)

template:
```js
class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let cur = this.root;
    for (const ch of word) {
      if (!cur.children[ch]) cur.children[ch] = new TrieNode();
      cur = cur.children[ch];
    }
    cur.isEnd = true;
  }

  search(word) {
    let cur = this.root;
    for (const ch of word) {
      if (!cur.children[ch]) return false;
      cur = cur.children[ch];
    }
    return cur.isEnd;
  }

  startsWith(prefix) {
    let cur = this.root;
    for (const ch of prefix) {
      if (!cur.children[ch]) return false;
      cur = cur.children[ch];
    }
    return true;
  }
}
```

#### When to use Trie

- Prefix/suffix queries

- Autocomplete

- Word search on grids

- Longest prefix

- Lexicographically next string

## Union-Find (DSU)

template:
```js
class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(1);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // path compression
    }
    return this.parent[x];
  }

  union(a, b) {
    let pa = this.find(a);
    let pb = this.find(b);
    if (pa === pb) return false;

    // union by rank
    if (this.rank[pa] < this.rank[pb]) [pa, pb] = [pb, pa];
    this.parent[pb] = pa;
    this.rank[pa] += this.rank[pb];
    return true;
  }
}
```
#### When to use Trie

- Cycle detection in undirected graphs

- Kruskal’s MST

- Connected components

- Dynamic connectivity

- Grid problems like "number of islands"

## Topological Sort (Kahn’s Algorithm)

template:
```js
function topoSort(n, adj) {
  const indeg = Array(n).fill(0);

  for (let u = 0; u < n; u++) {
    for (const v of adj[u]) indeg[v]++;
  }

  const q = [];
  for (let i = 0; i < n; i++) {
    if (indeg[i] === 0) q.push(i);
  }

  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);

    for (const v of adj[u]) {
      indeg[v]--;
      if (indeg[v] === 0) q.push(v);
    }
  }

  return order.length === n ? order : []; // empty → cycle exists
}
```
#### When to use Topo Sort

- Course schedule

- Ordering tasks with dependencies

- Build systems

- Checking cycles in directed graphs