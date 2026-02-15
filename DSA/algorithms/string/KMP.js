// PATTERN NAME:
// KMP (Knuth-Morris-Pratt) String Search Algorithm

// PROBLEM STATEMENT:
// Given a text and a pattern, find the starting index of the first occurrence of the pattern in the text using the KMP algorithm.

// WHEN TO USE:
// - When you need to search for a substring within a larger string efficiently.
// - When you want to avoid re-evaluating characters in the text that have already been matched.
// - When dealing with long patterns or texts where naive substring search would be inefficient.

// Rabin-Karp vs KMP:
// - Rabin-Karp uses hashing to find potential matches and is efficient for multiple pattern searches.
// - KMP preprocesses the pattern to skip unnecessary comparisons, making it efficient for single pattern searches.
// - KMP guarantees O(n + m) time complexity in all cases, while Rabin-Karp has average O(n + m) but can degrade to O(n * m) in the worst case due to hash collisions.

// CORE IDEA (INTUITION):
// The KMP algorithm preprocesses the pattern to create a longest prefix-suffix (LPS) array.
// This array is used to skip unnecessary comparisons in the text when a mismatch occurs,
// allowing the search to continue from a position that leverages previously matched characters.

// INVARIANTS:
// - The LPS array correctly represents the longest proper prefix which is also a suffix for each prefix of the pattern.
// - During the search, when a mismatch occurs, the pattern index is updated using the LPS array without moving back in the text.
// STEP-BY-STEP ALGORITHM:
// 1. Build the LPS array for the pattern.
// 2. Initialize two pointers: one for the text (i) and one for the pattern (j).
// 3. While the text pointer is within bounds:
//    a. If the characters at both pointers match, increment both pointers.
//    b. If the pattern pointer reaches the end of the pattern, a match is found; return the starting index.
//    c. If a mismatch occurs and the pattern pointer is not at the start, update the pattern pointer using the LPS array.
//    d. If a mismatch occurs and the pattern pointer is at the start, increment the text pointer.
// 4. If no match is found by the end of the text, return -1.

// TEMPLATE / SKELETON:

// KMP (Knuth-Morris-Pratt) pattern matching
// search for 'pattern' in 'text', return starting index or -1 if not found
function KMP(text, pattern) {
  const lps = buildLPS(pattern) // LPS = Longest Prefix Suffix array
  let i = 0, // text pointer
    j = 0    // pattern pointer 

  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++
      j++
      if (j === pattern.length) return i - j // Found! Return starting index
    } else if (j > 0) {
      j = lps[j - 1] // Mismatch: Use previous match info (don't increment i)
    } else {
      i++ // No match at start of pattern, No choice but advance text pointer
    }
  }
  return -1 // Pattern not found
}

// Build Longest Proper Prefix which is also Suffix array
function buildLPS(s) {
  const lps = new Array(s.length).fill(0) // lps[i] = length of longest prefix-suffix for s[0..i]

  for (let i = 1; i < lps.length; i++) {
    let prevIdx = lps[i - 1] // Start with previous LPS length

    // Keep jumping back until we find a match or reach start
    while (prevIdx > 0 && s[i] !== s[prevIdx]) {
      prevIdx = lps[prevIdx - 1]
    }

    // If characters match, extend the length; otherwise it stays 0
    lps[i] = prevIdx + (s[i] === s[prevIdx] ? 1 : 0)
  }

  return lps
}

// EXAMPLE USAGE:
const text = "ababcabcabababd"
const pattern = "ababd"
const result = KMP(text, pattern)
console.log(result) // Output: 10

// dry run example:
// text:    ababcabcabababd
// pattern:     ababd

// LPS building for "ababd":
// i=1: 'b' != 'a' -> lps[1] = 0
// i=2: 'a' == 'a' -> lps[2] = 1
// i=3: 'b' == 'b' -> lps[3] = 2
// i=4: 'd' != 'a' -> jump back using lps[1]=0 -> lps[4] = 0

// LPS:     [0,0,1,2,0]

// Search process:
// i=0,j=0: 'a'=='a' -> i=1,j=1
// i=1,j=1: 'b'=='b' -> i=2,j=2
// i=2,j=2: 'a'=='a' -> i=3,j=3
// i=3,j=3: 'b'=='b' -> i=4,j=4
// i=4,j=4: 'c'!='d' -> j=lps[3]=2
// i=4,j=2: 'c'!='a' -> j=lps[1]=0
// i=4,j=0: 'c'!='a' -> i=5
// i=5,j=0: 'a'=='a' -> i=6,j=1
// i=6,j=1: 'b'=='b' -> i=7,j=2
// i=7,j=2: 'a'=='a' -> i=8,j=3
// i=8,j=3: 'b'=='b' -> i=9,j=4
// i=9,j=4: 'a'!='d' -> j=lps[3]=2
// i=9,j=2: 'a'=='a' -> i=10,j=3
// i=10,j=3: 'b'=='b' -> i=11,j=4
// i=11,j=4: 'd'=='d' -> i=12,j=5 -> match found at i-j=12-5=7

// Match found at index 10

// COMMON MISTAKES:
// - Incorrectly building the LPS array: Ensure proper handling of mismatches while constructing the LPS.
// - Not using the LPS array correctly during mismatches in the search phase.
// - Failing to handle edge cases, such as empty strings or patterns longer than the text.

// TIME & SPACE:
// - Time complexity
//   - O(n + m) where n is the length of the text and m is the length of the pattern.
// - Space complexity
//   - O(m) for storing the LPS array.

// RELATED PROBLEMS:
// - substring search
// - pattern matching in DNA sequences
// - searching for keywords in documents