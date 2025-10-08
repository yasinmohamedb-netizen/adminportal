import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AdminOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [savingShippers, setSavingShippers] = useState({});

  const statusFlow = ["Pending", "Packed", "Shipped", "Delivered", "Completed"];

  // ---------------- Fetch Orders ----------------
  const fetchData = useCallback(async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const ordersRes = await axios.get(`http://localhost:8080/api/orders/all${query}`);
      if (!ordersRes.data.success) throw new Error("Failed to fetch orders");

      let fetchedOrders = ordersRes.data.orders;

      if (statusFilter) {
        fetchedOrders = fetchedOrders.filter((order) => order.status === statusFilter);
      }

      // Initialize shipperNameInput for each order
      fetchedOrders = fetchedOrders.map((o) => ({
        ...o,
        shipperNameInput: o.shipperName || "",
      }));

      setOrders(fetchedOrders);

      const requestsRes = await axios.get(`http://localhost:8080/api/return-requests/all${query}`);
      setRequests(requestsRes.data.requests || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      if (err.response) {
        setError(
          `Server Error ${err.response.status}: ${err.response.data.message || JSON.stringify(err.response.data)}`
        );
      } else if (err.request) {
        setError("No response from server. Check backend URL.");
      } else {
        setError(`Request Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // ---------------- Effects ----------------
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (startDate && endDate) {
      const query = `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      fetchData(query);
    } else {
      fetchData();
    }
  }, [startDate, endDate, fetchData]);

  // ---------------- Quick Filters ----------------
  const handleQuickFilter = (option) => {
    const now = new Date();
    if (option === "today") {
      setStartDate(new Date(now.setHours(0, 0, 0, 0)));
      setEndDate(new Date(now.setHours(23, 59, 59, 999)));
    } else if (option === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      setStartDate(new Date(yesterday.setHours(0, 0, 0, 0)));
      setEndDate(new Date(yesterday.setHours(23, 59, 59, 999)));
    } else if (option === "last1hr") {
      const past1Hr = new Date();
      past1Hr.setHours(now.getHours() - 1);
      setStartDate(past1Hr);
      setEndDate(now);
    } else if (option === "last2hr") {
      const past2Hr = new Date();
      past2Hr.setHours(now.getHours() - 2);
      setStartDate(past2Hr);
      setEndDate(now);
    } else if (option === "all") {
      setStartDate(null);
      setEndDate(null);
      setStatusFilter("");
    }
  };

  const handleApplyCustomFilter = () => {
    if (!startDate || !endDate) return alert("Please select both start and end dates.");
    const query = `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    fetchData(query);
  };

  // ---------------- Update Order Status ----------------
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
        );
      }
    } catch (err) {
      console.error("❌ Error updating status:", err.message);
      alert(`Failed to update status: ${err.message}`);
    }
  };

  // ---------------- Save Shipper ----------------
  const saveShipper = async (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    const shipperName = order?.shipperNameInput?.trim();
    if (!shipperName) return alert("Please enter a shipper name.");

    setSavingShippers((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await axios.put(`http://localhost:8080/api/orders/${orderId}/shipper`, { shipperName });
      if (res.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o._id === orderId ? { ...o, shipperName, shipperNameInput: shipperName } : o
          )
        );
      }
    } catch (err) {
      console.error("❌ Error saving shipper:", err.message);
      alert("Failed to save shipper.");
    } finally {
      setSavingShippers((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const getRowColor = (order) => {
    const status = order.status || "Pending";
    if (status === "Completed") return "#d4edda";
    if (status === "Pending") {
      const createdTime = new Date(order.createdAt).getTime();
      const now = Date.now();
      const diffHours = (now - createdTime) / (1000 * 60 * 60);
      return diffHours <= 2 ? "#fff3cd" : "#ffe5b4";
    }
    if (status === "Shipped") return "#d1ecf1";
    if (status === "Delivered") return "#f8d7da";
    if (status === "Packed") return "#e2e3e5";
    return "#f8f9fa";
  };

  const getRequestsForOrder = (orderId) => requests.filter((req) => req.orderId === orderId);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Admin Orders Dashboard</h2>

      {/* Filters */}
      <div style={{ margin: "10px 0" }}>
        <button onClick={() => handleQuickFilter("today")} style={{ marginRight: 10 }}>Today</button>
        <button onClick={() => handleQuickFilter("yesterday")} style={{ marginRight: 10 }}>Yesterday</button>
        <button onClick={() => handleQuickFilter("last1hr")} style={{ marginRight: 10 }}>Last 1 Hour</button>
        <button onClick={() => handleQuickFilter("last2hr")} style={{ marginRight: 10 }}>Last 2 Hours</button>
        <button onClick={() => handleQuickFilter("all")} style={{ marginRight: 10 }}>All Orders</button>

        <span>Status: </span>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ marginRight: 10 }}>
          <option value="">All</option>
          {statusFlow.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <span>Custom Date: </span>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="End Date"
        />
        <button onClick={handleApplyCustomFilter} style={{ marginLeft: 10 }}>Apply</button>
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No orders yet.</p>}

      {!loading && !error && orders.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={thStyle}>Order ID</th>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Date & Time</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Payment</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Shipper</th>
              <th style={thStyle}>Actions</th>
              <th style={thStyle}>Return / Cancel Requests</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const dateTime = new Date(order.createdAt).toLocaleString();
              const userName = order.userId?.fullName || order.userName;
              const status = order.status || "Pending";
              const color = getRowColor(order);
              const orderRequests = getRequestsForOrder(order._id);

              return (
                <tr key={order._id} style={{ backgroundColor: color }}>
                  <td style={tdStyle}>{order._id}</td>
                  <td style={tdStyle}>{userName}</td>
                  <td style={tdStyle}>{dateTime}</td>
                  <td style={tdStyle}>₹{order.totalAmount}</td>
                  <td style={tdStyle}>{order.paymentMethod}</td>
                  <td style={tdStyle}>{status}</td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={order.shipperNameInput || ""}
                      placeholder="Assign shipper"
                      onChange={(e) =>
                        setOrders((prevOrders) =>
                          prevOrders.map((o) =>
                            o._id === order._id ? { ...o, shipperNameInput: e.target.value } : o
                          )
                        )
                      }
                    />
                    <button
                      onClick={() => saveShipper(order._id)}
                      disabled={savingShippers[order._id]}
                      style={{ marginLeft: 5 }}
                    >
                      {savingShippers[order._id] ? "Saving..." : "Save"}
                    </button>
                  </td>
                  <td style={tdStyle}>
                    {status !== "Completed" ? (
                      <select
                        value={status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                      >
                        {statusFlow.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <span>✅ Completed</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    {orderRequests.length > 0 ? (
                      orderRequests.map((req) => (
                        <div key={req._id} style={{ marginBottom: "5px" }}>
                          <strong>{req.type}</strong>: {req.status}
                        </div>
                      ))
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = { border: "1px solid #ddd", padding: "8px" };
const tdStyle = { border: "1px solid #ddd", padding: "8px" };

export default AdminOrdersDashboard;
