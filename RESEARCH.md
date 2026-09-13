# LLD Practice Platform — Research Note

## 1. Research Objective

The goal of this research was to understand how existing Low-Level Design (LLD) and Object-Oriented Design (OOD) learning resources structure practice problems, what learners are expected to produce, and where a focused practice platform could provide additional value.

The research focused on:

- Existing LLD/OOD practice platforms
- Common LLD problem formats
- How solutions are evaluated
- Feedback and learning workflows
- Opportunities for a focused practice-and-feedback product

---

## 2. Existing Resources Reviewed

### DesignGurus — Grokking the Object-Oriented Design Interview

DesignGurus provides a structured OOD/LLD learning experience with case studies such as Parking Lot, Elevator, ATM, Vending Machine, Chess, Movie Ticket Booking and other systems.

A recurring workflow is:

Requirements → Use Cases → Class Design → Relationships → Implementation

The platform also covers UML, SOLID principles and design patterns.

Source:
https://www.designgurus.io/course/grokking-the-object-oriented-design-interview

### Educative — LLD Interview Preparation

Educative's LLD preparation material emphasizes that LLD interviews evaluate software structure rather than only syntactically correct code. Important areas include responsibilities, abstractions, extensibility and maintainability.

Source:
https://www.educative.io/blog/how-to-prepare-for-low-level-design-questions-in-tech-interviews

### LeetCode Community Discussions

LeetCode's community contains discussions and collections of frequently practiced LLD/OOD questions.

Common examples include:

- Parking Lot
- Elevator
- Library Management
- Food Ordering
- Chess
- File Systems
- Booking systems
- Notification systems

These discussions also show that learners often look for resources containing both questions and explanatory solutions.

Source:
https://leetcode.com/discuss/post/125315/how-should-i-practice-oo-design-questions/

---

## 3. Common Practice Pattern

Across the resources reviewed, LLD practice is generally open-ended rather than based on one exact implementation.

A typical problem asks the learner to:

1. Clarify requirements
2. Identify important entities/classes
3. Assign responsibilities
4. Define relationships
5. Apply appropriate abstractions
6. Consider extensibility
7. Handle edge cases
8. Explain design decisions
9. Implement or communicate the design

This is important because an LLD problem normally has multiple reasonable solutions.

Therefore, an evaluation system should avoid treating one fixed class diagram as the only correct answer.

---

## 4. Problems Identified in Existing Practice

The research suggests several gaps in a typical LLD learning workflow.

### Problem 1 — Practice is separated from feedback

Many resources provide worked solutions or explanations, but the learner still has to compare their own design manually.

This creates a gap between:

"Attempting a problem"

and

"Understanding how my design could improve."

### Problem 2 — Open-ended designs are difficult to evaluate

LLD does not always have one correct answer.

For example, two designs may use different classes or patterns while both being valid.

Therefore, evaluation should focus on design qualities and evidence rather than exact structural matching.

### Problem 3 — Learners need actionable feedback

A simple score such as "7/10" is not sufficient.

Useful feedback should explain:

- What the learner did well
- Which requirement was missed
- Which responsibility is unclear
- What design decision could be improved
- What the learner should try next

### Problem 4 — Repeated practice is important

LLD skills improve through solving different problems and revisiting previous designs.

Therefore, attempt history can become an important part of the learning loop.

---

## 5. Key Evaluation Dimensions

Based on the research and the assignment requirements, the platform focuses evaluation on:

### Requirement Understanding

Does the learner identify important functional requirements and assumptions?

### Class Responsibilities

Are domain classes meaningful and are their responsibilities clearly defined?

### Coupling and Cohesion

Are responsibilities appropriately distributed instead of creating overly large or tightly coupled classes?

### Encapsulation and Abstraction

Does the design hide implementation details and expose meaningful interfaces?

### Design Reasoning

Does the learner explain why particular relationships, abstractions or patterns were selected?

### Extensibility

Can the design accommodate reasonable future requirements without major restructuring?

### Edge Cases

Does the design consider invalid states and important operational scenarios?

### Explanation Quality

Does the learner communicate enough reasoning for another engineer to understand and review the design?

These dimensions align with the assignment's recommended evaluation approach. :contentReference[oaicite:1]{index=1}

---

## 6. Product Opportunity

The research suggests an opportunity for a focused product that sits between:

- Passive LLD learning resources
- Coding platforms
- Interview preparation

The proposed platform focuses on an iterative practice loop:

Choose Problem
      ↓
Design Solution
      ↓
Submit
      ↓
Receive Feedback
      ↓
Review
      ↓
Try Again

Instead of only showing an ideal solution, the platform evaluates the learner's own reasoning and gives feedback that can be used in the next attempt.

---

## 7. Product Decisions Derived from Research

### Decision 1 — Text-first submissions

Text is used for the MVP because it allows learners to communicate:

- Requirements
- Assumptions
- Classes
- Responsibilities
- Design reasoning
- Edge cases

A future version can add UML/class diagrams or code submissions.

### Decision 2 — Criterion-based feedback

Instead of returning only a total score, the platform provides criterion-level feedback.

Each criterion contains:

- Score
- Evidence
- Concern
- Suggestion
- Confidence

This makes the evaluation more useful and explainable.

### Decision 3 — Multiple evaluation strategies

The system should not permanently depend on one evaluator.

The current MVP uses deterministic rule-based evaluation because it is fast, predictable and testable.

Future versions can introduce:

- AI evaluation
- Human review
- Code-based evaluation

without changing the main practice workflow.

### Decision 4 — Attempt history

Previous attempts are stored so learners can review their progress and repeat problems after receiving feedback.

---

## 8. Research Conclusion

Existing LLD resources provide strong problem sets, explanations and structured design methods. However, LLD remains difficult to practice because solutions are open-ended and feedback on an individual's own design is less straightforward than automated feedback for conventional coding problems.

The proposed platform focuses on this gap by making feedback part of the practice loop.

The key product principle is:

> Don't just show the learner the answer. Help the learner understand their own design.

The MVP therefore prioritizes:

- Small but useful problem set
- Fast submission
- Explainable evaluation
- Actionable feedback
- Attempt history
- Repeatable practice

This keeps the product focused while leaving room for richer AI evaluation, diagrams, code submissions and expert review in future versions.