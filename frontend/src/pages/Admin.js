import React, { useEffect, useState } from "react";
import API from "../api";

export default function Admin() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get("/api/notes/all");
      setNotes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const approveNote = async (id) => {
    try {
      await API.put(`/api/notes/approve/${id}`);
      alert("✅ Note Approved");
      fetchNotes();
    } catch (err) {
      alert("Error approving note");
    }
  };

  const deleteNote = async (id) => {
    try {
      await API.delete(`/api/notes/delete/${id}`);
      alert("🗑️ Note Deleted");
      fetchNotes();
    } catch (err) {
      alert("Error deleting note");
    }
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: "20px" }}>🛠 Admin Panel</h1>

      <div className="cards-grid">
        {notes.map((note) => (
          <div className="card" key={note._id}>
            <div className="pdf-icon">PDF</div>

            <span className="subject">{note.subject}</span>

            <h3>{note.title}</h3>

            <p className="desc">{note.description || "No description"}</p>

            <p className="meta">📤 By {note.uploaderName}</p>

            <p className="meta">🏷️ {note.category}</p>

            <p className="meta">
              Status:
              {note.approved ? " ✅ Approved" : " ⏳ Pending"}
            </p>

            <div className="actions">
              {!note.approved && (
                <button
                  className="btn-approve"
                  onClick={() => approveNote(note._id)}
                >
                  Approve
                </button>
              )}

              <button
                className="btn-delete"
                onClick={() => deleteNote(note._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
