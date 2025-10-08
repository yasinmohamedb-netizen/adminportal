import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminConsultationsDashboard = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/consultations/all");
        if (res.data.success) {
          // Add doctorName field locally for input
          const updated = res.data.consultations.map(c => ({
            ...c,
            doctorNameInput: c.prescription?.doctorName || "",
          }));
          setConsultations(updated);
        } else {
          setError("Failed to fetch consultations");
        }
      } catch (err) {
        console.error("❌ Fetch consultations error:", err.message);
        setError("Error fetching consultations");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
    const interval = setInterval(fetchConsultations, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDoctorNameChange = (id, value) => {
    setConsultations(prev =>
      prev.map(c => (c._id === id ? { ...c, doctorNameInput: value } : c))
    );
  };

  const markAsComplete = async (consultationId, doctorName) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/consultations/${consultationId}/complete`,
        { doctorName }
      );
      if (res.data.success) {
        setConsultations(prev =>
          prev.map(c =>
            c._id === consultationId
              ? { ...c, prescription: res.data.prescription }
              : c
          )
        );
      }
    } catch (err) {
      console.error("❌ Error marking consultation as complete:", err.message);
    }
  };

  const getRowColor = consultation => {
    const hasPrescription =
      consultation.prescription &&
      (consultation.prescription.diagnosis ||
        consultation.prescription.medicines ||
        consultation.prescription.advice);
    return hasPrescription ? "#d4edda" : "#fff3cd";
  };

  return (
    <div>
      <h2>🩺 Admin Consultations Dashboard</h2>

      {loading && <p>Loading consultations...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && consultations.length === 0 && <p>No consultations yet.</p>}

      {!loading && !error && consultations.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={thStyle}>Consultation ID</th>
              <th style={thStyle}>User ID</th>
              <th style={thStyle}>Patient Name</th>
              <th style={thStyle}>Mobile</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Date & Time</th>
              <th style={thStyle}>Specialization</th>
              <th style={thStyle}>Call Type</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Doctor Name</th>
              <th style={thStyle}>Prescription</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map(c => {
              const dateTime = new Date(c.createdAt).toLocaleString();
              const userId = typeof c.userId === "object" ? c.userId._id : c.userId;
              const patientName = c.patientName || c.userName || "N/A";
              const mobile = c.patientMobile || "N/A";
              const email = c.patientEmail || "N/A";
              const hasPrescription =
                c.prescription &&
                (c.prescription.diagnosis || c.prescription.medicines || c.prescription.advice);
              const status = hasPrescription ? "Completed" : "Pending";
              const color = getRowColor(c);

              return (
                <tr
                  key={c._id}
                  style={{
                    backgroundColor: color,
                    animation: !hasPrescription ? "blink 1s step-start infinite" : "none",
                  }}
                >
                  <td style={tdStyle}>{c._id}</td>
                  <td style={tdStyle}>{userId}</td>
                  <td style={tdStyle}>{patientName}</td>
                  <td style={tdStyle}>{mobile}</td>
                  <td style={tdStyle}>{email}</td>
                  <td style={tdStyle}>{dateTime}</td>
                  <td style={tdStyle}>{c.specialization || "N/A"}</td>
                  <td style={tdStyle}>{c.callType || "video"}</td>
                  <td style={tdStyle}>{status}</td>
                  <td style={tdStyle}>
                    {status === "Pending" ? (
                      <input
                        type="text"
                        value={c.doctorNameInput}
                        placeholder="Enter doctor name"
                        onChange={e => handleDoctorNameChange(c._id, e.target.value)}
                        style={{ width: "90%" }}
                      />
                    ) : (
                      c.prescription?.doctorName || "N/A"
                    )}
                  </td>
                  <td style={tdStyle}>
                    {hasPrescription && c.prescription.downloadURL ? (
                      <a href={c.prescription.downloadURL} target="_blank" rel="noreferrer">
                        View PDF
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td style={tdStyle}>
                    {status === "Pending" && (
                      <button onClick={() => markAsComplete(c._id, c.doctorNameInput)}>
                        Mark as Complete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <style>
        {`
          @keyframes blink {
            50% { background-color: #fff3cd; }
            100% { background-color: #ffe5b4; }
          }
        `}
      </style>
    </div>
  );
};

const thStyle = { border: "1px solid #ddd", padding: "8px" };
const tdStyle = { border: "1px solid #ddd", padding: "8px" };

export default AdminConsultationsDashboard;
