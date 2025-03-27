const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Use express.json() instead of body-parser

// MongoDB Atlas connection
const MONGO_URI =
  "mongodb+srv://jobinshaji111:jobin123@cluster0.rw0xz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Error connecting to MongoDB Atlas:", error));

// Define a Mongoose schema and model
const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
});

const Task = mongoose.model("Task", taskSchema);

// Route to insert sample data
app.get("/insert-sample", async (req, res) => {
  try {
    const sampleTasks = [
      { task: "sdsadsad  1" },
      { task: "Sample Task 2" },
      { task: "Sample Task 3" },
    ];
    await Task.insertMany(sampleTasks);
    res.send("Sample tasks inserted successfully!");
  } catch (error) {
    console.error("Error inserting sample tasks:", error);
    res.status(500).send("Error inserting sample tasks");
  }
});

// Route to insert data from the frontend
app.post("/tasks", async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) {
      return res.status(400).json({ error: "Task is required" });
    }
    const newTask = new Task({ task });
    await newTask.save();
    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).send("Error adding task");
  }
});

// Route to fetch all tasks from the database
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetch all tasks from the database
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Error fetching tasks");
  }
});

// Route to delete a task from the database
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id); // Find and delete the task by ID
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Error deleting task");
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
