# Amazon - Behavioral Interview Guide

## 🎯 Amazon Interview Overview

**Format:**
- 5-7 rounds (1 phone screen + 4-6 onsite/virtual + 1 "Bar Raiser")
- **Behavioral**: 40-50% of total interview (HIGHEST among FAANG)
- **Technical**: 50-60%
- **Duration**: 60 min per round

**Unique Features:**
- **Bar Raiser**: Independent interviewer ensures high hiring bar
- **Loop Interview**: Each interviewer tests different Leadership Principles (LPs)
- **16 Leadership Principles**: Must prepare stories for ALL 16

---

## 🌟 Amazon's 16 Leadership Principles (LPs)

### 1. **Customer Obsession** 👥
**Definition:** Leaders start with customer and work backwards.

**Example Questions:**
- "Tell me about a time you went above and beyond for a customer"
- "Describe a time you had to make a decision between customer and business"

**Good Story:**
```
S: E-commerce site, user complained checkout too complex (7 steps)
T: Simplify without sacrificing security
A:
- Interviewed 20 customers, found: frustrated with account creation
- Implemented guest checkout (reduced to 3 steps)
- Added optional account creation AFTER purchase
- Monitored: did guest checkout hurt repeat customers?
R: 
📊 Checkout completion: 65% → 85%
📊 Repeat purchases actually INCREASED 10% (less friction)
📊 Customer satisfaction: +30%
Learning: Customer experience > forcing account creation
```

---

### 2. **Ownership** 💪
**Definition:** Think long term, act on behalf of entire company, never say "that's not my job".

**Example Questions:**
- "Give an example of when you took on something outside your responsibility"
- "Tell me about a time you made a decision that wasn't popular"

**Good Story:**
```
S: Production bug in payment service (not my team), causing $50K/hour revenue loss
T: Fix it ASAP, can't wait for owning team (they're asleep)
A:
- Debugged issue myself (ownership, not "not my job")
- Found: timeout in third-party API
- Implemented retry logic with exponential backoff
- Deployed hotfix in 2 hours
- Wrote detailed post-mortem for owning team
- Created monitoring alert to catch similar issues
R: 
📊 Revenue loss stopped
📊 Prevented future timeouts (retry logic)
📊 Owning team grateful, adopted my monitoring
Learning: Ownership means solving problem, not assigning blame
```

---

### 3. **Invent and Simplify** 💡
**Definition:** Expect and require innovation and invention. Simplify to stay agile.

**Example Questions:**
- "Tell me about a time you invented something"
- "Describe how you simplified a complex process"

**Good Story:**
```
S: Deployment process took 2 hours, required 20 manual steps (complex!)
T: Simplify and automate
A:
- Mapped all 20 steps, identified: 15 can be automated
- Built deployment script (Bash + Python)
- Added validation checks, rollback mechanism
- Reduced manual steps: 20 → 5 (only approval steps)
R:
📊 Deployment time: 2 hours → 15 minutes (88% faster)
📊 Human errors: 30% → 0%
📊 Team velocity: +40% (more frequent releases)
Learning: Complexity is enemy of speed, automate repetitive tasks
```

---

### 4. **Are Right, A Lot** 🎯
**Definition:** Strong judgment and good instincts, seek diverse perspectives.

**Example Questions:**
- "Tell me about a time you were wrong"
- "Describe a decision you made with limited information"

**Good Story (Important: Also show when WRONG):**
```
S: Choosing database for new service (PostgreSQL vs MongoDB)
T: Make right technical decision
A:
- My instinct: MongoDB (I used it before, comfortable)
- But... sought diverse perspectives (asked 3 senior engineers)
- One argued: "Your data is relational, SQL is better"
- I researched: found they were right (joins, ACID needed)
- Changed my mind, chose PostgreSQL
R:
📊 Right decision: complex queries 10x faster than MongoDB would be
📊 Saved future migration pain
Learning: Ego is enemy of right decisions, seek diverse perspectives

✅ Why good: Shows "Are Right, A Lot" by admitting when WRONG and seeking input
```

---

### 5. **Learn and Be Curious** 📚
**Definition:** Never done learning, always curious about new possibilities.

**Example Questions:**
- "Tell me about a time you learned a new skill to complete a project"
- "How do you keep your technical skills current?"

