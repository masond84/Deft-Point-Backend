require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize Express App
const app = express();
app.use(cors());
app.use(express.json());

// Root route to confirm backend is running
app.get("/", (req, res) => {
  res.send("Backend is running")
})


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 }) // Prevent long timeouts
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Keep-alive
setInterval(async () => {
  try {
      await mongoose.connection.db.admin().ping();
      console.log("✅ MongoDB Ping Successful (Keep-Alive)");
  } catch (error) {
      console.error("❌ MongoDB Ping Failed:", error);
  }
}, 60000); // Runs every 60 seconds

// Define Mongoose Schema
const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    tags: [String],
    category: String,
    timeTaken: String,
    startDate: String,
    endDate: String,
    technologies: [{ src: String, alt: String }],
    methods: [String],
});

const Project = mongoose.model("Project", projectSchema);

// API Endpoint to Fetch All Projects
app.get("/api/projects", async (req, res) => {
    try {
      const projects = await Project.find();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Error fetching projects", error });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;