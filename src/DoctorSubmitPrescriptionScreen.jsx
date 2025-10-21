import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://healthyz-backend.onrender.com/api";

const defaultForm = {
  doctorName: "",
  diagnosis: "",
  complaints: "",
  findings: "",
  medicines: [{ name: "", dosage: "", duration: "", detail: "" }],
  advice: [""],
  followUp: "",
  patientEmail: "",
};

const DoctorSubmitPrescriptionScreen = () => {
  const { consultationId } = useParams();
  const [consultation, setConsultation] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!consultationId || consultationId === "undefined") {
      setLoading(false);
      setConsultation(null);
      setMessage("Manual Prescription Entry – No consultation loaded");
      return;
    }

    // Fetch consultation details (for displaying in header + autofill patient email)
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
      } catch (err) {
        setConsultation(null);
        setMessage("❌ Consultation not found or backend error");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultation();
  }, [consultationId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Dynamic medicines
  const handleMedicineChange = (idx, field, value) => {
    setForm((prev) => {
      const arr = [...prev.medicines];
      arr[idx][field] = value;
      return { ...prev, medicines: arr };
    });
  };
  const addMedicine = () => {
    setForm((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { name: "", dosage: "", duration: "", detail: "" }]
    }));
  };
  const removeMedicine = (idx) => {
    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== idx)
    }));
  };

  // Dynamic advice
  const handleAdviceChange = (idx, value) => {
    setForm((prev) => {
      const arr = [...prev.advice];
      arr[idx] = value;
      return { ...prev, advice: arr };
    });
  };
  const addAdvice = () =>
    setForm((prev) => ({ ...prev, advice: [...prev.advice, ""] }));
  const removeAdvice = (idx) =>
    setForm((prev) => ({
      ...prev,
      advice: prev.advice.filter((_, i) => i !== idx)
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientEmail) {
      setMessage("❌ Patient email is required");
      return;
    }
    setSubmitting(true);
    setMessage("Submitting prescription...");
    try {
      await axios.post(
        `${API_BASE}/consultations/${consultationId}/submit-prescription`,
        form
      );
      setMessage("✅ Prescription submitted successfully!");
      setForm(defaultForm);
    } catch (err) {
      setMessage(
        err.response?.data?.error || "❌ Unknown error submitting prescription"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <p>Loading consultation...</p>;

  return (
    <div style={{ maxWidth: "650px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
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

      {consultation && (
        <div style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
          <p><strong>Patient Name:</strong> {consultation.patientName || "N/A"}</p>
          <p><strong>Mobile:</strong> {consultation.patientMobile || "N/A"}</p>
          <p><strong>Age:</strong> {consultation.age || "N/A"}</p>
          <p><strong>Gender:</strong> {consultation.gender || "N/A"}</p>
          <p><strong>Issue:</strong> {consultation.diseaseDescription || "N/A"}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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
            rows={2}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>
        <label>
          Chief Complaints
          <textarea
            name="complaints"
            value={form.complaints}
            onChange={handleChange}
            rows={2}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>
        <label>
          Clinical Findings
          <textarea
            name="findings"
            value={form.findings}
            onChange={handleChange}
            rows={2}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>
        <div>
          <label>Medicines</label>
          {form.medicines.map((med, idx) => (
            <div key={idx} style={{ display: "flex", gap: "7px", marginBottom: "7px" }}>
              <input
                type="text"
                placeholder="Name"
                value={med.name}
                onChange={e => handleMedicineChange(idx, "name", e.target.value)}
                style={{ flex: 2, padding: "6px" }}
              />
              <input
                type="text"
                placeholder="Dosage"
                value={med.dosage}
                onChange={e => handleMedicineChange(idx, "dosage", e.target.value)}
                style={{ flex: 1, padding: "6px" }}
              />
              <input
                type="text"
                placeholder="Duration"
                value={med.duration}
                onChange={e => handleMedicineChange(idx, "duration", e.target.value)}
                style={{ flex: 1, padding: "6px" }}
              />
              <input
                type="text"
                placeholder="Detail (optional)"
                value={med.detail}
                onChange={e => handleMedicineChange(idx, "detail", e.target.value)}
                style={{ flex: 1, padding: "6px" }}
              />
              <button type="button" onClick={() => removeMedicine(idx)} style={{ color: "red", fontWeight: "bold" }}>&times;</button>
            </div>
          ))}
          <button type="button" onClick={addMedicine} style={{ marginTop: "5px" }}>Add Medicine</button>
        </div>
        <div>
          <label>Advice</label>
          {form.advice.map((ad, idx) => (
            <div key={idx} style={{ display: "flex", gap: "7px", marginBottom: "7px" }}>
              <input
                type="text"
                placeholder="Advice"
                value={ad}
                onChange={e => handleAdviceChange(idx, e.target.value)}
                style={{ flex: 1, padding: "6px" }}
              />
              <button type="button" onClick={() => removeAdvice(idx)} style={{ color: "red", fontWeight: "bold" }}>&times;</button>
            </div>
          ))}
          <button type="button" onClick={addAdvice} style={{ marginTop: "5px" }}>Add Advice</button>
        </div>
        <label>
          Follow Up
          <input
            type="text"
            name="followUp"
            value={form.followUp}
            onChange={handleChange}
            placeholder="Next visit or notes"
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
