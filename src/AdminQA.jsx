import React, { useState, useEffect } from "react";

const BASE_URL = "https://healthyz-backend.onrender.com/api";

export default function AdminQA() {
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Fetch Unanswered Questions
  const fetchPending = async () => {
    try {
      const response = await fetch(`${BASE_URL}/anonymous-qa/unanswered`);
      const data = await response.json();
      setPendingQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching pending questions:", err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // Submit Answer
  const submitAnswer = async () => {
    if (!selectedId || !answer.trim()) {
      alert("Please type an answer");
      return;
    }

    try {
      await fetch(`${BASE_URL}/anonymous-qa/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, answer }),
      });

      alert("Answer submitted successfully!");
      setAnswer("");
      setSelectedId(null);
      fetchPending(); // refresh list
    } catch (err) {
      alert("Failed to submit the answer");
    }
  };

  return (
    <div style={{ width: "90%", margin: "auto", padding: 20 }}>
      <h1 style={{ marginBottom: 10 }}>Anonymous Q&A – Admin</h1>
      <p style={{ color: "#666" }}>
        Review and answer anonymous questions submitted from the app.
      </p>

      {pendingQuestions.length === 0 && (
        <p style={{ color: "#888", marginTop: 20 }}>No pending questions.</p>
      )}

      {pendingQuestions.map((q) => (
        <div
          key={q._id}
          style={{
            background: "#f4f4f4",
            padding: 15,
            marginTop: 15,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        >
          <p><strong>Question:</strong> {q.question}</p>

          {selectedId === q._id ? (
            <>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer..."
                style={{
                  width: "100%",
                  height: 80,
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                }}
              />

              <button
                onClick={submitAnswer}
                style={{
                  marginTop: 10,
                  padding: "10px 16px",
                  background: "#439BAE",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Submit Answer
              </button>

              <button
                onClick={() => {
                  setSelectedId(null);
                  setAnswer("");
                }}
                style={{
                  marginLeft: 10,
                  padding: "10px 16px",
                  background: "#ccc",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setSelectedId(q._id)}
              style={{
                marginTop: 10,
                padding: "8px 14px",
                background: "#F29100",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Answer This →
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
