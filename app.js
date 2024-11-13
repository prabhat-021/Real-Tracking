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

app.get("/", function (req, res) {
    res.send("hey");
});

app.listen(3000, console.log("App is listening at port 3000"));

