// AdminTransplantsDashboard.js
import React, { useEffect, useState } from "react";

function AdminTransplantsDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    setLoading(true);
    fetch("http://localhost:8080/api/transplants")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRequests(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch transplant requests", err);
        setLoading(false);
      });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8080/api/transplants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Update state locally
        setRequests((prev) =>
          prev.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
        );
      } else {
        alert("Failed to update status: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error updating status:", err);
    }
  };

  if (loading) return <p>Loading transplant requests...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🩺 Transplant Requests</h2>

      {requests.length === 0 ? (
        <p>No transplant requests found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>Mobile</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Transplant Type</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Hospitals</th>
              <th style={thStyle}>Urgency</th>
              <th style={thStyle}>Notes</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Created</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td style={tdStyle}>{req.patientName}</td>
                <td style={tdStyle}>{req.userMobile}</td>
                <td style={tdStyle}>{req.userEmail || "N/A"}</td>
                <td style={tdStyle}>{req.transplantType}</td>
                <td style={tdStyle}>{req.preferredLocation || "N/A"}</td>
                <td style={tdStyle}>{req.specificHospitals || "N/A"}</td>
                <td style={tdStyle}>{req.urgency}</td>
                <td style={tdStyle}>{req.additionalNotes || "N/A"}</td>
                <td style={tdStyle}>
                  <select
                    value={req.status || "Pending"}
                    onChange={(e) => handleStatusChange(req._id, e.target.value)}
                    style={{ fontWeight: "bold", color: getStatusColor(req.status) }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td style={tdStyle}>{new Date(req.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Helper to color code status
const getStatusColor = (status) => {
  switch (status) {
    case "Contacted":
      return "orange";
    case "Ongoing":
      return "blue";
    case "Completed":
      return "green";
    default:
      return "black"; // Pending or unknown
  }
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};

export default AdminTransplantsDashboard;
