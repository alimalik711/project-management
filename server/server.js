const express = require('express');
const  pool  = require('./config/db');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes')
const commentRoutes = require('./routes/commentRoutes')
const fileRoutes = require('./routes/fileRoutes')
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes");
const cookieParser = require("cookie-parser");
const path = require("path");




const app = express();
require('dotenv').config();

const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());


app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


app.use(express.json());
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications",notificationRoutes)
app.use("/api/dashboard", dashboardRoutes);



app.use((error, req, res, next) => {
    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            message:
                "Avatar must be smaller than 5 MB"
        });
    }

    if (
        error.message ===
        "Only JPG, PNG and WEBP images are allowed"
    ) {
        return res.status(400).json({
            message: error.message
        });
    }

    next(error);
});


app.use((error, req, res, next) => {
    console.error(error);

    return res.status(500).json({
        message: "Internal Server Error"
    });
});




const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (error) => {
  console.error("Server error:", error);
});

process.on("exit", (code) => {
  console.log("Node exited with code:", code);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
});