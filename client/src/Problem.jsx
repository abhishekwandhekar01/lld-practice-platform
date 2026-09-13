import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Code2,
  Lightbulb,
  Send,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
// import "./App.css";
import "./Problem.css";

const API_URL = "http://localhost:5000/api";

function Problem() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [requirements, setRequirements] = useState("");
  const [classes, setClasses] = useState("");
  const [design, setDesign] = useState("");
  const [edgeCases, setEdgeCases] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/problems`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((item) => item.slug === slug);

        setProblem(found);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load problem:", error);
        setLoading(false);
      });
  }, [slug]);

  const handleSubmit = async (event) => {
  event.preventDefault();

  const submission = `
Requirements & Assumptions:
${requirements}

Classes & Responsibilities:
${classes}

Design & Reasoning:
${design}

Edge Cases & Extensibility:
${edgeCases}
`.trim();

  if (!submission) {
    alert("Please complete your solution before submitting.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/attempts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problemId: problem.id,
        submission,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to submit solution");
    }

    console.log("Attempt created:", data);

    alert("Solution submitted successfully! 🎉");

    navigate("/attempts");
  } catch (error) {
    console.error("Submission failed:", error);
    alert(`Submission failed: ${error.message}`);
  }
};

  if (loading) {
    return <div className="problem-loading">Loading problem...</div>;
  }

  if (!problem) {
    return (
      <div className="problem-loading">
        <h2>Problem not found</h2>
        <button onClick={() => navigate("/")}>Back to dashboard</button>
      </div>
    );
  }

  return (
    <div className="practice-page">
      <header className="practice-topbar">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={17} />
          Dashboard
        </button>

        <div className="practice-brand">
          <div className="brand-mark small">L</div>
          <span>
            LLD<span>.</span> Practice
          </span>
        </div>

        <div className="timer">
          <Clock3 size={16} />
          Practice mode
        </div>
      </header>

      <main className="practice-main">
        <section className="problem-heading">
          <div className="heading-icon">
            <Code2 size={26} />
          </div>

          <div className="heading-text">
            <div className="heading-meta">
              <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </span>

              <span className="problem-tag">LLD</span>
            </div>

            <h1>{problem.title}</h1>

            <p>{problem.description}</p>
          </div>
        </section>

        <div className="practice-layout">
          <section className="statement-card">
            <div className="card-title">
              <div>
                <span className="section-label">PROBLEM STATEMENT</span>
                <h2>Design the system</h2>
              </div>
            </div>

            <div className="statement-text">
              <p>{problem.description}</p>

              {problem.requirements && (
                <div className="requirements">
                  <h3>Requirements</h3>

                  <div className="requirements-list">
                    {problem.requirements
                      .split("\n")
                      .filter(Boolean)
                      .map((requirement, index) => (
                        <div className="requirement" key={index}>
                          <CheckCircle2 size={16} />
                          <span>{requirement}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="tip-box">
              <Lightbulb size={19} />

              <div>
                <strong>Design tip</strong>
                <p>
                  Focus on responsibilities, relationships, extensibility and
                  edge cases. There isn't necessarily one correct design.
                </p>
              </div>
            </div>
          </section>

          <form className="submission-card" onSubmit={handleSubmit}>
            <div className="submission-header">
              <div>
                <span className="section-label">YOUR SOLUTION</span>
                <h2>Design your solution</h2>
              </div>

              <span className="draft-badge">Draft</span>
            </div>

            <Field
              label="1. Requirements & assumptions"
              placeholder="What assumptions are you making? What are the key functional requirements?"
              value={requirements}
              onChange={setRequirements}
            />

            <Field
              label="2. Classes & responsibilities"
              placeholder={`Example:

ParkingLot
- manages floors
- finds available spots

ParkingSpot
- knows its type
- tracks occupancy`}
              value={classes}
              onChange={setClasses}
              large
            />

            <Field
              label="3. Design & reasoning"
              placeholder="Explain your relationships, interfaces, patterns and important design decisions..."
              value={design}
              onChange={setDesign}
              large
            />

            <Field
              label="4. Edge cases & extensibility"
              placeholder="What happens when requirements change? Think about edge cases and future extensions..."
              value={edgeCases}
              onChange={setEdgeCases}
              large
            />

            <div className="submit-area">
              <div>
                <span>Submit when your design is ready.</span>
                <small>Your response will be evaluated against the LLD rubric.</small>
              </div>

              <button className="submit-btn" type="submit">
                <Send size={16} />
                Submit solution
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, large = false }) {
  return (
    <label className="solution-field">
      <span>{label}</span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={large ? 6 : 4}
      />
    </label>
  );
}

export default Problem;