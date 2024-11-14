//  WRITE A PROGRAM TO COPY TEXT FROM CLIPBOARd
const express = require("express");
const app = express();
const path = require("path");

const socketio = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    console.log("New WebSocket connection");

    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
        // console.log("Clipboard data received:", data);
    });

    socket.on("disconnect", function () {
        io.emit("user-disconnected", socket.id);
    })
});

app.get("/", function (req, res) {
    res.render("index");
});

server.listen(3000, console.log("App is listening at port 3000"));

