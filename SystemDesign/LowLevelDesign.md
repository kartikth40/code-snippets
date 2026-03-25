# Low-Level Design (LLD) Interview Guide

## 🎯 What is LLD?

Low-Level Design focuses on the **code-level architecture** of a system — class diagrams, design patterns, interfaces, and object relationships. LLD interviews are common at SDE-1/2 level and test your ability to translate requirements into clean, extensible code.

**LLD vs HLD:**
| | High-Level Design | Low-Level Design |
|--|--|--|
| Focus | System components, data flow | Classes, interfaces, patterns |
| Output | Architecture diagram | Class diagram + code |
| Scale | Distributed systems | Single service/module |
| Time | 30-45 min | 30-45 min |

---

## 📋 LLD Interview Framework (Use Every Time)

### Step 1: Clarify Requirements (5 min)
- What are the core entities?
- What operations are needed?
- Any constraints (thread safety, extensibility)?

### Step 2: Identify Entities & Relationships (5 min)
- Nouns → Classes
- Verbs → Methods
- Relationships → Associations, Inheritance, Composition

### Step 3: Define Interfaces & Abstractions (5 min)
- What should be abstract vs concrete?
- Where do you need extensibility?

### Step 4: Apply Design Patterns (10 min)
- Which patterns fit naturally?
- Don't force patterns — use them when they solve a real problem

### Step 5: Write Core Code (15 min)
- Implement key classes
- Show method signatures and logic
- Handle edge cases

### Step 6: Discuss Trade-offs (5 min)
- Thread safety
- Extensibility
- Performance

---

## 🧱 SOLID Principles

Every LLD answer should demonstrate SOLID awareness.

### S — Single Responsibility Principle
> A class should have only one reason to change.

```javascript
// ❌ Bad: One class doing too much
class UserManager {
  createUser(data) { /* ... */ }
  sendWelcomeEmail(user) { /* ... */ }  // Email logic here?
  saveToDatabase(user) { /* ... */ }    // DB logic here?
}

// ✅ Good: Separate responsibilities
class UserService {
  constructor(userRepo, emailService) {
    this.userRepo = userRepo
    this.emailService = emailService
  }
  createUser(data) {
    const user = new User(data)
    this.userRepo.save(user)
    this.emailService.sendWelcome(user)
    return user
  }
}

class UserRepository {
  save(user) { /* DB logic */ }
  findById(id) { /* DB logic */ }
}

class EmailService {
  sendWelcome(user) { /* Email logic */ }
}
```

---

### O — Open/Closed Principle
> Open for extension, closed for modification.

```javascript
// ❌ Bad: Adding new payment type requires modifying existing class
class PaymentProcessor {
  process(type, amount) {
    if (type === 'credit') { /* ... */ }
    else if (type === 'debit') { /* ... */ }
    else if (type === 'upi') { /* ... */ }  // Keep adding ifs?
  }
}

// ✅ Good: Extend without modifying
class PaymentProcessor {
  process(payment) {
    payment.execute()  // Polymorphism
  }
}

class CreditCardPayment {
  execute() { /* credit card logic */ }
}

class UPIPayment {
  execute() { /* UPI logic */ }
}

class CryptoPayment {  // New type — no existing code changed
  execute() { /* crypto logic */ }
}
```

---

### L — Liskov Substitution Principle
> Subtypes must be substitutable for their base types.

```javascript
// ❌ Bad: Square breaks Rectangle's contract
class Rectangle {
  setWidth(w) { this.width = w }
  setHeight(h) { this.height = h }
  area() { return this.width * this.height }
}

class Square extends Rectangle {
  setWidth(w) { this.width = w; this.height = w }  // Breaks LSP!
  setHeight(h) { this.width = h; this.height = h }  // Breaks LSP!
}

// ✅ Good: Use composition or separate hierarchy
class Shape {
  area() { throw new Error('Not implemented') }
}

class Rectangle extends Shape {
  constructor(w, h) { super(); this.w = w; this.h = h }
  area() { return this.w * this.h }
}

class Square extends Shape {
  constructor(s) { super(); this.side = s }
  area() { return this.side * this.side }
}
```

---

### I — Interface Segregation Principle
> Clients should not be forced to depend on interfaces they don't use.

