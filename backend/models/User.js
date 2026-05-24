const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  college: { type: String, default: "" },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  downloads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
