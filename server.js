// server.js
const app = require('./app'); // Import the app from app.js

const PORT = process.env.PORT || 3000;  // Use environment variable or default to 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);  // Log when the server is running
});
 