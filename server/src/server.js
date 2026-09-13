const express = require("express");
const cors = require("cors");

const problemRoutes = require("./routes/problemRoutes");
const attemptRoutes = require("./routes/attemptRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "LLD Practice Platform API is running",
  });
});

app.use("/api/problems", problemRoutes);
app.use("/api/attempts", attemptRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;