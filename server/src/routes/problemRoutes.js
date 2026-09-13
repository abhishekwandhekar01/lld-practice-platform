const express = require("express");
const {
  getProblems,
  getProblem,
} = require("../controllers/problemController");

const router = express.Router();

router.get("/", getProblems);
router.get("/:slug", getProblem);

module.exports = router;