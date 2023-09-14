const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const redis = require("./lib/redis");
const { join } = require("node:path");
const cors = require("cors");
const app = express();
const server = createServer(app);
const io = new Server(server);
// app.get("/", (req, res) => {
//     res.send("<h1>Hello world</h1>")
// });

app.get("/", (req, res) => {
    res.sendFile(join(__dirname+"/index.html"));
});

// io.on("connection", (socket) => {
// 	console.log(`${socket.id} user is connected`)
// 	socket.emit('hello',socket.id);

//     socket.on("chat message", (msg) => {
//         socket.broadcast.emit("chat message", msg);

//         console.log("message: "+ msg);
//         // io.emit("chat message", msg);
//     });
//     socket.on("join room", () => {
//         console.log("join room");
//     })
//     socket.on("disconnect", () => {
//         console.log("user disconnected");
//     })
// });
app.use(cors());
io.on("connection", async (socket) => {
    console.log(`${socket.id} user is connected`);
    socket.on("login", async (UserPk) => {
        // console.log(`${UserPk} user's Socket Id: ${socket.id}`);
        await redis.setSocketId(UserPk, socket.id);
    })
    // socket.emit("notion", "공지");
    socket.on("inviteUser", async (UserPk) => {
        //방 생성
        await socket.join(socket.id);
        const participantSocketId = await redis.getSocketId(UserPk);
        // console.log(`participantSocketId: ${participantSocketId}`);
        // console.log(`${socket.id} room is created`)
        io.to(participantSocketId).emit("invite", socket.id);

    });

    socket.on("startPlay", async (roomId) => {
        //입장
        await socket.join(roomId);
        // console.log(`join on ${roomId}`)

    });
    socket.on("endPlay", async (roomId) => {
        //서버로 값 전달 필요
        // console.log("play end");
        await socket.leave(roomId);
    });


    socket.on("disconnect", async () => {
        // console.log(`${socket.id} user is disconnected`);
    });
});


server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
}) 