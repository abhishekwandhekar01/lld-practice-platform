LLD Practice Platform — README
1. Project Overview
A web-based Low-Level Design (LLD) practice platform that helps learners practice LLD problems, submit their solutions, receive structured feedback, and review previous attempts.
Core Practice Flow:
Choose Problem → Design Solution → Submit → Get Feedback → Review → Try Again
2. Features
• Browse LLD practice problems \
• Search problems \
• Filter problems by difficulty \
• View problem requirements and description \
• Write LLD solutions \
• Submit solutions \
• Automatic evaluation \
• Score out of 100 \
• Criterion-wise feedback \
• Evidence for evaluation \
• Concerns and improvement suggestions \
• Confidence score \
• View previous attempts \
• Review individual attempts \
• Track practice statistics \
• REST API \
• Persistent database \
• Automated backend tests  

3. Tech Stack

Frontend:
• React \
• Vite \
• JavaScript \
• React Router \
• CSS \
• Lucide React

Backend:
• Node.js \
• Express.js \
• Prisma ORM \
• SQLite \

Testing:
• Jest \
• Supertest \

4. Project Structure
```
lld-practice-platform/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Problems.jsx
│   │   ├── Problem.jsx
│   │   ├── Attempts.jsx
│   │   ├── Attempt.jsx
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── dev.db
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── problemController.js
│   │   │   └── attemptController.js
│   │   ├── routes/
│   │   │   ├── problemRoutes.js
│   │   │   └── attemptRoutes.js
│   │   ├── services/
│   │   │   └── prisma.js
│   │   └── server.js
│   │
│   ├── tests/
│   │   └── api.test.js
│   └── package.json
│
├── DESIGN.md
├── RESEARCH.md
├── AI_USAGE.md
└── README.md
```
5. Getting Started

Prerequisites:
• Node.js \
• npm \

Backend setup:
1. Open a terminal in the project folder.
2. Run:
```
cd server
npm install
```
3. Create a .env file inside the server folder:
```
DATABASE_URL="file:./dev.db"
```
4. Generate Prisma Client:
```
npx prisma generate
```
5. Run database migrations:
```npx prisma migrate dev```
6. Seed practice problems:
```npm run seed```
7. Start the backend:
```npm run dev```
The backend runs on:
```
http://localhost:5000
```

Frontend setup:
Open a second terminal:
```
cd client
npm install
npm run dev
```
Vite will display the local frontend URL, normally:
```
http://localhost:5173
```
6. Application Flow
1. Problems

The learner can browse available LLD problems. Problems can be searched, filtered by difficulty, and opened for practice.

2. Practice

The learner prepares a solution covering:
• Requirements and assumptions \
• Classes and responsibilities \
• Design and reasoning \
• Edge cases and extensibility \

3. Submission

The learner submits the solution. The backend validates that a problem ID is provided, the submission is not empty, and the selected problem exists.

4. Evaluation

The submitted solution is evaluated using a deterministic rule-based evaluator.

5. Feedback

The learner receives:
• Score \
• Maximum score \
• Evidence \
• Concern \
• Suggestion \
• Confidence 

6. Attempt History

Every submission is stored as an attempt. Learners can view previous attempts, submitted solutions, and evaluation results.

7. Evaluation

The MVP evaluates solutions across four criteria: \
Requirements & Assumptions — 20 points \
Classes & Responsibilities — 30 points \
Design & Reasoning — 30 points \
Edge Cases & Extensibility — 20 points \
Total — 100 points \
The evaluator looks for evidence related to requirements, domain classes, responsibilities, design concepts, extensibility, and edge cases.

8. Domain Model
```
Problem
   |
   | 1 : many
   ↓
Attempt
   |
   | 1 : 0..1
   ↓
Evaluation
   |
   | 1 : many
   ↓
Feedback
```
Problem:
Represents an LLD problem available for practice.
Attempt:
Represents one submitted solution.
Evaluation:
Represents the assessment of an attempt.
Feedback:
Represents criterion-level feedback produced by an evaluation.

