// server.js
const http = require("http");
const cors = require("cors");

const app = require("./app"); // Import the app from app.js
const initializeSocket = require("./socket");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app); // Create server ONCE
const io = initializeSocket(server);   // Initialize socket ONCE

app.set("io", io);
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // Log when the server is running
});
