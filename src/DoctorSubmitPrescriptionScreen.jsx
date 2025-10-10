import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://healthyz-backend.onrender.com/api";

const DoctorSubmitPrescriptionScreen = () => {
  const { consultationId } = useParams();
  const [consultation, setConsultation] = useState(null);
  const [form, setForm] = useState({
    doctorName: "",
    diagnosis: "",
    medicines: "",
    advice: "",
    patientEmail: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!consultationId || consultationId === "undefined") {
      // No consultationId, show empty manual entry form
      setLoading(false);
      setConsultation(null);
      setMessage("Manual Prescription Entry – No consultation loaded");
      return;
    }

    // Fetch consultation details
    const fetchConsultation = async () => {
      try {
        const res = await axios.get(`${API_BASE}/consultations/${consultationId}`);
        if (!res.data) throw new Error("Consultation not found");

        setConsultation(res.data);
        setForm((prev) => ({
          ...prev,
          patientEmail: res.data.patientEmail || "",
        }));
        setMessage("");
        console.log("✅ Fetched consultation:", res.data);
      } catch (err) {
        console.error("❌ Error fetching consultation:", err.response?.data || err.message);
        setConsultation(null);
        setMessage("❌ Consultation not found or backend error");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [consultationId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientEmail) {
      setMessage("❌ Patient email is required");
      return;
    }

    setSubmitting(true);
    setMessage("Submitting prescription...");
    try {
      if (!consultationId || consultationId === "undefined") {
        // No consultationId, do not call backend
        setMessage("Manual Prescription Entry – No consultation loaded");
      } else {
        const res = await axios.post(
          `${API_BASE}/consultations/${consultationId}/submit-prescription`,
          form
        );
        console.log("✅ Prescription submitted:", res.data);
        setMessage("✅ Prescription submitted successfully!");
      }
    } catch (err) {
      console.error("❌ Error submitting prescription:", err.response?.data || err.message);
      setMessage(err.response?.data?.error || "❌ Unknown error submitting prescription");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading consultation...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Doctor: Submit Prescription</h2>

      {message && (
        <p
          style={{
            padding: "10px",
            backgroundColor: message.startsWith("✅") ? "#d4edda" : "#f8d7da",
            color: message.startsWith("✅") ? "#155724" : "#721c24",
            borderRadius: "4px",
          }}
        >
          {message}
        </p>
      )}

      {/* Show patient details only if consultation exists */}
      {consultation && (
        <div style={{ marginBottom: "20px" }}>
          <p><strong>Patient Name:</strong> {consultation.patientName || "N/A"}</p>
          <p><strong>Mobile:</strong> {consultation.patientMobile || "N/A"}</p>
          <p><strong>Age:</strong> {consultation.age || "N/A"}</p>
          <p><strong>Gender:</strong> {consultation.gender || "N/A"}</p>
          <p><strong>Issue:</strong> {consultation.diseaseDescription || "N/A"}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <label>
          Doctor Name
          <input
            type="text"
            name="doctorName"
            value={form.doctorName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>

        <label>
          Diagnosis
          <textarea
            name="diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
            required
            rows={3}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>

        <label>
          Medicines
          <textarea
            name="medicines"
            value={form.medicines}
            onChange={handleChange}
            required
            rows={3}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>

        <label>
          Advice
          <textarea
            name="advice"
            value={form.advice}
            onChange={handleChange}
            required
            rows={3}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>

        <label>
          Patient Email
          <input
            type="email"
            name="patientEmail"
            value={form.patientEmail}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit Prescription"}
        </button>
      </form>
    </div>
  );
};

export default DoctorSubmitPrescriptionScreen;
