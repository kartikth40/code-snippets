// KSum

// Find all unique k-sized combinations in an array that sum up to a target value.
// This function uses recursion to reduce the k-sum problem to a 2-sum problem.

// Time Complexity: O(n^(k-1))
// Space Complexity: O(k) for the recursion stack

// Algorithm Steps: 
// 1. Sort the array to handle duplicates and use two-pointer technique.
// 2. Use recursion to reduce the k-sum problem to a 2-sum problem.
// 3. For k > 2, fix one element and recursively solve for k-1.
// 4. For k = 2, use two pointers to find pairs that sum to the target.
// 5. Skip duplicates to ensure unique combinations.

var fourSum = function(nums, target) {
    let quads = []
    nums.sort((a,b) => a-b)

    function kSum(start, k, curArr, curSum) {
        // BASE CASE: When down to 2 numbers, use two-pointer technique
        if(k === 2) {
            let i = start
            let j = nums.length - 1
            
            // KEY: Keep looping until pointers meet
            while(i < j) {
                let sum = nums[i] + nums[j] + curSum
                
                if(sum === target) {
                    quads.push([...curArr, nums[i], nums[j]])
                    // Skip duplicates from both ends
                    while(i < j && nums[i] === nums[i+1]) i++
                    while(i < j && nums[j] === nums[j-1]) j--
                    i++
                    j--
                } else if(sum < target) {
                    i++  // Need bigger sum
                } else {
                    j--  // Need smaller sum
                }
            }
        } 
        // RECURSIVE CASE: Fix one number, solve k-1 sum
        else {
            for(let i = start; i < nums.length - k + 1; i++) {
                // Skip duplicate starting numbers
                if(i > start && nums[i] === nums[i-1]) continue
                
                curArr.push(nums[i])
                kSum(i+1, k-1, curArr, curSum + nums[i])
                curArr.pop()
            }
        }
    }

    kSum(0, 4, [], 0)
    return quads
};

// Example Usage:
console.log(fourSum([1, 0, -1, 0, -2, 2], 0)) // Output: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]