9. Attempt Status
```
SUBMITTED
    ↓
EVALUATING
    ↓
COMPLETED
If evaluation fails:
EVALUATING
    ↓
FAILED
```
The state model also allows asynchronous evaluation in a future version.

10. API Endpoints
```
GET /api/health
```
Checks whether the backend API is running.
```
GET /api/problems
```
Returns all available LLD problems.
```
GET /api/problems/:slug
```
Returns a specific problem using its slug.
```
POST /api/attempts
```
Creates an attempt and evaluates the submitted solution.
Example request:
```
{
  "problemId": "problem-id",
  "submission": "My LLD solution..."
}
GET /api/attempts
```
Returns previous attempts with their evaluation and feedback.
```
GET /api/attempts/:id
```
Returns a specific attempt with its problem, evaluation and feedback.

11. Why Rule-Based Evaluation?

A deterministic evaluator was selected for the MVP because it provides:
• Consistent results \
• Fast feedback \
• Predictable scoring \
• Easy testing \
• No external AI API dependency \
• Explainable behaviour 

Limitation:
Rule-based evaluation cannot fully understand the quality of an arbitrary LLD design.
A future version can introduce AI-based reasoning while keeping the same overall practice flow.

12. Extensibility
The evaluation system can be extended in the future:
```
Evaluator
   |
   ├── RuleBasedEvaluator
   ├── AIEvaluator
   └── HumanEvaluator
```
The submission format can also be extended from text to:
• UML diagrams \
• Class diagrams \
• Code submissions \
• Other structured formats 

13. Error Handling

The backend handles common invalid requests.

Missing submission → 400 Bad Request \
Unknown problem → 404 Not Found \
Unknown attempt → 404 Not Found \
Unexpected server/database error → 500 Internal Server Error

14. Testing
The backend uses Jest and Supertest.
Run:
```
cd server
npm test
```
The test suite contains 10 automated API tests covering:

• API health check \
• Problem listing \
• Problem retrieval \
• Unknown problem handling \
• Missing submission validation \
• Invalid problem handling \
• Attempt creation \
• Evaluation generation \
• Structured feedback \
• Attempt history \
• Individual attempt retrieval \
• Unknown attempt handling

All current tests pass successfully.

15. Design Decisions

Simple Monolithic Architecture:
A simple monolithic backend was selected because the assignment focuses on LLD and domain design rather than distributed systems.

SQLite:
SQLite provides simple persistent storage without requiring a separate database server.
Text-Based Submission:
Text is sufficient for communicating requirements, assumptions, classes, responsibilities, design reasoning, and edge cases.
Deterministic Evaluation:
The MVP uses deterministic evaluation to make scoring predictable and explainable.

16. Known Limitations

• Evaluation is rule-based. \
• The evaluator cannot completely understand arbitrary designs. \
• Authentication is not implemented. \
• User accounts are not implemented. \
• Text is the primary submission format. \
• Evaluation currently happens synchronously. \
• The project is primarily intended as an MVP/prototype.

17. Future Improvements

• AI-powered LLD evaluation \
• UML/class diagram submissions \
• Code-based submissions \
• Code compilation and testing \
• Human expert review \
• Authentication \
• User profiles \
• Personalized recommendations \
• More LLD problems \
• Difficulty progression \
• Detailed progress analytics \
• Asynchronous evaluation \
• Background evaluation workers

18. Documentation
DESIGN.md:
Architecture, domain model, evaluation approach, extensibility, error handling, testing strategy, and design trade-offs.
RESEARCH.md:
Research into LLD practice approaches, common LLD problem patterns, evaluation considerations, product opportunities, and product decisions.
AI_USAGE.md:
AI-assisted development decisions, AI suggestions, accepted/rejected decisions, and reasoning behind final implementation choices.

19. License
This project was developed as an engineering assignment and prototype.
