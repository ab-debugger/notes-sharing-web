import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [tab, setTab] = useState("uploads");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    const endpoints = {
      uploads: "my-uploads",
      downloads: "downloads",
      bookmarks: "bookmarks",
    };
    const res = await axios.get(`/api/notes/${endpoints[tab]}`);
    setData(res.data);
  };

  const handleDownload = async (note) => {
    await axios.post(`/api/notes/download/${note._id}`);
    window.open(`http://localhost:5000${note.fileUrl}`, "_blank");
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: 20 }}>My Dashboard</h1>
      <div className="tabs">
        <button
          className={tab === "uploads" ? "active" : ""}
          onClick={() => setTab("uploads")}
        >
          📤 Uploaded ({tab === "uploads" ? data.length : ""})
        </button>
        <button
          className={tab === "downloads" ? "active" : ""}
          onClick={() => setTab("downloads")}
        >
          ⬇️ Downloaded
        </button>
        <button
          className={tab === "bookmarks" ? "active" : ""}
          onClick={() => setTab("bookmarks")}
        >
          ⭐ Bookmarks
        </button>
      </div>
      <div className="cards-grid">
        {data.map((note) => (
          <div className="card" key={note._id}>
            <div className="pdf-icon">PDF</div>
            <span className="subject">{note.subject}</span>
            <h3>{note.title}</h3>
            <p className="desc">{note.description || "No description"}</p>
            <p className="meta">📤 By {note.uploaderName}</p>
            <p className="meta">
              📅 {new Date(note.createdAt).toLocaleDateString()}
            </p>
            <p className="meta">🏷️ {note.category}</p>
            <div className="actions">
              <a
                className="btn-view"
                href={`http://localhost:5000${note.fileUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                View
              </a>
              <button
                className="btn-download"
                onClick={() => handleDownload(note)}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
      {data.length === 0 && <div className="empty">No items here yet</div>}
    </div>
  );
}
