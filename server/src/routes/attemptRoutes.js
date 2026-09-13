const express = require("express");

const {
  createAttempt,
  getAttempts,
  getAttempt,
} = require("../controllers/attemptController");

const router = express.Router();

router.post("/", createAttempt);
router.get("/", getAttempts);
router.get("/:id", getAttempt);

module.exports = router;