**Good Story:**
```
S: Project required Kubernetes, I had 0 experience
T: Learn K8s in 2 weeks to deploy microservices
A:
- Week 1: Read official K8s docs, took online course (Udemy)
- Week 1: Built local cluster (minikube), deployed Hello World
- Week 2: Deployed our microservices to staging K8s cluster
- Week 2: Paired with DevOps engineer (learned best practices)
- Asked lots of questions, took notes
R:
📊 Successfully deployed 5 microservices to production
📊 Became team's K8s expert (mentored 3 teammates)
📊 Now contribute to K8s open source
Learning: Learn by doing, leverage experts, stay curious
```

---

### 6. **Hire and Develop the Best** 🎓
**Definition:** Raise performance bar with every hire, develop leaders.

**Example Questions:**
- "Tell me about a time you mentored someone"
- "How do you develop other people?"

**Good Story:**
```
S: Junior engineer struggled with code quality (many bugs in PRs)
T: Help them improve without hurting confidence
A:
- Scheduled weekly 1:1 pairing sessions (not just code reviews)
- Shared my code review checklist (taught HOW to self-review)
- Gave them small, well-defined tasks (build confidence)
- Gradually increased complexity
- Praised improvements publicly, criticized privately
R:
📊 Bug rate: 80% → 10% in 3 months
📊 They became senior engineer 1 year later
📊 Now they mentor others using my techniques
Learning: Mentorship is investment in long-term team strength
```

---

### 7. **Insist on the Highest Standards** ⭐
**Definition:** Relentlessly high standards, deliver quality products.

**Example Questions:**
- "Tell me about a time you refused to compromise on quality"
- "Describe how you maintain high standards in your work"

**Good Story:**
```
S: PM wanted to ship feature before testing thoroughly (deadline pressure)
T: Ship on time BUT maintain quality
A:
- Pushed back: "Shipping buggy feature hurts customers more than delay"
- Proposed: Ship MVP (core features) on time, add enhancements later
- Insisted on testing: wrote 50 unit tests, 10 integration tests
- Found 3 critical bugs during testing (would've been production issues)
R:
📊 Shipped on time with 95% test coverage
📊 0 critical bugs in production
📊 Feature adoption: 80% (vs typical 50% for buggy launches)
Learning: Shortcuts = technical debt, high standards = happy customers
```

---

### 8. **Think Big** 🚀
**Definition:** Thinking small is self-fulfilling prophecy, bold direction inspires results.

**Example Questions:**
- "Tell me about a time you proposed a non-obvious solution"
- "Describe your most ambitious project"

**Good Story:**
```
S: Team built features one-by-one (incremental approach)
T: Think bigger - what if we rebuilt the entire platform?
A:
- Proposed: Migrate monolith → microservices (teams said "too risky")
- Created detailed migration plan (6 months, incremental)
- Built business case: 10x scalability, 50% faster deployments
- Got buy-in from VP by showing long-term vision
- Led team of 8 engineers
R:
📊 Successfully migrated in 5 months (1 month early)
📊 Deployments: 1/week → 10/day
📊 Scalability: 10K users → 500K users
📊 Team velocity: +200%
Learning: Think big, but execute incrementally
```

---

### 9. **Bias for Action** ⚡
**Definition:** Speed matters in business, many decisions reversible, calculated risk-taking valued.

**Example Questions:**
- "Tell me about a time you took a calculated risk"
- "Describe a decision you made with incomplete data"

**Good Story:**
```
S: Database server at 90% capacity, could crash anytime
T: Scale up quickly before crash
A:
- Option 1: Spend 2 weeks analyzing perfect solution (too slow)
- Option 2: Add read replica NOW, optimize later (bias for action)
- Chose option 2: Deployed read replica in 4 hours
- Monitored: capacity went to 60%
- Bought time to plan long-term solution (database sharding)
R:
📊 0 downtime
📊 Bought 3 months to implement proper scaling
📊 Prevented potential $500K revenue loss
Learning: Reversible decisions should be made quickly, buy time for irreversible ones
```

---

### 10. **Frugality** 💰
**Definition:** Accomplish more with less, constraints breed resourcefulness.

**Example Questions:**
- "Tell me about a time you accomplished something with limited resources"
- "Describe how you optimized costs in a project"

**Good Story:**
```
S: Manager: "We need better server monitoring" (proposed $50K/year tool)
T: Achieve same goal with lower cost
A:
- Researched: found open-source alternative (Prometheus + Grafana = free)
- Time investment: 1 week to set up vs $50K/year ongoing cost
- Built custom dashboards (learned on the job)
- Result: Same features as $50K tool
R:
💰 Cost: $50K/year → $0 (100% savings)
📊 Monitoring quality: Same or better
📊 Team learned new skills
Learning: Frugality != cheap, it's being resourceful and scrappy
```

---

