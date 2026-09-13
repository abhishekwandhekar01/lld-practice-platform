# LLD Practice Platform — Design Note

## 1. Overview

The LLD Practice Platform is a focused learning system that allows users to practice Low-Level Design problems, submit their solutions, receive structured feedback, and review previous attempts.

The core practice loop is:

Choose Problem → Think/Design → Submit → Get Feedback → Review → Try Again.

The MVP is implemented as a simple monolithic web application to keep the architecture understandable and allow the majority of development effort to remain focused on the LLD/domain model and evaluation experience.

---

## 2. MVP Scope

The MVP provides:

- A collection of LLD practice problems
- Problem descriptions, requirements and difficulty levels
- A practice interface for writing a design solution
- Submission of solutions
- Automatic evaluation
- Structured feedback across multiple criteria
- Attempt history
- Individual attempt review
- Evaluation score and detailed suggestions
- API validation and error handling
- Automated backend tests

The system intentionally avoids authentication, microservices and unnecessary infrastructure because these are outside the core LLD practice problem.

---

## 3. User Flow

### Step 1 — Choose a Problem

The learner views available LLD problems and can filter problems by difficulty or search by name.

### Step 2 — Practice

The learner opens a problem and prepares a solution covering:

- Requirements and assumptions
- Classes and responsibilities
- Design and reasoning
- Edge cases and extensibility

### Step 3 — Submit

The solution is sent to the backend as an attempt associated with the selected problem.

The backend validates:

- Problem ID is present
- Submission is not empty
- Problem exists

### Step 4 — Evaluation

The evaluator analyses the submitted solution against predefined evaluation criteria.

The current MVP uses a deterministic rule-based evaluator. It checks for relevant requirements, domain classes, design concepts and edge-case considerations.

### Step 5 — Feedback

The learner receives:

- Overall score
- Criterion-wise score
- Evidence
- Concerns
- Suggestions
- Confidence

### Step 6 — Review

Previous attempts can be viewed from the attempt history. This allows the learner to compare their work and use feedback for another practice attempt.

---

## 4. Domain Model

The main domain entities are:

### Problem

Represents an LLD question available for practice.

Responsibilities:

- Store problem title
- Store unique slug
- Store description
- Store requirements/context
- Store difficulty
- Maintain relationship with attempts

### Attempt

Represents one solution submitted by a learner for a problem.

Responsibilities:

- Store the submitted solution
- Associate the solution with a problem
- Track submission status
- Store creation and submission timestamps
- Associate the attempt with its evaluation

Attempt states are:

- SUBMITTED
- EVALUATING
- COMPLETED
- FAILED

### Evaluation

Represents the result of evaluating an attempt.

Responsibilities:

- Store total score
- Track evaluation status
- Store completion time
- Maintain feedback items for the evaluation

Evaluation states are:

- EVALUATING
- COMPLETED
- FAILED

### Feedback

Represents detailed feedback for one evaluation criterion.

Each feedback item contains:

- Criterion
- Score
- Maximum score
- Evidence
- Concern
- Suggestion
- Confidence

This structure keeps the evaluation result explainable instead of returning only a single score.

---

## 5. Relationships

The main relationships are:

Problem 1 ──── * Attempt

Attempt 1 ──── 0..1 Evaluation

Evaluation 1 ──── * Feedback

This allows one problem to have many attempts while each attempt can have one evaluation containing multiple feedback criteria.

The database uses Prisma ORM with SQLite for the MVP.

---

## 6. Evaluation Approach

The evaluation is divided into four criteria:

### Requirements & Assumptions — 20 points

Checks whether important functional requirements and assumptions have been identified.

### Classes & Responsibilities — 30 points

Checks whether relevant domain classes and responsibilities have been identified.

### Design & Reasoning — 30 points

Checks for useful design concepts such as:

- Interfaces
- Abstraction
- Encapsulation
- Composition
- Polymorphism
- Strategy
- Factory
- Relationships
- Extensibility

### Edge Cases & Extensibility — 20 points

Checks whether the solution considers scenarios such as:

- Full capacity
- Unavailable resources
- Invalid operations
- Invalid tickets
- Exit handling
- Future extensions

Total score = 100 points.

---

## 7. Why Deterministic Evaluation for the MVP?

