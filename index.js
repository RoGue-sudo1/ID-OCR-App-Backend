// Import required modules
// const fileupload = require("express-fileupload"); 
const express = require("express");
const cors = require("cors");

// Create an instance of the Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) middleware
app.use(
    cors({
      origin: ["http://localhost:3000"], // Whitelist allowed origins
      methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"], // Specify allowed HTTP methods
    })
);

// Parse incoming JSON requests
app.use(express.json());

// Use the defined routes from the "routes" module
app.use("/", require("./routes"));

// Set the port for the server to listen on
const port = "5000";

// Start the server and listen on the specified port
app.listen(port, () => console.log(`Listening on port ${port}`));