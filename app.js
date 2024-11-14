// Import the Express framework to create an HTTP server
const express = require("express");
const app = express();

// Import the 'path' module to work with file and directory paths
const path = require("path");

// Import 'socket.io' for real-time communication and 'http' to create the server
const socketio = require("socket.io");
const http = require("http");

// Create an HTTP server to handle requests and responses
const server = http.createServer(app);

// Initialize socket.io on the server for WebSocket connections
const io = socketio(server);

// Set the view engine to EJS for rendering dynamic HTML files
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Handle a new WebSocket connection
io.on("connection", function (socket) {
    console.log("New WebSocket connection");

    // Listen for the 'send-location' event from the client, which sends clipboard data
    socket.on("send-location", (data) => {
        // Emit 'receive-location' event to all clients with the received data
        io.emit("receive-location", { id: socket.id, ...data });
        // Optionally log the received clipboard data
        // console.log("Clipboard data received:", data);
    });

    // Handle the disconnection of a WebSocket connection
    socket.on("disconnect", function () {
        // Emit 'user-disconnected' event to notify other clients that a user has disconnected
        io.emit("user-disconnected", socket.id);
    });
});

// Define a route to render the index page
app.get("/", function (req, res) {
    res.render("index");
});

// Start the server on port 3000 and log a message when it is running
server.listen(3000, console.log("App is listening at port 3000"));
