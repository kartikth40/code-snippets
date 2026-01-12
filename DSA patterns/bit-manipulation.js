/**
 * BIT MANIPULATION PATTERNS & TIPS
 * 
 * KEY CONCEPTS:
 * - AND (&), OR (|), XOR (^), NOT (~)
 * - Left Shift (<<), Right Shift (>>), Unsigned Right Shift (>>>)
 * - Bit manipulation is O(1) for most operations
 */

// ============================================
// PATTERN 1: CHECK, SET, CLEAR, TOGGLE BITS
// ============================================

// Check if i-th bit is set
function isBitSet(num, i) {
  return (num & (1 << i)) !== 0;
}

// Set i-th bit
function setBit(num, i) {
  return num | (1 << i);
}

// Clear i-th bit
function clearBit(num, i) {
  return num & ~(1 << i);
}

// Toggle i-th bit
function toggleBit(num, i) {
  return num ^ (1 << i);
}

// ============================================
// PATTERN 2: POWER OF TWO & COUNTING
// ============================================

// Check if power of 2
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

// Count set bits (Brian Kernighan's Algorithm)
function countSetBits(n) {
  let count = 0;
  while (n) {
    n &= (n - 1); // Clear rightmost set bit
    count++;
  }
  return count;
}

// Get rightmost set bit
function getRightmostSetBit(n) {
  return n & -n;
}

// ============================================
// PATTERN 3: XOR TRICKS
// ============================================

// Find single number (all others appear twice)
function singleNumber(nums) {
  return nums.reduce((a, b) => a ^ b, 0);
}

// Find two non-repeating numbers
function findTwoUnique(nums) {
  const xor = nums.reduce((a, b) => a ^ b, 0);
  const rightmost = xor & -xor;
  let num1 = 0, num2 = 0;
  
  for (let num of nums) {
    if (num & rightmost) num1 ^= num;
    else num2 ^= num;
  }
  return [num1, num2];
}

// Swap two numbers without temp variable
function swap(a, b) {
  a ^= b;
  b ^= a;
  a ^= b;
  return [a, b];
}

// ============================================
// PATTERN 4: SUBSET GENERATION
// ============================================

// Generate all subsets using bitmask
function generateSubsets(arr) {
  const n = arr.length;
  const subsets = [];
  
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        subset.push(arr[i]);
      }
    }
    subsets.push(subset);
  }
  return subsets;
}

// ============================================
// PATTERN 5: BIT RANGE OPERATIONS
// ============================================

// Get bits from position i to j
function getBits(num, i, j) {
  const mask = ((1 << (j - i + 1)) - 1) << i;
  return (num & mask) >> i;
}

// Set bits from position i to j to value
function setBits(num, i, j, value) {
  const mask = ((1 << (j - i + 1)) - 1) << i;
  return (num & ~mask) | ((value << i) & mask);
}

// Clear bits from i to 0
function clearBitsIToZero(num, i) {
  return num & (~0 << (i + 1));
}

// Clear bits from MSB to i
function clearBitsMSBToI(num, i) {
  return num & ((1 << i) - 1);
}

// ============================================
// PATTERN 6: ADVANCED PROBLEMS
// ============================================

// Reverse bits of a 32-bit integer
function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);
    n >>= 1;
  }
  return result >>> 0; // Unsigned
}

// Count bits to flip A to B
function bitFlipsToConvert(a, b) {
  return countSetBits(a ^ b);
}

// Find missing number (0 to n)
function missingNumber(nums) {
  let xor = nums.length;
  for (let i = 0; i < nums.length; i++) {
    xor ^= i ^ nums[i];
  }
  return xor;
}

// Add two numbers without + operator
function add(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}

// Multiply by 7 using bit manipulation
function multiplyBy7(n) {
  return (n << 3) - n; // 8n - n = 7n
}

// Check if number has alternating bits
function hasAlternatingBits(n) {
  const xor = n ^ (n >> 1);
  return (xor & (xor + 1)) === 0;
}

// ============================================
// HIGH LEVEL TIPS
// ============================================

/**
 * IMPORTANT PATTERNS TO MASTER:
 * 
 * 1. n & (n-1): Clears rightmost set bit
 * 2. n & -n: Isolates rightmost set bit
 * 3. n | (n+1): Sets rightmost unset bit
 * 4. ~n & (n+1): Isolates rightmost unset bit
 * 5. (n & 1) === 0: Check if even
 * 6. n ^= n: Sets n to 0
 * 7. a ^ b ^ b = a: XOR cancellation
 * 
 * COMMON USE CASES:
 * - Hashing/Compression
 * - Cryptography basics
 * - Graphics (color manipulation)
 * - Network protocols
 * - Low-level optimizations
 * - DP state compression
 * 
 * TIME COMPLEXITY: O(1) for single operations, O(k) for k-bit numbers
 * SPACE COMPLEXITY: O(1)
 * 
 * INTERVIEW TIPS:
 * - Always clarify bit width (32-bit vs 64-bit)
 * - Watch for signed vs unsigned integers
 * - Consider edge cases: 0, negative numbers, overflow
 * - Explain your bit masks clearly
 * - Draw out bit patterns when stuck
 */