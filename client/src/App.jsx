import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Code2,
  LayoutDashboard,
  Trophy,
  TrendingUp,
  Zap,
} from "lucide-react";

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";
import Problem from "./Problem";
import Attempts from "./Attempts";
import Attempt from "./Attempt";
import Problems from "./Problems";

import "./App.css";


const API_URL = "http://localhost:5000/api";

function calculateStreak(attempts) {
  if (!attempts.length) return 0;

  // Get unique practice dates
  const dates = [
    ...new Set(
      attempts.map((attempt) => {
        const date = new Date(attempt.createdAt);

        return `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      })
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  let streak = 1;

  for (let i = 0; i < dates.length - 1; i++) {
    const current = new Date(dates[i]);
    const previous = new Date(dates[i + 1]);

    const difference =
      (current - previous) / (1000 * 60 * 60 * 24);

    if (difference === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function App() {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/problems`)
      .then((res) => res.json())
      .then((data) => {
        setProblems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch problems:", error);
        setLoading(false);
      });
  }, []);

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
      })
      .catch((error) => {
        console.error("Failed to fetch attempts:", error);
      });
  }, []);

  const streak = calculateStreak(attempts);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">L</div>

          <div>
            <h2>
              LLD<span>.</span>
            </h2>
            <p>Practice Platform</p>
          </div>
        </div>

        <nav className="nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>

          <NavLink
            to="/problems"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <BookOpen size={19} />
            Problems
          </NavLink>

          <NavLink
            to="/attempts"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <Clock3 size={19} />
            My Attempts
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">A</div>

            <div>
              <strong>Abhishek</strong>
              <span>Candidate</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">GOOD MORNING 👋</p>

            <h1>Ready to sharpen your design skills?</h1>

            <p className="subtitle">
              Practice real-world Low-Level Design problems and get structured
              feedback on your solutions.
            </p>
          </div>

          <button
            className="history-btn"
            onClick={() => navigate("/attempts")}
          >
            <Clock3 size={17} />
            View history
          </button>
        </header>

        <section className="stats-grid">
          <StatCard
            icon={<Code2 size={21} />}
            label="Problems Solved"
            value={new Set(
              attempts
                .filter((attempt) => attempt.status === "COMPLETED")
                .map((attempt) => attempt.problemId)
            ).size}
            note="Completed problems"
          />

          <StatCard
            icon={<Trophy size={21} />}
            label="Average Score"
            value={
              attempts.filter((attempt) => attempt.evaluation).length > 0
                ? Math.round(
                  attempts
                    .filter((attempt) => attempt.evaluation)
                    .reduce(
                      (sum, attempt) => sum + attempt.evaluation.totalScore,
                      0
                    ) /
                  attempts.filter((attempt) => attempt.evaluation).length
                )
                : "—"
            }
            note={
              attempts.filter((attempt) => attempt.evaluation).length > 0
                ? "Average evaluation score"
                : "No evaluations yet"
            }
          />

          <StatCard
            icon={<TrendingUp size={21} />}
            label="Practice Streak"
            value={`${streak} ${streak === 1 ? "day" : "days"}`}
            note={streak > 0 ? "Keep it going 🔥" : "Start your streak"}
          />

          <StatCard
            icon={<Zap size={21} />}
            label="Total Attempts"
            value={attempts.length}
            note="Keep practicing"
          />
        </section>

        <section className="hero-card">
          <div className="hero-content">
            <div className="hero-icon">
              <Code2 size={27} />
            </div>

            <div>
              <span className="hero-label">START PRACTICING</span>

              <h2>Think. Design. Get feedback.</h2>

              <p>
                Pick an LLD problem, explain your design, and get structured
                feedback on your responsibilities, abstraction, coupling,
                extensibility and edge cases.
              </p>

              <button
                className="primary-btn"
                onClick={() => navigate("/problems")}
              >
                Explore problems
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          <div className="hero-decoration">
            <div className="code-line"></div>
            <div className="code-line short"></div>
            <div className="code-line medium"></div>
            <div className="code-line"></div>
          </div>
        </section>

        <section className="section-header">
          <div>
            <h2>Practice problems</h2>
            <p>Choose a problem and start designing.</p>
          </div>

          <button
            className="view-all"
            onClick={() => navigate("/problems")}
          >
            View all <ArrowRight size={15} />
          </button>
        </section>

        {loading ? (
          <div className="loading">Loading problems...</div>
        ) : (
          <div className="problems-grid">
            {problems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        )}

        <section className="section-header attempts-header">
          <div>
            <h2>Recent attempts</h2>
            <p>Your latest practice activity.</p>
          </div>

          {attempts.length > 0 && (
            <button
              className="view-all"
              onClick={() => navigate("/attempts")}
            >
              View all
              <ArrowRight size={15} />
            </button>
          )}
        </section>

        {attempts.length === 0 ? (
          <div className="empty-attempts">
            <div className="empty-icon">
              <Clock3 size={22} />
            </div>

            <div>
              <strong>No attempts yet</strong>

              <p>
                Complete your first problem and your evaluation will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="recent-attempts">
            {attempts.slice(0, 3).map((attempt) => (
              <div
                className="recent-attempt"
                key={attempt.id}
                onClick={() => navigate(`/attempt/${attempt.id}`)}
              >
                <div className="recent-attempt-icon">
                  <Code2 size={18} />
                </div>

                <div className="recent-attempt-info">
                  <strong>
                    {attempt.problem?.title || "LLD Problem"}
                  </strong>

                  <span>
                    {attempt.createdAt
                      ? new Date(attempt.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                      : "Recently submitted"}
                  </span>
                </div>

                <div className="recent-attempt-status">
                  {attempt.evaluation ? (
                    <>
                      <strong>
                        {attempt.evaluation.totalScore ?? attempt.evaluation.score ?? "—"}
                        <small>/100</small>
                      </strong>

                      <span className="completed-text">
                        Completed
                      </span>
                    </>
                  ) : (
                    <span className="pending-text">
                      {attempt.status || "Pending"}
                    </span>
                  )}
                </div>

                <ArrowRight
                  className="recent-attempt-arrow"
                  size={17}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, note }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}

function ProblemCard({ problem }) {
  const navigate = useNavigate();
  return (
    <article className="problem-card">
      <div className="problem-top">
        <div className="problem-icon">
          <Code2 size={20} />
        </div>

        <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
          {problem.difficulty}
        </span>
      </div>

      <h3>{problem.title}</h3>

      <p>{problem.description}</p>

      <div className="problem-footer">
        <span>
          <BookOpen size={15} />
          LLD
        </span>

        <button onClick={() => navigate(`/problem/${problem.slug}`)}>
          Practice
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problem/:slug" element={<Problem />} />
        <Route path="/attempts" element={<Attempts />} />
        <Route path="/attempt/:id" element={<Attempt />} />
      </Routes>

    </BrowserRouter>
  );
}

export default AppRouter;