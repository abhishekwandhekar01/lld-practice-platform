const request = require("supertest");
const app = require("../src/server");

describe("LLD Practice Platform API", () => {
  let problemId;
  let attemptId;

  // ---------------------------------------
  // Health
  // ---------------------------------------

  test("GET /api/health returns API status", async () => {
    const response = await request(app)
      .get("/api/health")
      .expect(200);

    expect(response.body.status).toBe("ok");
    expect(response.body.message).toBe(
      "LLD Practice Platform API is running"
    );
  });

  // ---------------------------------------
  // Problems
  // ---------------------------------------

  test("GET /api/problems returns problems", async () => {
    const response = await request(app)
      .get("/api/problems")
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    problemId = response.body[0].id;

    expect(response.body[0]).toHaveProperty("title");
    expect(response.body[0]).toHaveProperty("description");
    expect(response.body[0]).toHaveProperty("difficulty");
  });

  test("GET /api/problems/:slug returns a problem", async () => {
    const problemsResponse = await request(app)
      .get("/api/problems")
      .expect(200);

    const problem = problemsResponse.body[0];

    const response = await request(app)
      .get(`/api/problems/${problem.slug}`)
      .expect(200);

    expect(response.body.id).toBe(problem.id);
    expect(response.body.slug).toBe(problem.slug);
  });

  test("GET /api/problems/:slug returns 404 for unknown problem", async () => {
    const response = await request(app)
      .get("/api/problems/does-not-exist")
      .expect(404);

    expect(response.body.error).toBe("Problem not found");
  });

  // ---------------------------------------
  // Attempt validation
  // ---------------------------------------

  test("POST /api/attempts rejects missing submission", async () => {
    const response = await request(app)
      .post("/api/attempts")
      .send({
        problemId,
      })
      .expect(400);

    expect(response.body.error).toBe(
      "problemId and submission are required"
    );
  });

  test("POST /api/attempts rejects invalid problem", async () => {
    const response = await request(app)
      .post("/api/attempts")
      .send({
        problemId: "invalid-problem-id",
        submission: "ParkingLot class design",
      })
      .expect(404);

    expect(response.body.error).toBe("Problem not found");
  });

  // ---------------------------------------
  // Attempt + Evaluation
  // ---------------------------------------

  test("POST /api/attempts creates attempt and evaluation", async () => {
    const submission = `
      Requirements:
      Multiple floors, motorcycle, car, truck, vehicle types,
      parking spots, parking tickets and payment.

      Classes:
      ParkingLot manages ParkingFloor.
      ParkingFloor manages ParkingSpot.
      Vehicle and Ticket classes track vehicles and tickets.

      Design:
      Use interface, composition, polymorphism and Strategy pattern.
      The design should be extensible for new vehicle and spot types.

      Edge cases:
      Full parking lot, unavailable spots, invalid ticket,
      duplicate exit and future extension.
    `;

    const response = await request(app)
      .post("/api/attempts")
      .send({
        problemId,
        submission,
      })
      .expect(201);

    attemptId = response.body.id;

    expect(response.body).toHaveProperty("id");
    expect(response.body.problemId).toBe(problemId);
    expect(response.body.status).toBe("COMPLETED");

    expect(response.body.evaluation).toBeDefined();
    expect(response.body.evaluation.totalScore).toBeGreaterThan(0);
    expect(response.body.evaluation.status).toBe("COMPLETED");

    expect(
      response.body.evaluation.feedback
    ).toHaveLength(4);

    expect(
      response.body.evaluation.feedback[0]
    ).toHaveProperty("criterion");

    expect(
      response.body.evaluation.feedback[0]
    ).toHaveProperty("score");

    expect(
      response.body.evaluation.feedback[0]
    ).toHaveProperty("evidence");

    expect(
      response.body.evaluation.feedback[0]
    ).toHaveProperty("suggestion");
  });

  // ---------------------------------------
  // Attempt history
  // ---------------------------------------

  test("GET /api/attempts returns attempt history", async () => {
    const response = await request(app)
      .get("/api/attempts")
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    const attempt = response.body.find(
      (item) => item.id === attemptId
    );

    expect(attempt).toBeDefined();
    expect(attempt).toHaveProperty("problem");
    expect(attempt).toHaveProperty("evaluation");
  });

  test("GET /api/attempts/:id returns a specific attempt", async () => {
    const response = await request(app)
      .get(`/api/attempts/${attemptId}`)
      .expect(200);

    expect(response.body.id).toBe(attemptId);
    expect(response.body.evaluation).toBeDefined();
  });

  test("GET /api/attempts/:id returns 404 for unknown attempt", async () => {
    const response = await request(app)
      .get("/api/attempts/does-not-exist")
      .expect(404);

    expect(response.body.error).toBe("Attempt not found");
  });
});