import React, { useState } from "react";
import axios from "axios";

export default function AdminProductForm() {
  const BACKEND_URL = "https://healthyz-backend.onrender.com";

  const [form, setForm] = useState({
    category: "",
    name: "",
    price: "",
    description: "",
    discount: "",
    tax: "",
  });

  const [files, setFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [manualUrls, setManualUrls] = useState(""); // NEW FIELD
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // All categories matching your backend
  const categories = [
    "babycare",
    "beauty",
    "gym",
    "medicines",
    "surgical",
    "sexual",
    "products",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -------------------------------------------
  // UPLOAD IMAGES TO BACKEND → S3
  // -------------------------------------------
  const uploadImages = async () => {
    if (files.length === 0) {
      alert("Please select images");
      return;
    }

    try {
      setLoadingUpload(true);

      const fd = new FormData();
      files.forEach((file) => fd.append("images", file));

      const res = await axios.post(
        `${BACKEND_URL}/api/admin/products/upload`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploadedUrls(res.data.urls);
      alert("Images uploaded!");
    } catch (err) {
      alert("Image upload failed");
      console.error(err);
    } finally {
      setLoadingUpload(false);
    }
  };

  // -------------------------------------------
  // CREATE PRODUCT IN DB
  // -------------------------------------------
  const submitProduct = async () => {
    if (!form.category || !form.name || !form.price || !form.description) {
      alert("Please fill all required fields");
      return;
    }

    // Convert manual URLs into array
    let urlList = manualUrls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    // Combine manual URLs + uploaded S3 URLs
    const finalImages = [...uploadedUrls, ...urlList];

    if (finalImages.length === 0) {
      alert("Please upload images or paste image URLs");
      return;
    }

    try {
      setLoadingSubmit(true);

      const res = await axios.post(
        `${BACKEND_URL}/api/admin/products/create`,
        {
          ...form,
          price: Number(form.price),
          discount: Number(form.discount) || 0,
          tax: Number(form.tax) || 0,
          images: finalImages,
        }
      );

      alert("Product Created!");

      // Reset form
      setForm({
        category: "",
        name: "",
        price: "",
        description: "",
        discount: "",
        tax: "",
      });
      setFiles([]);
      setUploadedUrls([]);
      setManualUrls("");
    } catch (err) {
      console.error(err);
      alert("Failed to create product");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Create Product</h2>

      {/* CATEGORY */}
      <label>Category *</label>
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c.toUpperCase()}
          </option>
        ))}
      </select>

      {/* NAME */}
      <label>Name *</label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Product Name"
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
      />

      {/* PRICE */}
      <label>Price *</label>
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Product Price"
        type="number"
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
      />

      {/* DISCOUNT */}
      <label>Discount</label>
      <input
        name="discount"
        value={form.discount}
        onChange={handleChange}
        placeholder="Discount %"
        type="number"
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
      />

      {/* TAX */}
      <label>Tax</label>
      <input
        name="tax"
        value={form.tax}
        onChange={handleChange}
        placeholder="Tax %"
        type="number"
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
      />

      {/* DESCRIPTION */}
      <label>Description *</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Product Description"
        rows="4"
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
      ></textarea>

      {/* IMAGES UPLOAD */}
      <label>Upload Images *</label>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
        style={{ marginBottom: "10px" }}
      />

      {files.length > 0 && <p>{files.length} files selected</p>}

      <button
        onClick={uploadImages}
        disabled={loadingUpload}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "15px",
          background: loadingUpload ? "#ccc" : "#2a7bf3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {loadingUpload ? "Uploading..." : "Upload Images"}
      </button>

      {/* MANUAL IMAGE URL INPUT */}
      <label>Or Paste Image URLs (one per line)</label>
      <textarea
        value={manualUrls}
        onChange={(e) => setManualUrls(e.target.value)}
        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
        rows="4"
        style={{ width: "100%", padding: "8px", marginTop: "5px", marginBottom: "15px" }}
      ></textarea>

      <button
        onClick={submitProduct}
        disabled={loadingSubmit}
        style={{
          padding: "10px",
          width: "100%",
          background: loadingSubmit ? "#ccc" : "#10b759",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {loadingSubmit ? "Saving..." : "Create Product"}
      </button>
    </div>
  );
}
