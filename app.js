const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const adminRoutes = require("./routes/adminRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const userRoutes = require("./routes/userRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const eventRoutes = require("./routes/eventRoutes");
const reportRoutes = require("./routes/reportRoutes");
const homePageRoutes = require("./routes/homePageRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const aboutPageRoutes = require("./routes/aboutPageRoutes");
const termsAndConditionsRoutes = require("./routes/termsAndConditionsRoutes");
const authRoutes = require("./routes/authRoutes");
const statsRoutes = require("./routes/statsRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const postRoutes = require("./routes/post");
const jobRoutes = require("./routes/job");
const connectDB = require("./config/db");

require("events").EventEmitter.defaultMaxListeners = 15;

dotenv.config();
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use("/uploads/", express.static("uploads"));

// Enable CORS
app.use(
  cors({
    origin: true, // dynamically reflects the request origin
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

connectDB();

// Use cookie-parser middleware
app.use(cookieParser());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/user", userRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/home", homePageRoutes);
app.use("/api/about", aboutPageRoutes);
app.use("/api/terms-and-conditions", termsAndConditionsRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", statsRoutes);
app.use("/api/system", uploadRoutes);
app.use("/api/post", postRoutes);
app.use("/api/job", jobRoutes);

app.get("/get", async (req, res) => {
  res.send("backend is sure running");
  console.log("backend is running");
});
module.exports = app;