### 11. **Earn Trust** 🤝
**Definition:** Listen attentively, speak candidly, treat others respectfully.

**Example Questions:**
- "Tell me about a time you earned trust of a stakeholder"
- "Describe a time you had to deliver bad news"

**Good Story:**
```
S: Promised feature to client by end of month, became clear we'd miss deadline
T: Deliver bad news while maintaining trust
A:
- Called client immediately (transparency, don't hide bad news)
- Explained: "We underestimated complexity, need 2 more weeks"
- Offered: Ship partial feature now OR wait 2 weeks for complete
- Client appreciated honesty, chose to wait
- Delivered 2 weeks later, exceeded expectations (added bonus features)
R:
📊 Client renewed contract (signed for 2 more years)
📊 Became our biggest advocate (referred 3 new clients)
Learning: Trust = transparency + delivery, admit mistakes early
```

---

### 12. **Dive Deep** 🔍
**Definition:** Operate at all levels, stay connected to details.

**Example Questions:**
- "Tell me about a time you found a non-obvious solution by digging deep"
- "Describe how you debugged a complex problem"

**Good Story:**
```
S: API latency suddenly increased from 50ms → 500ms (10x worse)
T: Find root cause
A:
- Shallow investigation: "Database is slow" (surface-level)
- Dove deep: Checked query logs, profiled queries
- Found: 1 new query doing full table scan (no index!)
- Checked Git history: Recent feature added this query
- Created index on that column
- Monitored: latency back to normal
R:
📊 Latency: 500ms → 50ms (fixed)
📊 Time to resolution: 2 hours (diving deep paid off)
Learning: Don't accept surface-level explanations, dig until root cause found
```

---

### 13. **Have Backbone; Disagree and Commit** 💬
**Definition:** Respectfully challenge decisions, commit wholly once decision made.

**Example Questions:**
- "Tell me about a time you disagreed with your manager"
- "Describe a time you had to commit to a decision you disagreed with"

**Good Story:**
```
S: Manager wanted to rewrite entire codebase (6 months project)
T: Disagree respectfully, but commit if overruled
A:
- Disagreed: "Rewrite is risky, let's refactor incrementally"
- Presented data: 80% of rewrites fail, take 2x longer than estimated
- Proposed alternative: Refactor one module at a time
- Manager heard me but decided to proceed with rewrite
- I committed 100% (disagree and commit!)
- Led rewrite effort with full energy
R:
📊 Rewrite succeeded (took 8 months, not 6, but worked)
📊 I was wrong - fresh start enabled new features
📊 Relationship with manager stronger (trusted my commitment)
Learning: Speak up when disagree, but commit once decided
```

---

### 14. **Deliver Results** 🎯
**Definition:** Focus on key inputs, deliver them with right quality and in timely fashion.

**Example Questions:**
- "Tell me about a time you delivered results under pressure"
- "Describe a goal you failed to meet"

**Good Story:**
```
S: Critical feature needed for client demo (1 week away), team had 3 weeks of work
T: Deliver something valuable in 1 week
A:
- Prioritized ruthlessly: Must-have vs nice-to-have
- Identified: 30% of work delivers 80% of value
- Cut scope: Shipped core feature, deferred enhancements
- Worked extra hours (3 late nights)
- Communicated daily: stakeholders knew status
R:
📊 Shipped on time for client demo
📊 Client signed contract (worth $2M)
📊 Shipped deferred features 2 weeks later
Learning: Delivery beats perfection, prioritize ruthlessly

❌ Bad Answer (Also prepare failure story):
"I missed deadline because..." → must show learning and improvement
```

---

### 15. **Strive to be Earth's Best Employer** 🌍
**Definition:** Create safer, productive, higher-performing, diverse, just work environment.

**Example Questions:**
- "Tell me about a time you improved team morale or culture"
- "How do you create inclusive environment?"

**Good Story:**
```
S: Team morale low after 3 months of crunch time
T: Improve morale without reducing output
A:
- Organized team retrospective (safe space for feedback)
- Identified: Lack of work-life balance, no recognition
- Created "No Meeting Fridays" (focus time)
- Started weekly recognition shoutouts
- Pushed back on unrealistic deadlines from PM
R:
📊 Employee satisfaction: 60% → 85%
📊 Turnover: 30% → 5%
📊 Productivity actually INCREASED 20% (happier = more productive)
Learning: Best employer = sustainable pace + recognition
```

---

### 16. **Success and Scale Bring Broad Responsibility** 🌎
**Definition:** Impact on communities, planet, future generations.

**Example Questions:**
- "Tell me about a time you considered broader impact of your work"
- "How do you think about sustainability?"

