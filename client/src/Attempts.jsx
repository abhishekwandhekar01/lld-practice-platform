import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Code2,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Problem.css";

const API_URL = "http://localhost:5000/api";

function Attempts() {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/attempts`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch attempts");
        }

        return res.json();
      })
      .then((data) => {
        setAttempts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load attempts:", error);
        setLoading(false);
      });
  }, []);

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
        <p>Loading your attempts...</p>
      </div>
    );
  }

  return (
    <div className="attempts-page">
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
          My Attempts
        </div>
      </header>

      <main className="attempts-main">
        <div className="attempts-heading">
          <div>
            <span className="section-label">PRACTICE HISTORY</span>
            <h1>My Attempts</h1>
            <p>
              Review your previous LLD solutions and track your practice
              progress.
            </p>
          </div>

          <div className="attempt-count">
            {attempts.length}{" "}
            {attempts.length === 1 ? "attempt" : "attempts"}
          </div>
        </div>

        {attempts.length === 0 ? (
          <div className="empty-attempts">
            <div className="empty-icon">
              <Code2 size={26} />
            </div>

            <h2>No attempts yet</h2>

            <p>
              Start solving an LLD problem and your submissions will appear
              here.
            </p>

            <button
              className="submit-btn"
              onClick={() => navigate("/")}
            >
              Explore problems
            </button>
          </div>
        ) : (
          <div className="attempts-list">
            {attempts.map((attempt) => (
              <article className="attempt-card" key={attempt.id}>
                <div className="attempt-icon">
                  <Code2 size={22} />
                </div>

                <div className="attempt-content">
                  <div className="attempt-top">
                    <div>
                      <div className="attempt-title-row">
                        <h2>
                          {attempt.problem?.title || "Unknown Problem"}
                        </h2>

                        <span className="difficulty medium">
                          {attempt.problem?.difficulty || "LLD"}
                        </span>
                      </div>

                      <p className="attempt-date">
                        Submitted {formatDate(attempt.createdAt)}
                      </p>
                    </div>

                    <span className="status-badge">
                      <CheckCircle2 size={14} />
                      Submitted
                    </span>
                  </div>

                  <div className="submission-preview">
                    <span>YOUR SUBMISSION</span>

                    <p>{attempt.submission}</p>
                  </div>

                  <div className="attempt-footer">
                    <button
                      className="view-attempt-btn"
                      onClick={() =>
                        navigate(`/attempt/${attempt.id}`)
                      }
                    >
                      <Eye size={15} />
                      View attempt
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Attempts;