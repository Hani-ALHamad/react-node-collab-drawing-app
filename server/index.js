const express = require('express')
const path = require("path");
const http = require('http')
const socketio = require('socket.io')
const { newUser, removeUser, getRoomUsers } = require("./utils")


const port = process.env.PORT

// express
const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.json())


io.on('connection', (socket) => {
  console.log("new connection")
  // socket.on("join", () => {
  //   io.to("room").emit("message", "joined")
  // })

  socket.on("tryToJoin", (data, callback) => {
    // callback("erooor") // for error
    const user = newUser({id:socket.id, username: data.username, room: data.room})
    if(user.error){
      return callback(user.error)
    }
    console.log(user)
    socket.join(user.room)
    socket.broadcast.to(user.room).emit("systemMessage", "joined")
    callback()
  })


  socket.on("disconnect", () => {
    removeUser(socket.id)

  })


  socket.on("disconnectEmit", (k) => {
    console.log(k)
  })

  socket.on("getUsersData", (room, callback) => {
    const users = getRoomUsers(room)
    callback(users)
  })

  socket.on('sendMessage', (message, callback) => {
    console.log(message)
    callback()
  })
})



// necessary when using reactjs & nodejs together
app.use(express.static(path.resolve(__dirname, "../client/build")));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build', 'index.html')))


server.listen(port, () => {
  console.log(`Server is running on ${port} `)
})
