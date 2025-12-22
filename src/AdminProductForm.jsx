import React, { useState } from "react";
import axios from "axios";
import "./AdminProductForm.css";

export default function AdminProductForm() {
  const BACKEND_URL = "http://localhost:8080";

  const [form, setForm] = useState({
    category: "",
    name: "",
    price: "",
    description: "",
    discount: "",
    tax: "",
  });

  const [variants, setVariants] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [manualUrls, setManualUrls] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

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

  // ================= VARIANTS =================
  const addVariant = () => {
    setVariants([...variants, { label: "", price: "", discount: "" }]);
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // ================= IMAGE UPLOAD =================
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
      alert("Images uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setLoadingUpload(false);
    }
  };

  // ================= CREATE PRODUCT =================
  const submitProduct = async () => {
    if (!form.category || !form.name || !form.price || !form.description) {
      alert("Please fill all required fields");
      return;
    }

    const finalImages = [
      ...uploadedUrls,
      ...manualUrls
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean),
    ];

    if (finalImages.length === 0) {
      alert("Please upload or add image URLs");
      return;
    }

    const cleanedVariants = variants
      .filter((v) => v.label && v.price)
      .map((v) => ({
        label: v.label,
        price: Number(v.price),
        discount: Number(v.discount) || 0,
      }));

    try {
      setLoadingSubmit(true);

      await axios.post(`${BACKEND_URL}/api/admin/products/create`, {
        ...form,
        price: Number(form.price),
        discount: Number(form.discount) || 0,
        tax: Number(form.tax) || 0,
        images: finalImages,
        variants: cleanedVariants,
      });

      alert("Product created successfully");

      setForm({
        category: "",
        name: "",
        price: "",
        description: "",
        discount: "",
        tax: "",
      });
      setVariants([]);
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
    <div className="admin-wrapper">
      <div className="admin-card">
        <h2>Create Product</h2>

        <div className="form-grid">
          <div>
            <label>Category *</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div>
            <label>Base Price *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} />
          </div>

          <div>
            <label>Discount %</label>
            <input type="number" name="discount" value={form.discount} onChange={handleChange} />
          </div>

          <div>
            <label>Tax %</label>
            <input type="number" name="tax" value={form.tax} onChange={handleChange} />
          </div>
        </div>

        <label>Description *</label>
        <textarea
          rows={4}
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        {/* VARIANTS */}
        <h3>Variants (Optional)</h3>

        {variants.map((variant, i) => (
          <div className="variant-row" key={i}>
            <input
              placeholder="Label (e.g. 200ml)"
              value={variant.label}
              onChange={(e) => updateVariant(i, "label", e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={variant.price}
              onChange={(e) => updateVariant(i, "price", e.target.value)}
            />
            <input
              type="number"
              placeholder="Discount %"
              value={variant.discount}
              onChange={(e) => updateVariant(i, "discount", e.target.value)}
            />
            <button className="remove-btn" onClick={() => removeVariant(i)}>
              ✕
            </button>
          </div>
        ))}

        <button className="secondary-btn" onClick={addVariant}>
          + Add Variant
        </button>

        {/* IMAGES */}
        <h3>Images</h3>

        <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />

        <button
          className="secondary-btn"
          onClick={uploadImages}
          disabled={loadingUpload}
        >
          {loadingUpload ? "Uploading..." : "Upload Images"}
        </button>

        <label>Or paste image URLs (one per line)</label>
        <textarea
          rows={3}
          value={manualUrls}
          onChange={(e) => setManualUrls(e.target.value)}
        />

        <button
          className="primary-btn"
          onClick={submitProduct}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "Saving..." : "Create Product"}
        </button>
      </div>
    </div>
  );
}
