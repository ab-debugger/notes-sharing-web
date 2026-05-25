const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Note = require("../models/Note");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.use(auth, admin);

// Get all users
router.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Get all notes
router.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// Delete user
router.delete("/user/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.json({
    msg: "User deleted",
  });
});

// Delete note
router.delete("/note/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);

  res.json({
    msg: "Note deleted",
  });
});

module.exports = router;
