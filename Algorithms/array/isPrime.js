// For Multiple Queries: Sieve of Eratosthenes
// If checking many numbers up to n:
function sieveOfEratosthenes(n) {
  let isPrime = new Array(n + 1).fill(true)
  isPrime[0] = isPrime[1] = false

  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      // Mark all multiples as not prime
      // Start from i*i to avoid redundant work
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false
      }
    }
  }

  return isPrime // Array where isPrime[i] tells if i is prime
}
