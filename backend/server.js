require("dotenv").config();

const express = require("express"); 
const cors = require("cors");//frontedn and baked may run on diff origins and browser dont allow certain origins 
//so this cors middleware helps to connect forntend and backend and work even being on diff origins

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
app.use(express.json()); //frontend se info comes in json so , this parses it and makes it available as req.body

// Registering Authentication Routes
app.use("/api/auth", authRouters);//means all paths defined in suthRouters.js so all will reciebe the base path as : /api/auth

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