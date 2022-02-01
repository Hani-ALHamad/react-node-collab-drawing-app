const users = []

const newUser = ({id, username, room}) => {

  const existingUser = users.find((user) => {
    return user.username.toLowerCase() === username.toLowerCase().trim() && user.room === room.trim()
  })


  if(existingUser){
    return {error: `${username} name is already used by someone else in ${room} room, if you're sure that ${username} name is not taken in that room please wait for 1 miunte until the room refreshes.`}
  }
  
  // if(!getUser()){}
  const usersInRoom = getRoomUsers(room)

  if(usersInRoom.length > 4){
    return { error: `${room} room is full, if you're sure that ${room} is not full please wait for 1 miunte until the room refreshes.` }
  }

  if(usersInRoom.length === 0){
    var role = "leader"
    var brush = true
    var eraser = true
  } else {
    role = "member"
    brush = false
    eraser = false
  }
  console.log(usersInRoom)
  users.push({ id, username: username.trim(), room: room.trim(), role, brush, eraser })
  return {users}
}

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id
  })
  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = (id) => {
  return users.find((user) => user.id === id)
}

const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room.trim())
} 

module.exports = {
  newUser,
  removeUser,
  getUser,
  getRoomUsers,
} 