**Good Story:**
```
S: Building feature that would increase server costs by 50%
T: Deliver feature while being environmentally responsible
A:
- Optimized code to reduce CPU usage (50% reduction)
- Implemented caching to reduce unnecessary API calls
- Used spot instances (cheaper, greener)
- Measured: Carbon footprint actually DECREASED 10%
R:
📊 Feature shipped successfully
📊 Server costs: Expected +50%, actual -10%
📊 Carbon footprint: -10%
Learning: Efficiency = good for business AND planet
```

---

## 📊 Amazon LP Coverage Matrix

Prepare 12-15 stories that each map to multiple LPs:

| Story | Primary LP | Secondary LP |
|-------|-----------|--------------|
| Optimized checkout | Customer Obsession | Deliver Results |
| Fixed production bug (not my team) | Ownership | Bias for Action |
| Automated deployments | Invent and Simplify | Frugality |
| Chose PostgreSQL over MongoDB | Are Right, A Lot | Learn and Be Curious |
| Learned Kubernetes | Learn and Be Curious | Deliver Results |
| Mentored junior engineer | Hire and Develop | Earn Trust |
| Pushed back on buggy release | Insist on Highest Standards | Have Backbone |
| Migrated to microservices | Think Big | Deliver Results |
| Added read replica under pressure | Bias for Action | Ownership |
| Used Prometheus vs paid tool | Frugality | Invent and Simplify |
| Missed deadline but told client early | Earn Trust | Deliver Results |
| Debugged latency issue | Dive Deep | Insist on Standards |
| Disagreed with manager | Have Backbone | Earn Trust |

---

## ⚠️ Amazon-Specific Do's and Don'ts

### ✅ Do:
- **Map every story to LPs** - "This shows Ownership because..."
- **Use data** - Amazon is metrics-driven
- **Show customer impact** - Always bring it back to customer
- **Prepare 12-15 stories** minimum (cover all 16 LPs)
- **Practice STAR format** - Amazon invented it!
- **Show long-term thinking** - Not just quick wins
- **Admit failures** - Especially for "Deliver Results" (failure story)
- **Say "I" not "we"** - Amazon wants YOUR contribution

### ❌ Don't:
- Skip any LPs (Bar Raiser will notice gaps)
- Only talk about successes (need failure stories too)
- Take all credit ("I" good, but mention team support)
- Focus only on technical (show leadership, people skills)
- Give vague answers (Amazon wants specifics)

---

## 🎯 Questions to Ask Interviewer

**Customer Obsession:**
- "Can you share an example of when your team went above and beyond for a customer?"

**Leadership Principles:**
- "Which Leadership Principles are most important for this team?"
- "How does [specific LP] manifest in your day-to-day work?"

**Impact:**
- "What's the most impactful project this team has shipped recently?"

---

## 💡Pro Tips for Amazon

1. **Learn the 16 LPs by heart** - Interviewers will ask: "Which LP does this show?"

2. **Use the LP language** - Say "This demonstrates Customer Obsession because..."

3. **12-15 stories minimum** - Each story should map to 2-3 LPs

4. **Prepare deep dives** - Amazon interviewers will ask follow-ups for 10+ minutes on ONE story

5. **Customer Obsession is #1** - Most important LP, always bring it back to customer

6. **Failure stories required** - Especially "Deliver Results" - tell me about a deadline you missed

7. **"I" not "we"** - Amazon wants to know YOUR role specifically

8. **Quantify everything** - $X revenue, Y% improvement, Z users impacted

---

## Summary

**Amazon wants:**
- 🎯 Customer-obsessed leaders
- 💪 Owners who solve problems beyond job scope  
- ⭐ High standards maintainers
- 🚀 Big thinkers who deliver results
- ⚡ Action-takers with calculated risks
- 🤝 Trust earners through transparency

**Prepare:**
- **Memorize all 16 Leadership Principles**
- 12-15 stories covering all LPs (some stories hit multiple)
- Practice STAR format religiously
- Prepare deep dives (interviewers dig for 10 min per story)
- **Must have failure stories** (Deliver Results, Are Right A Lot)

**Remember:**
- Bar Raiser interview is hardest - different LP tested
- Each interviewer assigned specific LPs before loop
- 40-50% of interview is behavioral (highest of FAANG)
- LP language is critical - speak Amazon's language

**Next Steps:**
- Review full [Leadership Principles guide](../leadership-principles.md)
- Create [STAR stories](../STAR-stories.md) for all 16 LPs
- Practice saying which LP each story demonstrates
