const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
const tasks = [];

let userId = 1;
let taskId = 1;

// Test
app.get("/", (req, res) => {
    res.send("Smart Task Manager Backend Running");
});

// Get users
app.get("/api/users", (req, res) => {
    res.json(users);
});

// Create user
app.post("/api/users", (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    const user = {
        id: String(userId++),
        name,
        email
    };

    users.push(user);

    res.json({
        message: "User created successfully",
        user
    });
});

// Login
app.post("/api/users/login", (req, res) => {
    const { email } = req.body;

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json({
        message: "Login successful",
        user
    });
});

// Get tasks
app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

// Create task
app.post("/api/tasks", (req, res) => {
    const {
        title,
        description,
        priority,
        status,
        assignedTo,
        dependency
    } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const task = {
        id: String(taskId++),
        title,
        description: description || "",
        priority: priority || "Medium",
        status: status || "To Do",
        assignedTo: assignedTo || null,
        dependency: dependency || null
    };

    tasks.push(task);

    res.json({
        message: "Task created successfully",
        task
    });
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => {
    const index = tasks.findIndex(t => t.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    tasks.splice(index, 1);

    res.json({
        message: "Task deleted successfully"
    });
});

// Update task
app.put("/api/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    Object.assign(task, req.body);

    res.json({
        message: "Task updated successfully",
        task
    });
});

// Start server
app.listen(5000, () => {
    console.log("=================================");
    console.log("Backend running on port 5000");
    console.log("http://localhost:5000");
    console.log("=================================");
});