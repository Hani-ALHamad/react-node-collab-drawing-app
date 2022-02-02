const express = require('express')
const path = require("path");
const http = require('http')
const socketio = require('socket.io')
const { newUser, removeUser, getRoomUsers, getUser } = require("./utils")


const port = process.env.PORT

// express
const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.json())


io.on('connection', (socket) => {
  console.log("new connection")
  socket.on("tryToJoin", (data, callback) => {
    const user = newUser({id:socket.id, username: data.username, room: data.room})
    if(user.error){
      return callback(user.error)
    }

    socket.join(data.room)
    const users = getRoomUsers(data.room)
    socket.broadcast.to(data.room).emit("sendUsersData", users)
    socket.broadcast.to(data.room).emit("sendMessageToRoom", { user: "", message: `${data.username} has joined the room.` })
    callback()
  })


  socket.on("disconnect", () => {
    const user = removeUser(socket.id)
    if (user) {
      const users = getRoomUsers(user.room)
      if (user && users.length > 0) {
        socket.broadcast.to(user.room).emit("sendUsersData", users)
        socket.broadcast.to(user.room).emit("sendMessageToRoom", { user: "", message: `${user.username} was disconnected from the room.` })
        if(user.role === "leader") {
          users[0].role = "leader"
          socket.broadcast.to(user.room).emit("sendMessageToRoom", { user: "", message: `${users[0].username} was promoted to leader.` })
        }
      }
    }
  })

  socket.on("getUsersData", (room, callback) => {
    const users = getRoomUsers(room)
    socket.broadcast.to(room).emit("sendUsersData", users)
    callback(users)
  })

  socket.on('sendMessage', (data) => {
    // console.log(data)
    console.log(socket.id)
    console.log(socket.rooms)
    console.log(io.sockets.adapter.rooms.has(data.room))
    io.to(data.room).emit("sendMessageToRoom", {user: data.username ,message: data.messageInput})
  })

  socket.on("handleBrushChange", (data) => {
    const user = getUser(data.id)
    if(user){
      user.brush = !user.brush
      const users = getRoomUsers(user.room)
      socket.broadcast.to(user.room).emit("sendUsersData", users)
    }
  })

  socket.on("handleEraserChange", (data) => {
    const user = getUser(data.id)
    if (user) {
      user.eraser = !user.eraser
      const users = getRoomUsers(user.room)
      socket.broadcast.to(user.room).emit("sendUsersData", users)
    }
  })

  socket.on("handleLeave", (data) => {
    const user = removeUser(data.id)
    const users = getRoomUsers(data.room)
    if(user && users.length > 0){
      if(user.role === "leader"){
        users[0].role = "leader"
        socket.broadcast.to(user.room).emit("sendMessageToRoom", { user: "", message: `${user.username} left the room.` })
        socket.broadcast.to(user.room).emit("sendMessageToRoom", { user: "", message: `${users[0].username} was promoted to leader.` })
      } else {
        socket.broadcast.to(user.room).emit("sendMessageToRoom", { user: "", message: `${user.username} left the room.` })
      }
      console.log("sent", user.room)
      console.log(users)
      io.to(user.room).emit("sendUsersData", users)
    }
  })


  socket.on("handleKick", (data) => {
    const user = removeUser(data.id)
    const users = getRoomUsers(data.room)
    if (user && users.length > 0) {
        io.to(user.room).emit("sendMessageToRoom", { user: "", message: `${user.username} was kicked from the room.` })
        io.to(user.room).emit("sendUsersData", users)
      }
      console.log("sent", user.room)
      console.log(users)
    })

  socket.on("handlePromoting", (data) => {
    const prevLeader = getUser(socket.id)
    const user = getUser(data.id)
    const users = getRoomUsers(data.room)
    if (user) {
      prevLeader.role = "member"
      user.role = "leader"
      io.to(user.room).emit("sendUsersData", users)
      io.to(user.room).emit("sendMessageToRoom", { user: "", message: `${user.username} was promoted to leader.` })
    }
  })


  socket.on("sendCanvas", (data) => {
    console.log(data)
      socket.broadcast.to(data[0]).emit("sendCanvasToUsers", data)
  })

  socket.on("clearOld", (room) => {
    socket.broadcast.to(room).emit("clearOldForUsers")
  })

  socket.on("clearCanvas", (room) => {
    io.to(room).emit("clearCanvasToUsers")
  })
})





// necessary when using reactjs & nodejs together
app.use(express.static(path.resolve(__dirname, "../client/build")));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build', 'index.html')))


server.listen(port, () => {
  console.log(`Server is running on ${port} `)
})
