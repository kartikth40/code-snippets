// PATTERN NAME: Greedy

// WHEN TO USE:
// - When a locally optimal choice at each step leads to a globally optimal solution
// - Interval scheduling (merge, meeting rooms, non-overlapping)
// - Activity selection, job sequencing
// - Jump Game variants
// - Huffman coding, fractional knapsack
// - When you can prove the greedy choice property holds

// CORE IDEA (INTUITION):
// - At each step, make the choice that looks best RIGHT NOW
// - Never reconsider previous choices (no backtracking)
// - Works when: greedy choice property + optimal substructure
// - Key question: "Can I prove that being greedy never hurts?"

// INVARIANTS:
// - The greedy choice is always part of some optimal solution
// - After making a greedy choice, the remaining problem is a smaller instance of the same problem
// - Sorting is often a prerequisite to enable the greedy strategy

// TEMPLATE / SKELETON:

// === INTERVAL SCHEDULING ===

// Merge Intervals
// Sort by start, merge overlapping
function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0])
  const merged = [intervals[0]]

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1]
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1])
    } else {
      merged.push(intervals[i])
    }
  }

  return merged
}

// Insert Interval
function insert(intervals, newInterval) {
  const result = []
  let i = 0

  // Add all intervals that end before newInterval starts
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i])
    i++
  }

  // Merge overlapping intervals with newInterval
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0])
    newInterval[1] = Math.max(newInterval[1], intervals[i][1])
    i++
  }
  result.push(newInterval)

  // Add remaining intervals
  while (i < intervals.length) {
    result.push(intervals[i])
    i++
  }

  return result
}

// Non-overlapping Intervals (minimum removals)
// Sort by END time, greedily keep earliest-ending intervals
function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1])
  let removals = 0
  let prevEnd = -Infinity

  for (const [start, end] of intervals) {
    if (start >= prevEnd) {
      prevEnd = end // keep this interval
    } else {
      removals++ // remove this interval (overlaps)
    }
  }

  return removals
}

// Meeting Rooms II (minimum rooms needed)
// Separate start/end times, sweep line
function minMeetingRooms(intervals) {
  const starts = intervals.map(i => i[0]).sort((a, b) => a - b)
  const ends = intervals.map(i => i[1]).sort((a, b) => a - b)

  let rooms = 0, maxRooms = 0
  let s = 0, e = 0

  while (s < starts.length) {
    if (starts[s] < ends[e]) {
      rooms++
      s++
    } else {
      rooms--
      e++
    }
    maxRooms = Math.max(maxRooms, rooms)
  }

  return maxRooms
}

// === JUMP GAME ===

// Jump Game I — can you reach the last index?
function canJump(nums) {
  let maxReach = 0

  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false
    maxReach = Math.max(maxReach, i + nums[i])
  }

  return true
}

// Jump Game II — minimum jumps to reach end
function jump(nums) {
  let jumps = 0, curEnd = 0, farthest = 0

  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i])

    if (i === curEnd) {
      jumps++
      curEnd = farthest
    }
  }

  return jumps
}

// === TASK SCHEDULING ===

// Task Scheduler — minimum intervals to finish all tasks with cooldown n
function leastInterval(tasks, n) {
  const freq = new Array(26).fill(0)
  for (const t of tasks) freq[t.charCodeAt(0) - 65]++

  const maxFreq = Math.max(...freq)
  const maxCount = freq.filter(f => f === maxFreq).length

  // (maxFreq - 1) full groups of (n + 1) slots + final group of maxCount tasks
  return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount)
}

// === GAS STATION ===

function canCompleteCircuit(gas, cost) {
  let totalSurplus = 0, currentSurplus = 0, start = 0

  for (let i = 0; i < gas.length; i++) {
    totalSurplus += gas[i] - cost[i]
    currentSurplus += gas[i] - cost[i]

    if (currentSurplus < 0) {
      start = i + 1
      currentSurplus = 0
    }
  }

  return totalSurplus >= 0 ? start : -1
}

// COMMON MISTAKES:
// - Applying greedy without proving the greedy choice property
// - Sorting by wrong criteria (start vs end time matters)
// - Not considering edge cases (empty intervals, single element)
// - Confusing "greedy works" with "greedy seems to work" — always verify
// - For intervals: sorting by start for merge, by END for selection/removal

// TIME & SPACE:
// - Most greedy: O(n log n) due to sorting, O(1) extra space
// - Meeting Rooms II: O(n log n) time, O(n) space
// - Task Scheduler: O(n) time, O(1) space (26 letters)

// RELATED PROBLEMS:
// - Merge Intervals (LC 56)
// - Insert Interval (LC 57)
// - Non-overlapping Intervals (LC 435)
// - Meeting Rooms II (LC 253)
// - Jump Game (LC 55)
// - Jump Game II (LC 45)
// - Task Scheduler (LC 621)
// - Gas Station (LC 134)
// - Minimum Number of Arrows to Burst Balloons (LC 452)
// - Partition Labels (LC 763)

console.log(merge([[1,3],[2,6],[8,10],[15,18]]))  // [[1,6],[8,10],[15,18]]
console.log(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]]))  // 1
console.log(canJump([2,3,1,1,4]))    // true
console.log(canJump([3,2,1,0,4]))    // false
console.log(jump([2,3,1,1,4]))       // 2
console.log(leastInterval(["A","A","A","B","B","B"], 2))  // 8
console.log(canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2]))  // 3