```javascript
// ❌ Bad: Fat interface forces all implementors to implement everything
class Animal {
  eat() {}
  sleep() {}
  fly() {}   // Not all animals fly!
  swim() {}  // Not all animals swim!
}

// ✅ Good: Segregated interfaces
class Animal {
  eat() {}
  sleep() {}
}

class Flyable {
  fly() {}
}

class Swimmable {
  swim() {}
}

// Duck can fly AND swim
class Duck extends Animal {
  fly() { /* ... */ }
  swim() { /* ... */ }
}

// Dog can only swim
class Dog extends Animal {
  swim() { /* ... */ }
}
```

---

### D — Dependency Inversion Principle
> Depend on abstractions, not concretions.

```javascript
// ❌ Bad: High-level module depends on low-level module
class OrderService {
  constructor() {
    this.db = new MySQLDatabase()  // Tightly coupled to MySQL!
  }
}

// ✅ Good: Depend on abstraction
class OrderService {
  constructor(database) {  // Inject the dependency
    this.db = database
  }
  createOrder(data) {
    return this.db.save(data)
  }
}

// Can swap implementations without changing OrderService
const mysqlService = new OrderService(new MySQLDatabase())
const mongoService = new OrderService(new MongoDatabase())
const testService = new OrderService(new InMemoryDatabase())
```

---

## 🎨 Design Patterns (Interview Essentials)

### Creational Patterns

#### Singleton
> Ensure only one instance of a class exists.

```javascript
class DatabaseConnection {
  static #instance = null

  constructor(config) {
    if (DatabaseConnection.#instance) {
      return DatabaseConnection.#instance
    }
    this.connection = this.#connect(config)
    DatabaseConnection.#instance = this
  }

  static getInstance(config) {
    if (!DatabaseConnection.#instance) {
      new DatabaseConnection(config)
    }
    return DatabaseConnection.#instance
  }

  #connect(config) {
    // establish connection
    return { host: config.host, status: 'connected' }
  }
}

// Usage
const db1 = DatabaseConnection.getInstance({ host: 'localhost' })
const db2 = DatabaseConnection.getInstance()
console.log(db1 === db2)  // true
```

**Use when:** Logger, config manager, connection pool, cache

---

#### Factory Method
> Let subclasses decide which class to instantiate.

```javascript
class NotificationFactory {
  static create(type) {
    switch (type) {
      case 'email': return new EmailNotification()
      case 'sms': return new SMSNotification()
      case 'push': return new PushNotification()
      default: throw new Error(`Unknown notification type: ${type}`)
    }
  }
}

class EmailNotification {
  send(to, message) { console.log(`Email to ${to}: ${message}`) }
}

class SMSNotification {
  send(to, message) { console.log(`SMS to ${to}: ${message}`) }
}

class PushNotification {
  send(to, message) { console.log(`Push to ${to}: ${message}`) }
}

// Usage
const notif = NotificationFactory.create('email')
notif.send('user@example.com', 'Welcome!')
```

**Use when:** Object creation logic is complex or varies by type

---

#### Builder
> Construct complex objects step by step.

```javascript
class QueryBuilder {
  constructor() {
    this.query = { table: '', conditions: [], fields: ['*'], limit: null }
  }

  from(table) {
    this.query.table = table
    return this  // Enable chaining
  }

  select(...fields) {
    this.query.fields = fields
    return this
  }

  where(condition) {
    this.query.conditions.push(condition)
    return this
  }

  limitTo(n) {
    this.query.limit = n
    return this
  }

  build() {
    let sql = `SELECT ${this.query.fields.join(', ')} FROM ${this.query.table}`
    if (this.query.conditions.length) {
      sql += ` WHERE ${this.query.conditions.join(' AND ')}`
    }
    if (this.query.limit) sql += ` LIMIT ${this.query.limit}`
    return sql
  }
}

// Usage
const sql = new QueryBuilder()
  .from('users')
  .select('id', 'name', 'email')
  .where('age > 18')
  .where('active = true')
  .limitTo(10)
  .build()
// SELECT id, name, email FROM users WHERE age > 18 AND active = true LIMIT 10
```

**Use when:** Object has many optional parameters (avoids telescoping constructors)

---

### Structural Patterns

#### Adapter
> Convert one interface to another that clients expect.

```javascript
// Old payment API
class LegacyPaymentGateway {
  makePayment(cardNumber, amount, currency) {
    return { status: 'success', transactionId: 'TXN123' }
  }
}

// New interface your app expects
class PaymentAdapter {
  constructor(legacyGateway) {
    this.gateway = legacyGateway
  }

  // New interface: pay({ card, amount, currency })
  pay({ card, amount, currency }) {
    const result = this.gateway.makePayment(card, amount, currency)
    return {
      success: result.status === 'success',
      id: result.transactionId
    }
  }
}

// Usage — app only knows the new interface
const adapter = new PaymentAdapter(new LegacyPaymentGateway())
adapter.pay({ card: '4111...', amount: 100, currency: 'INR' })
```

