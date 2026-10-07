const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("./models/Student");
const app = express();

app.use(cors());
app.use(express.json());

let connPromise;
app.use(async (req, res, next) => {
  try {
    if (!connPromise) connPromise = mongoose.connect(process.env.MONGO_URI);
    await connPromise;
    next();
  } catch (err) {
    connPromise = null;
    console.error("MONGODB connection error:", err);
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
});

app.get("/", (req, res) => res.send("Server is running"));

app.get("/students", async (req, res) => {
  try {
    res.json(await Student.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(5000, () => console.log("Server running on port 5000"));
}

module.exports = app;