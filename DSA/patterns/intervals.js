// PATTERN NAME: Interval Problems

// WHEN TO USE:
// - Merge overlapping intervals
// - Find conflicts/overlaps between intervals
// - Insert new interval into sorted list
// - Minimum resources for overlapping tasks (meeting rooms)
// - Sweep line problems

// CORE IDEA (INTUITION):
// - Sort intervals (usually by start time, sometimes by end time)
// - Process them left-to-right, tracking the "active" state
// - Two intervals [a,b] and [c,d] overlap if a <= d AND c <= b
// - For minimum resources: use sweep line (separate starts and ends)

// INVARIANTS:
// - After sorting by start: if current.start > prev.end, no overlap
// - Sweep line: at any point, active count = starts seen - ends seen
// - For selection problems: sort by END time (greedy)

// TEMPLATE / SKELETON:

// Overlap check: do [a,b] and [c,d] overlap?
// a <= d && c <= b  (assuming a <= b and c <= d)

// Merge Intervals
function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0])
  const result = [intervals[0]]

  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1]
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1])
    } else {
      result.push(intervals[i])
    }
  }

  return result
}

// Insert Interval into sorted non-overlapping list
function insert(intervals, newInterval) {
  const result = []
  let i = 0

  // All intervals ending before new one starts
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i++])
  }

  // Merge all overlapping intervals with newInterval
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0])
    newInterval[1] = Math.max(newInterval[1], intervals[i][1])
    i++
  }
  result.push(newInterval)

  // Remaining intervals
  while (i < intervals.length) {
    result.push(intervals[i++])
  }

  return result
}

// Interval Intersection (two sorted lists)
function intervalIntersection(firstList, secondList) {
  const result = []
  let i = 0, j = 0

  while (i < firstList.length && j < secondList.length) {
    const lo = Math.max(firstList[i][0], secondList[j][0])
    const hi = Math.min(firstList[i][1], secondList[j][1])

    if (lo <= hi) result.push([lo, hi])

    // Advance the one that ends first
    if (firstList[i][1] < secondList[j][1]) i++
    else j++
  }

  return result
}

// Meeting Rooms — can attend all meetings? (no overlaps)
function canAttendMeetings(intervals) {
  intervals.sort((a, b) => a[0] - b[0])

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) return false
  }

  return true
}

// Meeting Rooms II — minimum rooms needed (sweep line)
function minMeetingRooms(intervals) {
  const events = []
  for (const [start, end] of intervals) {
    events.push([start, 1])   // meeting starts
    events.push([end, -1])    // meeting ends
  }

  // Sort by time; if tie, end (-1) before start (+1)
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1])

  let rooms = 0, maxRooms = 0
  for (const [, delta] of events) {
    rooms += delta
    maxRooms = Math.max(maxRooms, rooms)
  }

  return maxRooms
}

// Minimum Number of Arrows to Burst Balloons
// Sort by end, greedily shoot at earliest end point
function findMinArrowShots(points) {
  points.sort((a, b) => a[1] - b[1])
  let arrows = 1
  let prevEnd = points[0][1]

  for (let i = 1; i < points.length; i++) {
    if (points[i][0] > prevEnd) {
      arrows++
      prevEnd = points[i][1]
    }
  }

  return arrows
}

// COMMON MISTAKES:
// - Sorting by start when you should sort by end (selection vs merge)
// - Off-by-one: [1,2] and [2,3] — do they overlap? Depends on problem definition
// - Not handling empty input
// - Forgetting to update the merged interval's end (take max, not replace)
// - Sweep line: wrong tie-breaking order (ends should process before starts at same time)

// TIME & SPACE:
// - All interval problems: O(n log n) time (sorting), O(n) space
// - Sweep line: O(n log n) time, O(n) space for events array

// RELATED PROBLEMS:
// - Merge Intervals (LC 56)
// - Insert Interval (LC 57)
// - Non-overlapping Intervals (LC 435)
// - Meeting Rooms (LC 252)
// - Meeting Rooms II (LC 253)
// - Interval List Intersections (LC 986)
// - Minimum Number of Arrows (LC 452)
// - Employee Free Time (LC 759)
// - My Calendar I/II/III (LC 729/731/732)

console.log(merge([[1,3],[2,6],[8,10],[15,18]]))  // [[1,6],[8,10],[15,18]]
console.log(insert([[1,3],[6,9]], [2,5]))          // [[1,5],[6,9]]
console.log(intervalIntersection([[0,2],[5,10]], [[1,5],[8,12]]))  // [[1,2],[5,5],[8,10]]
console.log(canAttendMeetings([[0,30],[5,10],[15,20]]))  // false
console.log(minMeetingRooms([[0,30],[5,10],[15,20]]))    // 2
console.log(findMinArrowShots([[10,16],[2,8],[1,6],[7,12]]))  // 2
