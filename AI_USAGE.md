# AI Usage

AI tools were used as a development and design assistant during the implementation of the LLD Practice Platform.

The goal was not to delegate the complete solution to AI, but to use it for design exploration, implementation assistance, debugging, testing and documentation.

---

## 1. Domain Model and Entity Structure

### AI suggestion

AI suggested modelling the core workflow around:

- Problem
- Attempt
- Evaluation
- Feedback

with the following relationship:

Problem → Attempt → Evaluation → Feedback

### Decision

Accepted.

### Why

This structure maps directly to the learner's practice workflow and keeps the domain responsibilities separated.

A Problem represents what the learner practices, an Attempt represents one submitted solution, an Evaluation represents the assessment result, and Feedback contains criterion-level observations.

This also makes attempt history and evaluation retrieval straightforward.

---

## 2. Deterministic Evaluation for the MVP

### AI suggestion

AI suggested avoiding an unconstrained AI-generated score for the first version and instead using a deterministic evaluator based on predefined evaluation criteria.

### Decision

Accepted.

### Why

A deterministic evaluator provides:

- Consistent results
- Predictable behaviour
- Easy testing
- No dependency on an external AI API
- Explainable scoring

The evaluator checks four areas:

1. Requirements & Assumptions
2. Classes & Responsibilities
3. Design & Reasoning
4. Edge Cases & Extensibility

The limitation is that keyword/rule-based evaluation cannot completely understand the quality of an arbitrary LLD design. This is treated as an MVP limitation.

A future AI evaluator can provide deeper reasoning-based feedback.

---

## 3. Structured Feedback Instead of Only a Score

### AI suggestion

AI suggested that evaluation should not return only a total score.

Instead, each criterion should contain:

- Score
- Maximum score
- Evidence
- Concern
- Suggestion
- Confidence

### Decision

Accepted.

### Why

LLD solutions are open-ended and multiple designs can be valid.

A single score does not explain how the learner can improve. Criterion-level evidence and suggestions make the evaluation more actionable and explainable.

This also allows the frontend to display feedback as separate sections instead of exposing raw evaluator data.

---

## 4. Text-First Submission Format

### AI suggestion

AI suggested using a structured text submission for the MVP rather than spending significant time implementing UML editors or diagram tooling.

### Decision

Accepted.

### Why

A text submission is sufficient to demonstrate the important LLD concepts required by the assignment.

The submission captures:

- Requirements and assumptions
- Classes and responsibilities
- Design and reasoning
- Edge cases and extensibility

This keeps the MVP focused on the actual learning loop.

A future version could support UML/class diagrams or code submissions without changing the core practice model.

---

## 5. Automated API Testing

### AI suggestion

AI suggested adding Jest and Supertest tests covering both successful API behaviour and failure cases.

### Decision

Accepted.

### Why

The assignment requires tests for important behaviour and failure/edge cases.

The resulting test suite covers:

- API health
- Problem listing
- Problem retrieval
- Unknown problems
- Missing submissions
- Invalid problem IDs
- Attempt creation
- Evaluation generation
- Structured feedback
- Attempt history
- Individual attempt retrieval
- Unknown attempts

The final backend test suite contains 10 passing tests.

---

## AI Limitations and Human Decisions

AI suggestions were treated as recommendations rather than automatically accepted implementation decisions.

Important decisions were reviewed against:

- Assignment requirements
- MVP scope
- Implementation complexity
- Explainability
- Testability
- Future extensibility

For example, the project deliberately uses a simple monolithic architecture instead of introducing microservices or unnecessary infrastructure.

The final implementation therefore combines AI-assisted development with human judgement about scope, trade-offs and product requirements.