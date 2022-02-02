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

// io connection (container)
io.on('connection', (socket) => {
  console.log("new connection")

  // when someone tries to join
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

  // when someone disconnects (refreshes the page, or closes the tab)
  socket.on("disconnect", () => {
    const user = removeUser(socket.id)
    if (user) {
      const users = getRoomUsers(user.room)
      if (user && users.length > 0) {
        socket.broadcast.to(user.room).emit("sendUsersData", users)
        socket.broadcast.to(user.room).emit("sendMessageToRoom", { user: "", message: `${user.username} was disconnected from the room.` })
        if(user.role === "leader") {
          users[0].role = "leader"
          socket.broadcast.to(user.room).emit("sendMessageToRoom", { user: "", message: `${users[0].username} was promoted to leader. Please wait for few seconds to get the leader permissions.` })
        }
      }
    }
  })

  // to get users data and send them to room users
  socket.on("getUsersData", (room, callback) => {
    const users = getRoomUsers(room)
    socket.broadcast.to(room).emit("sendUsersData", users)
    callback(users)
  })

  // on sending messages
  socket.on('sendMessage', (data) => {
    io.to(data.room).emit("sendMessageToRoom", {user: data.username ,message: data.messageInput})
  })

  // on brush permission change
  socket.on("handleBrushChange", (data) => {
    const user = getUser(data.id)
    if(user){
      user.brush = !user.brush
      const users = getRoomUsers(user.room)
      socket.broadcast.to(user.room).emit("sendUsersData", users)
    }
  })

  // on eraser permission change
  socket.on("handleEraserChange", (data) => {
    const user = getUser(data.id)
    if (user) {
      user.eraser = !user.eraser
      const users = getRoomUsers(user.room)
      socket.broadcast.to(user.room).emit("sendUsersData", users)
    }
  })

  // when someone leaves, if leader left the permession will be given to someone else (users[0])
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
      io.to(user.room).emit("sendUsersData", users)
    }
  })

  // when somone gets kicked out
  socket.on("handleKick", (data) => {
    const user = removeUser(data.id)
    const users = getRoomUsers(data.room)
    if (user && users.length > 0) {
        io.to(user.room).emit("sendMessageToRoom", { user: "", message: `${user.username} was kicked from the room.` })
        io.to(user.room).emit("sendUsersData", users)
      }
    })

  // when someone gets promoted
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

  // sends canvas (x, y, brush width, brush color) to other users
  socket.on("sendCanvas", (data) => {
      socket.broadcast.to(data[0]).emit("sendCanvasToUsers", data)
  })

  // sends an order to all clients to clear "old" variable in canvas.js file
  socket.on("clearOld", (room) => {
    socket.broadcast.to(room).emit("clearOldForUsers")
  })

  // makes everyone in the room clear their canvas
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