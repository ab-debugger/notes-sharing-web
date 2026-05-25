const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Note = require("../models/Note");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();
const admin = require("../middleware/admin");

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Upload a note
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    const { title, subject, description, category } = req.body;
    const user = await User.findById(req.user.id);

    const note = new Note({
      title,
      subject,
      description,
      category,
      approved: false,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      uploadedBy: req.user.id,
      uploaderName: user.name,
    });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all notes
router.get("/", async (req, res) => {
  const notes = await Note.find({ approved: true }).sort({ createdAt: -1 });
  res.json(notes);
});

//ALL NOTES Route
router.get("/all", auth, admin, async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get my uploaded notes
router.get("/my-uploads", auth, async (req, res) => {
  const notes = await Note.find({ uploadedBy: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(notes);
});

// Get my bookmarks
router.get("/bookmarks", auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("bookmarks");
  res.json(user.bookmarks);
});

// Get my downloads
router.get("/downloads", auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("downloads");
  res.json(user.downloads);
});

// Bookmark/unbookmark
router.post("/bookmark/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const idx = user.bookmarks.indexOf(req.params.id);
  if (idx > -1) user.bookmarks.splice(idx, 1);
  else user.bookmarks.push(req.params.id);
  await user.save();
  res.json(user.bookmarks);
});

// Record download
router.post("/download/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user.downloads.includes(req.params.id)) {
    user.downloads.push(req.params.id);
    await user.save();
  }
  await Note.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } });
  res.json({ msg: "Recorded" });
});

//APPROVE Note
router.put("/approve/:id", auth, admin, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true },
    );

    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

//DELETE Note
router.delete("/delete/:id", auth, admin, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);

    res.json({
      msg: "Note deleted",
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