**Use when:** Integrating third-party libraries, legacy code migration

---

#### Decorator
> Add behavior to objects dynamically without subclassing.

```javascript
class Coffee {
  cost() { return 50 }
  description() { return 'Plain coffee' }
}

class MilkDecorator {
  constructor(coffee) { this.coffee = coffee }
  cost() { return this.coffee.cost() + 15 }
  description() { return this.coffee.description() + ', milk' }
}

class SugarDecorator {
  constructor(coffee) { this.coffee = coffee }
  cost() { return this.coffee.cost() + 5 }
  description() { return this.coffee.description() + ', sugar' }
}

class VanillaDecorator {
  constructor(coffee) { this.coffee = coffee }
  cost() { return this.coffee.cost() + 20 }
  description() { return this.coffee.description() + ', vanilla' }
}

// Usage
let myCoffee = new Coffee()
myCoffee = new MilkDecorator(myCoffee)
myCoffee = new SugarDecorator(myCoffee)
myCoffee = new VanillaDecorator(myCoffee)

console.log(myCoffee.description())  // Plain coffee, milk, sugar, vanilla
console.log(myCoffee.cost())         // 90
```

**Use when:** Adding features to objects at runtime (logging, auth, caching middleware)

---

#### Proxy
> Control access to an object.

```javascript
class ExpensiveService {
  fetchData(key) {
    console.log(`Fetching ${key} from DB...`)
    return { key, data: 'expensive result' }
  }
}

class CachingProxy {
  constructor(service) {
    this.service = service
    this.cache = new Map()
  }

  fetchData(key) {
    if (this.cache.has(key)) {
      console.log(`Cache hit for ${key}`)
      return this.cache.get(key)
    }
    const result = this.service.fetchData(key)
    this.cache.set(key, result)
    return result
  }
}

// Usage — client doesn't know it's using a proxy
const service = new CachingProxy(new ExpensiveService())
service.fetchData('user:123')  // Fetching from DB
service.fetchData('user:123')  // Cache hit
```

**Use when:** Lazy loading, caching, access control, logging

---

### Behavioral Patterns

#### Observer
> Define a one-to-many dependency so when one object changes, all dependents are notified.

```javascript
class EventEmitter {
  constructor() {
    this.listeners = new Map()
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
    return this
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event) || []
    this.listeners.set(event, callbacks.filter(cb => cb !== callback))
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event) || []
    callbacks.forEach(cb => cb(data))
  }
}

// Usage: Order system
const orderEvents = new EventEmitter()

orderEvents.on('order:placed', ({ orderId }) => {
  console.log(`Send confirmation email for order ${orderId}`)
})

orderEvents.on('order:placed', ({ orderId }) => {
  console.log(`Notify warehouse for order ${orderId}`)
})

orderEvents.on('order:placed', ({ orderId }) => {
  console.log(`Update analytics for order ${orderId}`)
})

orderEvents.emit('order:placed', { orderId: 'ORD-001' })
// All 3 handlers fire
```

**Use when:** Event systems, pub/sub, UI state management, notifications

---

#### Strategy
> Define a family of algorithms, encapsulate each one, make them interchangeable.

```javascript
// Sorting strategies
class BubbleSort {
  sort(arr) {
    const a = [...arr]
    for (let i = 0; i < a.length; i++)
      for (let j = 0; j < a.length - i - 1; j++)
        if (a[j] > a[j+1]) [a[j], a[j+1]] = [a[j+1], a[j]]
    return a
  }
}

class QuickSort {
  sort(arr) {
    if (arr.length <= 1) return arr
    const pivot = arr[arr.length - 1]
    const left = arr.slice(0, -1).filter(x => x <= pivot)
    const right = arr.slice(0, -1).filter(x => x > pivot)
    return [...this.sort(left), pivot, ...this.sort(right)]
  }
}

class Sorter {
  constructor(strategy) {
    this.strategy = strategy
  }

  setStrategy(strategy) {
    this.strategy = strategy
  }

  sort(arr) {
    return this.strategy.sort(arr)
  }
}

// Usage
const sorter = new Sorter(new QuickSort())
sorter.sort([3, 1, 4, 1, 5])

// Swap strategy at runtime
sorter.setStrategy(new BubbleSort())
sorter.sort([3, 1, 4, 1, 5])
```

