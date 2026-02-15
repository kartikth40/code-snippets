// PATTERN NAME: Longest Increasing Subsequence (LIS)

// PROBLEM STATEMENT:
// Given an array of integers, find the length of the longest strictly increasing subsequence.
// DP solution is O(n^2), but we can optimize to O(n log n) using a clever approach called "Patience Sort".

// **Patience Sort intuition**:
// - **Card game**: Deal cards into piles, each pile sorted (smaller on top)
// - **Rule**: Place card on leftmost pile with top ≥ card (or start new pile)
// - **Key insight**: # of piles = LIS length
// - **Why?**: Each pile represents a "chain" in the subsequence

// WHEN TO USE:
// - When asked for longest increasing subsequence or similar problems
// - When O(n^2) DP is too slow and you need O(n log n)

// CORE IDEA (INTUITION):
// 1. We maintain piles of cards (numbers) where each pile is sorted in increasing order.
// 2. For each number, we use binary search to find the leftmost pile whose top card is greater than or equal to that number.
// 3. If such a pile exists, we replace the top card with the current number (this keeps the pile's top as small as possible).
// 4. If no such pile exists, we start a new pile with the current number.
// 5. The number of piles at the end gives us the length of the longest increasing subsequence.

// INVARIANTS:
// - The tails array is always sorted in increasing order (top cards).
// - The length of the tails array at the end is the length of the longest increasing subsequence.

// TEMPLATE / SKELETON:

// Patience Sort | time: O(n log n) | space: O(n)
// Why it works: Keeping smallest endings maximizes future extension opportunities.
    
function getLIS(nums) {
    let n = nums.length
    
    // tails[i] = smallest ending value among all LIS of length i+1
    // Example: tails[2] = smallest number that ends any LIS of length 3
    // Key: tails is always sorted (smaller lengths have smaller endings)
    let tails = []
    
    // To reconstruct: track which element created each tail
    let indices = []  // indices[i] = array index of tails[i]
    let parent = new Array(n).fill(-1)  // link to previous element
    
    for(let i = 0; i < n; i++) {
        let num = nums[i]
        
        // Binary search: where can num extend or improve existing LIS?
        let left = 0, right = tails.length
        
        while(left < right) {
            let mid = Math.floor((left + right) / 2)
            if(tails[mid] < num) {
                left = mid + 1  // num is bigger, try longer LIS
            } else {
                right = mid     // num can improve this length
            }
        }
        
        // Connect to previous element in the chain
        if(left > 0) {
            parent[i] = indices[left - 1]
        }
        
        // Update: either extend LIS or replace with smaller ending
        if(left === tails.length) {
            tails.push(num)      // New longest LIS
            indices.push(i)
        } else {
            tails[left] = num    // Better (smaller) ending for this length
            indices[left] = i
        }
    }
    
    // Trace back the actual sequence
    let lis = []
    let idx = indices[indices.length - 1]  // Start from longest LIS
    
    while(idx !== -1) {
        lis.push(nums[idx])
        idx = parent[idx]
    }
    
    return lis.reverse()
}

// EXAMPLE:
// Input: [10,9,2,5,3,7,101,18]
// Output: 4 (LIS is [2,3,7,18])

const nums = [10,9,2,5,3,7,101,18]
console.log(getLIS(nums)) // [2,3,7,18]


// COMMON MISTAKES:
// - Forgetting to use binary search for O(n log n) solution
// - Not maintaining the parent array when reconstructing the actual LIS
// - Confusing the tails array with the actual subsequence (tails only track top cards)

// TIME & SPACE:
// - Time complexity
//   - O(n log n) due to binary search for each of the n elements

// - Space complexity
//   - O(n) for the tails, indices, and parent arrays

// RELATED PROBLEMS:
// - Longest Decreasing Subsequence (LDS): Similar approach but reverse the comparison in binary search
// - Longest Bitonic Subsequence: Combine LIS and LDS results
// - Maximum Sum Increasing Subsequence: Similar to LIS but track sums instead of lengths
