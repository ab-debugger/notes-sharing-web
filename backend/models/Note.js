const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, default: "" },
  category: {
    type: String,
    enum: ["Notes", "PYQ", "Study Material"],
    default: "Notes",
  },
  approved: {
    type: Boolean,
    default: false,
  },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploaderName: { type: String, required: true },
  downloadCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", NoteSchema);
