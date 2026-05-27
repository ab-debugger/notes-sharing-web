import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    category: "Notes",
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");
    const data = new FormData();
    Object.keys(form).forEach((k) => data.append(k, form[k]));
    data.append("file", file);
    try {
      await axios.post("/api/notes/upload", data);
      alert("✅ Uploaded successfully!, Wait for admin approval");
      navigate("/dashboard");
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className="auth-box">
      <h2>Upload Study Material</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          required
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Subject"
          required
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
        <textarea
          placeholder="Description"
          rows="3"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <select
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="Notes">Notes</option>
          <option value="PYQ">Previous Year Questions</option>
          <option value="Study Material">Study Material</option>
        </select>
        <input
          type="file"
          accept=".pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
