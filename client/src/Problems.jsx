import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code2,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Problems.css";

const API_URL = "http://localhost:5000/api";

function Problems() {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
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

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.description.toLowerCase().includes(search.toLowerCase());

    const matchesDifficulty =
      difficulty === "All" ||
      problem.difficulty.toLowerCase() === difficulty.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="problems-page">
      <header className="problems-topbar">
        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>

        <div className="problems-brand">
          <div className="brand-mark small">L</div>

          <span>
            LLD<span>.</span> Practice
          </span>
        </div>

        <div></div>
      </header>

      <main className="problems-main">
        <div className="problems-heading">
          <span className="section-label">PRACTICE</span>

          <h1>LLD Problems</h1>

          <p>
            Choose a real-world system and practice your low-level
            design skills.
          </p>
        </div>

        <div className="problem-controls">
          <div className="search-box">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="difficulty-filters">
            {["All", "Easy", "Medium", "Hard"].map((item) => (
              <button
                key={item}
                className={difficulty === item ? "selected" : ""}
                onClick={() => setDifficulty(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="problems-loading">
            <Code2 size={28} />
            <p>Loading problems...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="problems-empty">
            <Search size={28} />
            <h2>No problems found</h2>
            <p>Try another search or difficulty filter.</p>
          </div>
        ) : (
          <div className="all-problems-grid">
            {filteredProblems.map((problem) => (
              <article
                className="problem-card"
                key={problem.id}
              >
                <div className="problem-top">
                  <div className="problem-icon">
                    <Code2 size={20} />
                  </div>

                  <span
                    className={`difficulty ${problem.difficulty.toLowerCase()}`}
                  >
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

                  <button
                    onClick={() =>
                      navigate(`/problem/${problem.slug}`)
                    }
                  >
                    Practice
                    <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Problems;