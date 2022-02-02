import React, {useState, useEffect, createContext, useCallback} from 'react'
import io from 'socket.io-client'
import { format } from 'timeago.js'

export const AppContext = createContext()

const Context = ({children}) => {
  const [joined, changeJoined] = useState(false)
  const [loading, changeLoading] = useState(false)
  const [loginError, changeLoginError] = useState("")
  const [username, changeUsername] = useState("")
  const [room, changeRoom] = useState("")
  const [socket, changeSocket] = useState(null)
  const [usersList, changeUsersList] = useState([])
  const [role, changeRole] = useState("member")
  const [leader, changeLeader] = useState("")
  const [brush, changeBrush] = useState(false)
  const [eraser, changeEraser] = useState(false)
  const [brushMode, changeBrushMode] = useState("brush")
  const [brushWidth, changeBrushWidth] = useState(5)
  const [brushColor, changeBrushColor] = useState("black")
  const [bgColor, changeBgColor] = useState("#F4F4F9")
  const [socketMessages, changeSocketMessages] = useState([])
  const [messageInput, changeMessageInput] = useState("")
  const [ctx, changeCtx] = useState(null)
  const [canvas, changeCanvas] = useState(null)
  const [info, changeInfo] = useState(false)

  // this will initiate a new socket.io connection
  useEffect(() => {
    const newSocket = io("/")
    changeSocket(newSocket)
  }, [changeSocket])

  // this will emit messages to the backend
  const sendMessage = (e) => {
    e.preventDefault()
    if(messageInput.trim() !== ""){
      changeMessageInput("")
      socket.emit("sendMessage", {username ,messageInput, room})
    }
  }


  // handle scrolling button
  useEffect(() => {
    if(joined){
      const element = document.getElementsByClassName('chat_messages_box')[0]
      document.getElementsByClassName("chat_messages_box")[0].addEventListener("scroll", () => {
        if (element.clientHeight + element.scrollTop === element.scrollHeight) {
          document.getElementById("chat_scroll").classList.add("chat_scroll_hidden")
        }
      })
    }
  },[joined])

  // scrolling button
  const scrollDown = () => {
    const element = document.getElementsByClassName('chat_messages_box')[0]
    element.scrollTo({
      top: element.scrollHeight,
      behavior: "smooth"
    })
  }

  // to check screen width and heigh, and change their :root variables in css
  useEffect(() => {
    if(joined){
      const checkSize = () => {
        document.querySelector(':root').style.setProperty("--screen-width-scale", `${window.innerWidth}`)
        document.querySelector(':root').style.setProperty("--screen-width", `${window.innerWidth}px`)
        document.querySelector(':root').style.setProperty("--screen-height", `${window.innerHeight}px`)
      }
      window.addEventListener("resize", checkSize)
      checkSize()
    }
  },[joined])

  // to submit your data when you try to login, will emit them to the backend for sure
  const handleSubmit = (e) => {
    e.preventDefault()
    if(username.trim() !== "" && room.trim() !== ""){
      changeLoginError("")
      document.getElementsByTagName("input")[0].disabled = true
      document.getElementsByTagName("input")[1].disabled = true
      changeLoading(true)
      socket.emit("tryToJoin", {username, room}, (error) => {
        if(error) {
          document.getElementsByTagName("input")[0].disabled = false
          document.getElementsByTagName("input")[1].disabled = false
          changeLoginError(error)
          changeLoading(false)
        } else {
          changeJoined(true)
          changeSocketMessages([])
        }
      })
    }
  }

  // to get users data from the backend, will trigger another emit function there to make sure all users will be updated with the new data
  const getUsersData = useCallback(() => {
    if (joined && socket) {
      socket.emit("getUsersData", room, (users) => {
        changeUsersList(users)
        if (usersList.length === 0 && users.length === 1){
          changeRole("leader")
          changeLeader(users[0].username)
        }
      })
    }
  },[joined, room, socket, usersList])


  // auto updating for data (getUsersData) function
  useEffect(() => {
      const interval = setInterval(() => {
        getUsersData()
        }, 20000)
      getUsersData()
      return () => clearInterval(interval)
  },[socket, joined, room, role])


  // auto scrolling + adding time to messages and adding them to the state + emitting messages to the backend
  useEffect(() => {
    const sendMessageToRoom = (data) => {
      const element = document.getElementsByClassName('chat_messages_box')[0]
      if (element.clientHeight + element.scrollTop - element.scrollHeight > - 20) {
        var scrollOrNot = true
      } else {
        scrollOrNot = false
      }
      const time = new Date().getTime()
      changeSocketMessages(socketMessages.concat({ sender: data.user, message: data.message, time: time, formattedTime: format(time) }))

      setTimeout(() => {
        if (element.clientHeight + element.scrollTop - element.scrollHeight <= - 20){
          document.getElementById("chat_scroll").classList.remove("chat_scroll_hidden")
        }
      }, 300)

      if (scrollOrNot) {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: "smooth"
        })
      }
    }

    if(socket){
      socket.once("sendMessageToRoom", sendMessageToRoom)
    }
  },[socket, socketMessages])


  // this will recieve the data from the backend whenever they were updated or requested
  useEffect(() => {
    if(socket){
      socket.once("sendUsersData", (users) => {
        changeUsersList(users)
        const exists = users.find((element) => {
          return socket.id === element.id
        })
        if (exists) {
          changeBrush(exists.brush)
          changeEraser(exists.eraser)
          changeRole(exists.role)
          const roomLeader = users.find((user) => {
            return user.role === "leader"
          })
          if(roomLeader){
            changeLeader(roomLeader.username)
          }
        } else {
          changeJoined(false)
          changeLoading(false)
          changeUsersList([])
          changeSocketMessages([])
          window.location.reload()
        }
      })
    }
  },[socket, getUsersData, usersList, role, leader])

  // to change brush permissions
  const handleBrushChange = (e) => {
    if(role === "leader"){
      socket.emit("handleBrushChange", e)
      getUsersData()
    }
  }
  // to change eraser permissions
  const handleEraserChange = (e) => {
    if (role === "leader") {
      socket.emit("handleEraserChange", e)
      getUsersData()
    }
  }

  // to handle leaving
  const handleLeave = (e) => {
      socket.emit("handleLeave", e)
      getUsersData()
      window.location.reload()
  }

  // to kick another user
  const handleKick = (e) => {
    if (role === "leader") {
      socket.emit("handleKick", e)
      getUsersData()
    }
  }

  // to promote another user
  const handlePromoting = (e) => {
    if (role === "leader") {
      socket.emit("handlePromoting", e)
    }
  }

  // to clear the board for everyone
  const handleClearCanvas = () => {
    if (role === "leader"){
      socket.emit("clearCanvas", room)
    }
  }

  // this will trigger when the leader request board clearing
  useEffect(() => {
    if(socket && ctx){
      socket.on("clearCanvasToUsers", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      })
    }
  }, [socket, ctx, canvas, role])

  
  useEffect(() => {
    if(joined){
      document.documentElement.style.setProperty("--brush-clr", brushColor)
    }
  },[brushColor, joined])

  useEffect(() => {
    if (joined) {
      document.documentElement.style.setProperty("--bg-clr", bgColor)
      document.getElementsByClassName("canvas_main")[0].style.setProperty("background", bgColor)
    }
  }, [bgColor, joined])



  return(
    <AppContext.Provider value={{
      socket, 
      changeSocket,
      socketMessages, 
      changeSocketMessages,
      sendMessage,
      messageInput, 
      changeMessageInput,
      ctx, 
      changeCtx,
      canvas, 
      changeCanvas,
      scrollDown,
      info, 
      changeInfo,
      joined,
      username,
      changeUsername,
      room,
      changeRoom,
      handleSubmit,
      loading,
      usersList,
      role,
      leader,
      brush,
      eraser,
      handleBrushChange,
      handleEraserChange,
      handleLeave,
      handleKick,
      handlePromoting,
      loginError,
      brushMode, 
      changeBrushMode,
      brushWidth, 
      changeBrushWidth,
      brushColor, 
      changeBrushColor,
      bgColor, 
      changeBgColor,
      handleClearCanvas
    }}>
      {children}
    </AppContext.Provider>
  )
}

export default Context