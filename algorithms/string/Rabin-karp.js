// PATTERN NAME:
// Rabin-Karp String Search Algorithm

// PROBLEM STATEMENT:
// Given a text and a pattern, find the starting index of the first occurrence of the pattern in the text using the Rabin-Karp algorithm.

// WHEN TO USE:
// - When you need to search for a substring within a larger string efficiently.
// - When dealing with multiple pattern searches in the same text.
// - When you want to leverage hashing to speed up string comparisons.

// CORE IDEA (INTUITION):
// The Rabin-Karp algorithm uses hashing to convert the pattern and substrings of the text into numerical values (hashes).
// By comparing these hash values, we can quickly identify potential matches.
// If the hash values match, we perform a direct character comparison to confirm the match, thus reducing the number of direct comparisons needed.

// INVARIANTS:
// - The hash function should minimize collisions (different strings producing the same hash).
// - The rolling hash technique allows efficient computation of hash values for substrings as the search window moves through the text.
// STEP-BY-STEP ALGORITHM:
// 1. Compute the hash value of the pattern.
// 2. Compute the hash value of the first window of text with the same length as the pattern.
// 3. Slide the window over the text one character at a time, updating the hash value using the rolling hash technique.
// 4. At each position, compare the hash values of the current text window and the pattern.
// 5. If the hash values match, perform a character-by-character comparison to confirm the match.
// 6. If a match is found, return the starting index; otherwise, continue until the end of the text is reached.

// TEMPLATE / SKELETON:

function rabinKarp(text, pattern) {
  const BASE = 256 // Treat chars as base-256 (ASCII range)
  const MOD = 1e9 + 7 // Large prime to avoid overflow
  const m = pattern.length // Pattern length
  const n = text.length // Text length

  if (m > n) return -1 // Pattern longer than text

  // STEP 1: Calculate hash of pattern
  // Hash formula: h = (c[0]*BASE^(m-1) + c[1]*BASE^(m-2) + ... + c[m-1]) % MOD
  let patternHash = 0
  for (let i = 0; i < m; i++) {
    patternHash = (patternHash * BASE + pattern.charCodeAt(i)) % MOD
  }

  // STEP 2: Precompute BASE^(m-1) % MOD (needed for rolling hash)
  // This is the weight of the leftmost character in our window
  let power = 1
  for (let i = 0; i < m - 1; i++) {
    power = (power * BASE) % MOD
  }

  // STEP 3: Calculate hash of first window in text
  let currentHash = 0
  for (let i = 0; i < m; i++) {
    currentHash = (currentHash * BASE + text.charCodeAt(i)) % MOD
  }

  // STEP 4: Check if first window matches
  if (currentHash === patternHash && verifyMatch(text, pattern, 0)) {
    return 0 // Pattern found at index 0
  }

  // STEP 5: Slide window through the text using rolling hash
  for (let i = m; i < n; i++) {
    // ROLLING HASH: Remove leftmost char, add rightmost char

    // Remove the leftmost character from hash
    let oldChar = text[i - m] // Character leaving the window
    currentHash = (currentHash - ((oldChar.charCodeAt(0) * power) % MOD) + MOD) % MOD

    // Shift everything left (multiply by BASE) and add new character
    let newChar = text[i] // Character entering the window
    currentHash = (currentHash * BASE + newChar.charCodeAt(0)) % MOD

    // STEP 6: Check if hash matches (with verification to avoid collisions)
    if (currentHash === patternHash && verifyMatch(text, pattern, i - m + 1)) {
      return i - m + 1 // Pattern found at this index
    }
  }

  return -1 // Pattern not found
}

// Verify actual character-by-character match (prevents hash collisions)
function verifyMatch(text, pattern, start) {
  for (let i = 0; i < pattern.length; i++) {
    if (text[start + i] !== pattern[i]) {
      return false // Mismatch found
    }
  }
  return true // All characters match
}

// EXAMPLE USAGE:
const text = "ababcabcabababd"
const pattern = "ababd"
const result = rabinKarp(text, pattern)
console.log(result) // Output: 10

// COMMON MISTAKES:
// - Not handling hash collisions: Always verify matches with direct comparison after hash match.
// - Incorrectly implementing the rolling hash update: Ensure proper removal and addition of characters in the hash calculation.
// - Not using a large enough prime modulus, which can lead to overflow and incorrect hash values.

// TIME & SPACE:
// - Time complexity
//   - Average case: O(n + m) where n is the length of the text and m is the length of the pattern.
//   - Worst case: O(n * m) in case of many hash collisions.
// - Space complexity
//   - O(1) additional space for hash calculations and variables.

// RELATED PROBLEMS:
// - haystack and needle substring search
// - multiple pattern search in a single text
// - plagiarism detection using substring matching
