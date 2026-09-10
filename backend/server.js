require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

const authRouters = require("./routes/authRoutes.js");

const workspaceRoutes = require("./routes/workspaceRoutes");

// Board routes
const boardRoutes = require("./routes/boardRoutes");

const columnRoutes = require("./routes/columnRoutes");

//tasks routes
const taskRoutes = require("./routes/taskRoutes");

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouters);

app.use("/api/workspaces", workspaceRoutes);

// Board Routes
app.use("/api", boardRoutes);

app.use("/api", columnRoutes);

//tasks routes
app.use("/api", taskRoutes);

const PORT = process.env.PORT || 5001;

// Health route
app.get("/api/health", function (req, res) {
    res.json({
        message: "yes the backend is running"
    });
});

app.post("/api/test", (req, res) => {
    console.log(req.body);

    res.json({
        message: "we have received the data sucessfully",
        data: req.body
    });
});

app.listen(PORT);