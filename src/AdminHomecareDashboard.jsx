import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminHomecareDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/bookings");
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/bookings/${id}/status`, { status: newStatus });
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)));
    } catch (err) {
      console.error("❌ Error updating status:", err);
    }
  };

  return (
    <div>
      <h2>🏠 Homecare Bookings Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Patient Name</th>
              <th>Mobile</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Service</th>
              <th>Days</th>
              <th>Preferred Date</th>
              <th>Time Slot</th>
              <th>Address</th>
              <th>Notes</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="13" style={{ textAlign: "center" }}>No bookings found</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b._id}</td>
                  <td>{b.userName || b.patientName}</td>
                  <td>{b.userMobile || b.mobile}</td>
                  <td>{b.age || "N/A"}</td>
                  <td>{b.gender || "N/A"}</td>
                  <td>{b.serviceName || b.serviceType}</td>
                  <td>{b.days ? b.days.length : 0}</td>
                  <td>{b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : "N/A"}</td>
                  <td>{b.timeSlot || "N/A"}</td>
                  <td>{b.address || "N/A"}</td>
                  <td>{b.notes || "N/A"}</td>
                  <td>
                    <select value={b.status || "pending"} onChange={(e) => updateStatus(b._id, e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="carer sent">Carer Sent</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td>{b.createdAt ? new Date(b.createdAt).toLocaleString() : "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminHomecareDashboard;
