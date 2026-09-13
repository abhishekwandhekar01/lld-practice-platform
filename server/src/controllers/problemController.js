const prisma = require("../services/prisma");

async function getProblems(req, res) {
  try {
    const problems = await prisma.problem.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch problems",
    });
  }
}

async function getProblem(req, res) {
  try {
    const { slug } = req.params;

    const problem = await prisma.problem.findUnique({
      where: {
        slug,
      },
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    res.json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch problem",
    });
  }
}

module.exports = {
  getProblems,
  getProblem,
};