**Use when:** Multiple algorithms for same task, runtime algorithm selection

---

#### Command
> Encapsulate a request as an object, enabling undo/redo.

```javascript
class TextEditor {
  constructor() {
    this.text = ''
    this.history = []
  }

  execute(command) {
    command.execute(this)
    this.history.push(command)
  }

  undo() {
    const command = this.history.pop()
    if (command) command.undo(this)
  }
}

class InsertCommand {
  constructor(text) { this.text = text }
  execute(editor) { editor.text += this.text }
  undo(editor) { editor.text = editor.text.slice(0, -this.text.length) }
}

class DeleteCommand {
  constructor(n) { this.n = n; this.deleted = '' }
  execute(editor) {
    this.deleted = editor.text.slice(-this.n)
    editor.text = editor.text.slice(0, -this.n)
  }
  undo(editor) { editor.text += this.deleted }
}

// Usage
const editor = new TextEditor()
editor.execute(new InsertCommand('Hello'))
editor.execute(new InsertCommand(' World'))
console.log(editor.text)  // Hello World
editor.undo()
console.log(editor.text)  // Hello
```

**Use when:** Undo/redo, transaction queues, macro recording

---

## 🏗️ Common LLD Interview Problems

### 1. Parking Lot

```javascript
// Entities: ParkingLot, Floor, Spot, Vehicle, Ticket

class Vehicle {
  constructor(plate, type) {
    this.plate = plate
    this.type = type  // 'bike', 'car', 'truck'
  }
}

class ParkingSpot {
  constructor(id, type) {
    this.id = id
    this.type = type  // 'small', 'medium', 'large'
    this.vehicle = null
  }

  isAvailable() { return this.vehicle === null }

  canFit(vehicle) {
    const fits = { small: ['bike'], medium: ['bike', 'car'], large: ['bike', 'car', 'truck'] }
    return fits[this.type].includes(vehicle.type)
  }

  park(vehicle) { this.vehicle = vehicle }
  vacate() { this.vehicle = null }
}

class ParkingFloor {
  constructor(floorNum, spots) {
    this.floorNum = floorNum
    this.spots = spots
  }

  findAvailableSpot(vehicle) {
    return this.spots.find(s => s.isAvailable() && s.canFit(vehicle)) || null
  }
}

class ParkingTicket {
  constructor(vehicle, spot, floor) {
    this.id = `TKT-${Date.now()}`
    this.vehicle = vehicle
    this.spot = spot
    this.floor = floor
    this.entryTime = new Date()
    this.exitTime = null
  }

  checkout() {
    this.exitTime = new Date()
    this.spot.vacate()
    return this.#calculateFee()
  }

  #calculateFee() {
    const hours = Math.ceil((this.exitTime - this.entryTime) / 3600000)
    const rates = { small: 20, medium: 40, large: 60 }
    return hours * rates[this.spot.type]
  }
}

class ParkingLot {
  constructor(floors) {
    this.floors = floors
    this.activeTickets = new Map()
  }

  park(vehicle) {
    for (const floor of this.floors) {
      const spot = floor.findAvailableSpot(vehicle)
      if (spot) {
        spot.park(vehicle)
        const ticket = new ParkingTicket(vehicle, spot, floor)
        this.activeTickets.set(ticket.id, ticket)
        return ticket
      }
    }
    throw new Error('Parking lot is full')
  }

  checkout(ticketId) {
    const ticket = this.activeTickets.get(ticketId)
    if (!ticket) throw new Error('Invalid ticket')
    const fee = ticket.checkout()
    this.activeTickets.delete(ticketId)
    return fee
  }
}
```

---

### 2. Elevator System

