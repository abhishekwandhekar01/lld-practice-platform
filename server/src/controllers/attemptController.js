const prisma = require("../services/prisma");

async function createAttempt(req, res) {
  try {
    const { problemId, submission } = req.body;

    if (!problemId || !submission || !submission.trim()) {
      return res.status(400).json({
        error: "problemId and submission are required",
      });
    }

    const problem = await prisma.problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    const attempt = await prisma.attempt.create({
      data: {
        problemId,
        submission: submission.trim(),
        status: "EVALUATING",
      },
    });

    const text = submission.toLowerCase();

    // -----------------------------
    // 1. Requirements & Assumptions
    // -----------------------------

    let requirementsScore = 5;

    if (text.includes("multiple floors") || text.includes("floor")) {
      requirementsScore += 4;
    }

    if (
      text.includes("motorcycle") ||
      text.includes("car") ||
      text.includes("truck") ||
      text.includes("vehicle")
    ) {
      requirementsScore += 4;
    }

    if (text.includes("parking spot") || text.includes("spot")) {
      requirementsScore += 3;
    }

    if (text.includes("ticket") || text.includes("payment")) {
      requirementsScore += 2;
    }

    requirementsScore = Math.min(requirementsScore, 20);

    // -----------------------------
    // 2. Classes & Responsibilities
    // -----------------------------

    let classesScore = 5;

    const classKeywords = [
      "parkinglot",
      "parking lot",
      "parkingfloor",
      "parking floor",
      "parkingspot",
      "parking spot",
      "vehicle",
      "ticket",
    ];

    classKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        classesScore += 3;
      }
    });

    if (
      text.includes("manages") ||
      text.includes("responsibil") ||
      text.includes("tracks")
    ) {
      classesScore += 3;
    }

    classesScore = Math.min(classesScore, 30);

    // -----------------------------
    // 3. Design & Reasoning
    // -----------------------------

    let designScore = 5;

    const designKeywords = [
      "inheritance",
      "interface",
      "composition",
      "polymorphism",
      "strategy",
      "factory",
      "relationship",
      "association",
      "encapsulation",
      "abstraction",
    ];

    designKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        designScore += 2;
      }
    });

    if (
      text.includes("extend") ||
      text.includes("extensible") ||
      text.includes("new vehicle") ||
      text.includes("new spot")
    ) {
      designScore += 4;
    }

    designScore = Math.min(designScore, 30);

    // -----------------------------
    // 4. Edge Cases & Extensibility
    // -----------------------------

    let edgeScore = 5;

    const edgeKeywords = [
      "full",
      "no available",
      "unavailable",
      "exit",
      "fee",
      "error",
      "invalid",
      "edge case",
      "future",
      "extension",
    ];

    edgeKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        edgeScore += 2;
      }
    });

    edgeScore = Math.min(edgeScore, 20);

    // -----------------------------
    // Total score
    // -----------------------------

    const totalScore =
      requirementsScore +
      classesScore +
      designScore +
      edgeScore;

    // -----------------------------
    // Create evaluation
    // -----------------------------

    const evaluation = await prisma.evaluation.create({
      data: {
        attemptId: attempt.id,
        totalScore,
        status: "COMPLETED",
        completedAt: new Date(),

        feedback: {
          create: [
            {
              criterion: "Requirements & Assumptions",
              score: requirementsScore,
              maxScore: 20,
              evidence:
                requirementsScore >= 14
                  ? "The solution identifies several important system requirements."
                  : "The solution covers some requirements but misses important details.",
              concern:
                requirementsScore < 14
                  ? "Some functional requirements and assumptions are not clearly defined."
                  : "Requirements coverage is reasonable.",
              suggestion:
                "Clearly state assumptions around vehicle types, floors, spot compatibility, tickets, payments and capacity.",
              confidence: 0.9,
            },

            {
              criterion: "Classes & Responsibilities",
              score: classesScore,
              maxScore: 30,
              evidence:
                classesScore >= 20
                  ? "The solution identifies relevant domain classes and responsibilities."
                  : "Some core classes are identified but responsibilities are limited.",
              concern:
                classesScore < 20
                  ? "The class model could be more complete and responsibilities could be clearer."
                  : "Some responsibilities could be further refined.",
              suggestion:
                "Keep each class focused on one responsibility and clearly define relationships between ParkingLot, Floor, Spot, Vehicle and Ticket.",
              confidence: 0.9,
            },

            {
              criterion: "Design & Reasoning",
              score: designScore,
              maxScore: 30,
              evidence:
                designScore >= 20
                  ? "The solution discusses useful design concepts and extensibility."
                  : "Limited design reasoning or relationship details are provided.",
              concern:
                designScore < 20
                  ? "Relationships, abstractions and design decisions need more explanation."
                  : "Some design decisions could be justified more clearly.",
              suggestion:
                "Explain class relationships and use interfaces, composition or Strategy/Factory patterns where they genuinely improve extensibility.",
              confidence: 0.85,
            },

            {
              criterion: "Edge Cases & Extensibility",
              score: edgeScore,
              maxScore: 20,
              evidence:
                edgeScore >= 12
                  ? "The solution considers several operational edge cases."
                  : "Only limited edge cases are considered.",
              concern:
                edgeScore < 12
                  ? "Important cases such as a full parking lot, unavailable spots and invalid exits are not sufficiently addressed."
                  : "More detailed failure scenarios could be considered.",
              suggestion:
                "Handle full capacity, incompatible spots, duplicate exits, invalid tickets and future vehicle/spot types.",
              confidence: 0.9,
            },
          ],
        },
      },

      include: {
        feedback: true,
      },
    });

    // Mark attempt as completed
    const completedAttempt = await prisma.attempt.update({
      where: {
        id: attempt.id,
      },
      data: {
        status: "COMPLETED",
      },
      include: {
        problem: true,
        evaluation: {
          include: {
            feedback: true,
          },
        },
      },
    });

    res.status(201).json(completedAttempt);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create attempt",
    });
  }
}

async function getAttempts(req, res) {
  try {
    const attempts = await prisma.attempt.findMany({
      include: {
        problem: true,
        evaluation: {
          include: {
            feedback: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(attempts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch attempts",
    });
  }
}

async function getAttempt(req, res) {
  try {
    const { id } = req.params;

    const attempt = await prisma.attempt.findUnique({
      where: {
        id,
      },
      include: {
        problem: true,
        evaluation: {
          include: {
            feedback: true,
          },
        },
      },
    });

    if (!attempt) {
      return res.status(404).json({
        error: "Attempt not found",
      });
    }

    res.json(attempt);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch attempt",
    });
  }
}

module.exports = {
  createAttempt,
  getAttempts,
  getAttempt,
};