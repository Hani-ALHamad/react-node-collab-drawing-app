const users = []

// to make a new user, checks if the username in the exact room is taken or not
// checks if room is full as well
// and checks if the user should be leader or not
const newUser = ({id, username, room}) => {
  const existingUser = users.find((user) => {
    return user.username.toLowerCase() === username.toLowerCase().trim() && user.room === room.trim()
  })

  if(existingUser){
    return {error: `${username} name is already used by someone else in ${room} room, if you're sure that ${username} name is not taken in that room please wait for few seconds until the room refreshes.`}
  }
  
  const usersInRoom = getRoomUsers(room)

  if(usersInRoom.length > 4){
    return { error: `${room} room is full, if you're sure that ${room} is not full please wait for few seconds until the room refreshes.` }
  }

  if(usersInRoom.length === 0){
    var role = "leader"
  } else {
    role = "member"
  }
  const brush = false
  const eraser = false
  users.push({ id, username: username.trim(), room: room.trim(), role, brush, eraser })
  return {users}
}

// to remove a user, using their socket.io id
const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id
  })
  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

// to get a user, using their socket.io id
const getUser = (id) => {
  return users.find((user) => user.id === id)
}

// to get users in a certain room
const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room.trim())
} 

module.exports = {
  newUser,
  removeUser,
  getUser,
  getRoomUsers,
} 