```javascript
// Entities: ElevatorSystem, Elevator, Request, Direction

class Request {
  constructor(floor, direction) {
    this.floor = floor
    this.direction = direction  // 'up' | 'down'
  }
}

class Elevator {
  constructor(id, totalFloors) {
    this.id = id
    this.currentFloor = 0
    this.direction = 'idle'  // 'up' | 'down' | 'idle'
    this.destinations = new Set()
    this.totalFloors = totalFloors
  }

  addDestination(floor) {
    this.destinations.add(floor)
    this.#updateDirection()
  }

  move() {
    if (this.destinations.size === 0) {
      this.direction = 'idle'
      return
    }

    if (this.direction === 'up') {
      this.currentFloor++
    } else if (this.direction === 'down') {
      this.currentFloor--
    }

    if (this.destinations.has(this.currentFloor)) {
      this.destinations.delete(this.currentFloor)
      console.log(`Elevator ${this.id} stopped at floor ${this.currentFloor}`)
    }

    this.#updateDirection()
  }

  #updateDirection() {
    if (this.destinations.size === 0) {
      this.direction = 'idle'
      return
    }
    const maxDest = Math.max(...this.destinations)
    const minDest = Math.min(...this.destinations)
    if (this.direction === 'up' && maxDest > this.currentFloor) return
    if (this.direction === 'down' && minDest < this.currentFloor) return
    this.direction = maxDest > this.currentFloor ? 'up' : 'down'
  }

  distanceTo(floor) {
    return Math.abs(this.currentFloor - floor)
  }
}

class ElevatorSystem {
  constructor(numElevators, totalFloors) {
    this.elevators = Array.from({ length: numElevators },
      (_, i) => new Elevator(i, totalFloors))
  }

  // Dispatch: find nearest idle or same-direction elevator
  dispatch(request) {
    const best = this.elevators
      .filter(e => e.direction === 'idle' ||
                   e.direction === request.direction)
      .sort((a, b) => a.distanceTo(request.floor) - b.distanceTo(request.floor))[0]
      || this.elevators.sort((a, b) =>
           a.distanceTo(request.floor) - b.distanceTo(request.floor))[0]

    best.addDestination(request.floor)
    return best
  }
}
```

---

### 3. Rate Limiter

```javascript
// Token Bucket Algorithm

class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity      // Max tokens
    this.tokens = capacity        // Current tokens
    this.refillRate = refillRate  // Tokens per second
    this.lastRefill = Date.now()
  }

  #refill() {
    const now = Date.now()
    const elapsed = (now - this.lastRefill) / 1000
    const newTokens = elapsed * this.refillRate
    this.tokens = Math.min(this.capacity, this.tokens + newTokens)
    this.lastRefill = now
  }

  consume(tokens = 1) {
    this.#refill()
    if (this.tokens >= tokens) {
      this.tokens -= tokens
      return true  // Allowed
    }
    return false  // Rate limited
  }
}

class RateLimiter {
  constructor(capacity, refillRate) {
    this.capacity = capacity
    this.refillRate = refillRate
    this.buckets = new Map()  // userId → TokenBucket
  }

  isAllowed(userId) {
    if (!this.buckets.has(userId)) {
      this.buckets.set(userId, new TokenBucket(this.capacity, this.refillRate))
    }
    return this.buckets.get(userId).consume()
  }
}

// Usage: 10 requests/sec per user
const limiter = new RateLimiter(10, 10)
console.log(limiter.isAllowed('user1'))  // true
```

---

## 📊 Design Pattern Quick Reference

| Pattern | Category | Use When |
|---------|----------|----------|
| Singleton | Creational | One instance needed (DB, Logger) |
| Factory | Creational | Object creation varies by type |
| Builder | Creational | Complex object with many options |
| Adapter | Structural | Incompatible interfaces |
| Decorator | Structural | Add behavior dynamically |
| Proxy | Structural | Control access (cache, auth) |
| Observer | Behavioral | One-to-many event notification |
| Strategy | Behavioral | Interchangeable algorithms |
| Command | Behavioral | Undo/redo, queued operations |

---

## ⚠️ Common LLD Mistakes

| Mistake | Fix |
|---------|-----|
| God class (one class does everything) | Apply SRP, split responsibilities |
| Hardcoded dependencies | Use dependency injection |
| No interfaces/abstractions | Program to interfaces, not implementations |
| Inheritance over composition | Prefer composition for flexibility |
| Ignoring thread safety | Mention locks/atomic ops for shared state |
| Over-engineering | Start simple, add patterns only when needed |

---

## 🎯 Interview Tips

1. **Start with entities** — list all nouns from the problem
2. **Draw the class diagram first** — relationships before code
3. **Apply patterns naturally** — don't force them
4. **Mention extensibility** — "If we add X later, we'd just..."
5. **Talk about thread safety** — especially for Singleton, shared state
6. **Keep it simple** — interviewers want clean code, not clever code

---

## 🔗 Related Resources

- [System Design Guide](SystemDesignGuide.md)
- [API Design Patterns](APIDesignPatterns.md)