A deterministic evaluator was selected for the first version because it provides:

- Consistent results
- Fast feedback
- Explainable scoring
- No external AI dependency
- Easy local testing
- Predictable behaviour

The evaluator does not claim that there is only one correct LLD design. Instead, it looks for evidence that important design considerations have been addressed.

For example, mentioning composition is treated as evidence of a design consideration, but the system can still be extended later to provide deeper reasoning-based feedback.

### Limitation

Keyword/rule-based evaluation cannot fully understand the quality of an arbitrary LLD design.

Therefore, the current evaluator is intentionally treated as an MVP evaluation mechanism rather than a complete replacement for expert review.

---

## 8. Extensibility

The design keeps the practice flow separate from the evaluation result.

The current flow is:

Submission → Evaluation → Feedback

A future version can introduce an evaluator abstraction such as:

    Evaluator
       |
       +-- RuleBasedEvaluator
       |
       +-- AIEvaluator
       |
       +-- HumanEvaluator

This would allow the evaluation mechanism to change without changing the learner's practice flow.

Similarly, the current submission is stored as text. A future version could support:

- Class diagrams
- UML diagrams
- Code submissions
- Multiple submission formats

without changing the core Problem → Attempt → Evaluation relationship.

---

## 9. Handling Evaluation Failure

The domain model supports explicit evaluation states:

EVALUATING → COMPLETED

or

EVALUATING → FAILED

This allows the submission to remain stored even if evaluation fails.

For the current MVP, evaluation is performed synchronously because the rule-based evaluator is fast.

If evaluation becomes AI-based or computationally expensive, the evaluation step can be moved to an asynchronous worker/queue while retaining the same state model.

The learner would then see:

Submitted → Evaluating → Completed/Failed

This prevents a slow evaluator from becoming tightly coupled to the submission request.

---

## 10. API Design

The backend exposes REST APIs for the main practice flow.

### Problems

`GET /api/problems`

Returns available problems.

`GET /api/problems/:slug`

Returns a specific problem.

### Attempts

`POST /api/attempts`

Creates a new attempt and evaluates the submission.

`GET /api/attempts`

Returns previous attempts.

`GET /api/attempts/:id`

Returns one attempt together with its evaluation and feedback.

### Health

`GET /api/health`

Provides a simple API health check.

---

## 11. Error Handling

The backend handles common invalid cases explicitly.

Examples:

- Missing problem ID → HTTP 400
- Empty submission → HTTP 400
- Unknown problem → HTTP 404
- Unknown attempt → HTTP 404
- Unexpected server/database error → HTTP 500

This prevents invalid requests from silently creating inconsistent data.

---

## 12. Testing Strategy

The backend includes automated API tests using Jest and Supertest.

Important behaviours tested include:

- API health check
- Problem listing
- Problem retrieval
- Unknown problem handling
- Missing submission validation
- Invalid problem handling
- Attempt creation
- Automatic evaluation
- Structured feedback generation
- Attempt history
- Individual attempt retrieval
- Unknown attempt handling

The current test suite contains 10 passing tests.

---

## 13. Design Trade-offs

### Simple Monolith vs Microservices

A monolithic backend was selected because the assignment focuses on LLD/domain design rather than distributed systems.

This reduces unnecessary infrastructure while keeping the core domain model clear.

### SQLite vs Production Database

SQLite was selected because the MVP requires a lightweight persistent database and does not require distributed database infrastructure.

A production deployment could move to PostgreSQL without changing the core domain relationships.

### Rule-Based Evaluation vs LLM Evaluation

Rule-based evaluation was selected for the MVP because it is deterministic, fast and easy to test.

An AI evaluator can be added later behind an evaluator abstraction for richer reasoning-based feedback.

### Text Submission vs Multiple Formats

Text was selected because it is the fastest format that still allows the learner to communicate requirements, classes, responsibilities, reasoning and edge cases.

Diagram/code submission can be introduced later.

---

## 14. Key Design Principle

The most important design decision is keeping the learner's practice workflow independent from the evaluation mechanism.

The system therefore follows:

Problem
   ↓
Attempt
   ↓
Evaluation
   ↓
Feedback

This allows different evaluation strategies and submission formats to evolve independently while keeping the core learning loop stable.