import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Code2,
  Lightbulb,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "./Problem.css";

const API_URL = "http://localhost:5000/api";

function Attempt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/attempts/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch attempt");
        }

        return res.json();
      })
      .then((data) => {
        setAttempt(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load attempt:", error);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="attempts-loading">
        <Code2 size={30} />
        <p>Loading attempt...</p>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="attempts-loading">
        <h2>Attempt not found</h2>

        <button
          className="submit-btn"
          onClick={() => navigate("/attempts")}
        >
          Back to attempts
        </button>
      </div>
    );
  }

  const evaluation = attempt.evaluation;
  const feedback = evaluation?.feedback || [];

  return (
    <div className="attempts-page">
      <header className="practice-topbar">
        <button
          className="back-btn"
          onClick={() => navigate("/attempts")}
        >
          <ArrowLeft size={17} />
          My Attempts
        </button>

        <div className="practice-brand">
          <div className="brand-mark small">L</div>

          <span>
            LLD<span>.</span> Practice
          </span>
        </div>

        <div className="timer">
          <Clock3 size={16} />
          Attempt review
        </div>
      </header>

      <main className="attempts-main">
        {/* PAGE HEADER */}
        <div className="attempts-heading">
          <div>
            <span className="section-label">ATTEMPT REVIEW</span>

            <h1>{attempt.problem?.title || "Attempt"}</h1>

            <p>
              Review your submitted LLD solution and evaluation.
            </p>
          </div>

          <span className="status-badge">
            <CheckCircle2 size={14} />
            {attempt.status}
          </span>
        </div>

        {/* SUBMISSION */}
        <section className="attempt-card">
          <div className="attempt-content">
            <div className="attempt-top">
              <div>
                <div className="attempt-title-row">
                  <h2>Your submission</h2>

                  <span
                    className={`difficulty ${
                      attempt.problem?.difficulty?.toLowerCase() || "medium"
                    }`}
                  >
                    {attempt.problem?.difficulty || "LLD"}
                  </span>
                </div>

                <p className="attempt-date">
                  Submitted {formatDate(attempt.createdAt)}
                </p>
              </div>
            </div>

            <div className="submission-preview">
              <span>YOUR SOLUTION</span>

              <pre>{attempt.submission}</pre>
            </div>
          </div>
        </section>

        {/* EVALUATION */}
        {evaluation ? (
          <section className="evaluation-section">
            <div className="evaluation-header">
              <div>
                <span className="section-label">EVALUATION</span>

                <h2>Your feedback</h2>

                <p>
                  Detailed feedback based on the LLD evaluation rubric.
                </p>
              </div>

              <div className="score-card">
                <span>OVERALL SCORE</span>

                <strong>{evaluation.totalScore}</strong>

                <small>/ 100</small>
              </div>
            </div>

            {/* SCORE BAR */}
            <div className="score-progress">
              <div
                className="score-progress-fill"
                style={{
                  width: `${Math.min(evaluation.totalScore, 100)}%`,
                }}
              />
            </div>

            {/* FEEDBACK CARDS */}
            <div className="feedback-list">
              {feedback.map((item) => (
                <article
                  className="feedback-card"
                  key={item.id}
                >
                  <div className="feedback-card-header">
                    <div>
                      <span className="feedback-number">
                        {item.criterion}
                      </span>

                      <h3>{item.criterion}</h3>
                    </div>

                    <div className="criterion-score">
                      <strong>{item.score}</strong>
                      <span>/ {item.maxScore}</span>
                    </div>
                  </div>

                  <div className="feedback-content">
                    <div className="feedback-block">
                      <span>Evidence</span>
                      <p>{item.evidence}</p>
                    </div>

                    <div className="feedback-block concern">
                      <span>Concern</span>
                      <p>{item.concern}</p>
                    </div>

                    <div className="feedback-block suggestion">
                      <span>
                        <Lightbulb size={15} />
                        Suggestion
                      </span>

                      <p>{item.suggestion}</p>
                    </div>
                  </div>

                  <div className="confidence">
                    Confidence: {Math.round(item.confidence * 100)}%
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="empty-attempts">
            <div className="empty-icon">
              <Clock3 size={24} />
            </div>

            <h2>Evaluation pending</h2>

            <p>
              Your solution has been submitted. Evaluation feedback
              will appear here once it is available.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default Attempt;