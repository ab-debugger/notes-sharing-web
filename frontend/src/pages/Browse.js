import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Browse() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await axios.get("/api/notes");
    setNotes(res.data);
  };

  const handleDownload = async (note) => {
    if (token) await axios.post(`/api/notes/download/${note._id}`);
    window.open(`http://localhost:5000${note.fileUrl}`, "_blank");
  };

  const handleBookmark = async (id) => {
    if (!token) return alert("Please login to bookmark");
    await axios.post(`/api/notes/bookmark/${id}`);
    alert("Bookmark toggled!");
  };

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container">
      <div className="hero">
        <h1>📚 StudyShare</h1>
        <p>Share & Discover Notes, PYQs and Study Materials</p>
      </div>
      <input
        placeholder="🔍 Search by title or subject..."
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 20,
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="cards-grid">
        {filtered.map((note) => (
          <div className="card" key={note._id}>
            <div className="pdf-icon">PDF</div>
            <span className="subject">{note.subject}</span>
            <h3>{note.title}</h3>
            <p className="desc">{note.description || "No description"}</p>
            <p className="meta">📤 By {note.uploaderName}</p>
            <p className="meta">
              📅 {new Date(note.createdAt).toLocaleDateString()}
            </p>
            <p className="meta">
              🏷️ {note.category} • ⬇️ {note.downloadCount}
            </p>
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
              {user && (
                <button
                  className="btn-bookmark"
                  onClick={() => handleBookmark(note._id)}
                >
                  ★
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="empty">No notes found</div>}
    </div>
  );
}
