// server.js
const http = require("http");
const cors = require("cors");

const app = require("./app"); // Import the app from app.js
const initializeSocket = require("./socket");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = initializeSocket(server); // `io` should now be properly returned
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  req.io = io;
  next();
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // Log when the server is running
});
