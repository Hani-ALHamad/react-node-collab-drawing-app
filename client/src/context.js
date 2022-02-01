import React, {useState, useEffect, createContext, useCallback} from 'react'
import io from 'socket.io-client'
import { format } from 'timeago.js'

export const AppContext = createContext()

const Context = ({children}) => {
  const [joined, changeJoined] = useState(false)
  const [loading, changeLoading] = useState(false)
  const [username, changeUsername] = useState("")
  const [room, changeRoom] = useState("")
  const [socket, changeSocket] = useState(null)
  const [usersList, changeUsersList] = useState([])
  const [role, changeRole] = useState("member")
  const [leader, changeLeader] = useState("")
  const [brush, changeBrush] = useState(false)
  const [eraser, changeEraser] = useState(false)
  const [socketMessages, changeSocketMessages] = useState([])
  const [messageInput, changeMessageInput] = useState("")
  const [ctx, changeCtx] = useState(null)
  const [canvas, changeCanvas] = useState(null)
  const [info, changeInfo] = useState(false)
  useEffect(() => {
    const newSocket = io("/")
    changeSocket(newSocket)
  }, [changeSocket])

  const sendMessage = (e) => {
    e.preventDefault()
    if(messageInput.trim() !== ""){
      changeMessageInput("")
      socket.emit("sendMessage", {username ,messageInput, room})
        // const element = document.getElementsByClassName('chat_messages_box')[0]        
        // console.log(element.clientHeight + element.scrollTop, element.scrollHeight)
        // if (element.clientHeight + element.scrollTop - element.scrollHeight > - 20){
        //   var scrollOrNot = true
        // } else {
        //   scrollOrNot = false
        //   document.getElementById("chat_scroll").classList.remove("chat_scroll_hidden")
        // }
        // console.log(document.getElementsByClassName('chat_messages_box')[0].clientHeight)
        // console.log(document.getElementsByClassName('chat_messages_box')[0].scrollHeight)
        // console.log(document.getElementsByClassName('chat_messages_box')[0].scrollY)
        // console.log(document.getElementsByClassName('chat_messages_box')[0].scrollTop)
        // console.log(document.getElementsByClassName('chat_messages_box')[0].clientTop)


        // const time = new Date().getTime()
        // changeSocketMessages(socketMessages.concat({ sender: username, message: messageInput , time: time, formattedTime: format(time)}))
        // document.getElementById("chat_input").focus()
        // if(scrollOrNot){
        //   element.scrollTo({
        //     top: element.scrollHeight,
        //     behavior: "smooth"
        //   })
        // } else {
        //   console.log("new unread messages")
        // }
        // console.log("sent")
      
    }
  }


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

  const scrollDown = () => {
    const element = document.getElementsByClassName('chat_messages_box')[0]
    element.scrollTo({
      top: element.scrollHeight,
      behavior: "smooth"
    })
  }

  useEffect(() => {
    if(joined){
      const checkSize = () => {
        document.querySelector(':root').style.setProperty("--screen-width-scale", `${window.innerWidth}`)
        document.querySelector(':root').style.setProperty("--screen-width", `${window.innerWidth}px`)
        document.querySelector(':root').style.setProperty("--screen-height", `${window.innerHeight}px`)
        console.log(window.innerWidth, window.innerHeight)
        console.log("s")
      }
      window.addEventListener("resize", checkSize)
      checkSize()
    }
  },[joined])

  const handleSubmit = (e) => {
    e.preventDefault()
    if(username.trim() !== "" && room.trim() !== ""){
      document.getElementsByTagName("input")[0].disabled = true
      document.getElementsByTagName("input")[1].disabled = true
      changeLoading(true)
      socket.emit("tryToJoin", {username, room}, (error) => {
        if(error) {
          document.getElementsByTagName("input")[0].disabled = false
          document.getElementsByTagName("input")[1].disabled = false
          console.log(error)
          changeLoading(false)
        } else {
          changeJoined(true)
          changeSocketMessages([])
        }
      })
    }
  }

  const getUsersData = useCallback(() => {
    console.log("getUsersData")
    if (joined && socket) {
      socket.emit("getUsersData", room, (users) => {
        changeUsersList(users)
        console.log(usersList, users)
        if (usersList.length === 0 && users.length === 1){
          changeRole("leader")
          changeLeader(users[0].username)
        }
        // console.log("users", users)
        // console.log(usersList)
        // const exists = users.find((element) => {
        //   return socket.id === element.id
        // })
        // if (exists) {
        //   changeBrush(exists.brush)
        //   changeEraser(exists.eraser)
        //   changeRole(exists.role)
        //   console.log(users, usersList)
        //   const roomLeader = users.find((user) => {
        //     return user.role === "leader"
        //   })
        //   changeLeader(roomLeader.username)
        // } else {
        //   changeJoined(false)
        //   changeLoading(false)
        // }
      })
    }
  },[joined, room, socket, usersList])

  useEffect(() => {
      const interval = setInterval(() => {
        getUsersData()
        }, 20000)
      getUsersData()
      return () => clearInterval(interval)
  },[socket, joined, room, role])

  useEffect(() => {
    
    const message = (m) => {
      console.log(m)
    }

    const sendMessageToRoom = (data) => {
      console.log(data)
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
      } else {
        console.log("new unread messages")
      }
    }

    if(socket){
      socket.once("sendMessageToRoom", sendMessageToRoom)
      socket.once("systemMessage", message)
    }
  },[socket, socketMessages])

  useEffect(() => {
    if(socket){
      socket.once("sendUsersData", (users) => {
        changeUsersList(users)
        console.log(users, usersList)
        const exists = users.find((element) => {
          return socket.id === element.id
        })
        if (exists) {
          changeBrush(exists.brush)
          changeEraser(exists.eraser)
          changeRole(exists.role)
          console.log(users, usersList)
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
          // location.reload()
          window.location.reload()
        }
        console.log("second one")
      })
    }
  },[socket, getUsersData, usersList, role, leader])

  const handleBrushChange = (e) => {
    console.log(e)
    if(role === "leader"){
      socket.emit("handleBrushChange", e)
      getUsersData()
    }
  }

  const handleEraserChange = (e) => {
    console.log(e)
    if (role === "leader") {
      socket.emit("handleEraserChange", e)
      getUsersData()
    }
  }

  const handleLeave = (e) => {
    console.log(e)
      socket.emit("handleLeave", e)
      getUsersData()
      window.location.reload()
  }

  const handleKick = (e) => {
    if (role === "leader") {
      console.log(e)
      socket.emit("handleKick", e)
      getUsersData()
    }
  }

  const handlePromoting = (e) => {
    if (role === "leader") {
      console.log(e)
      socket.emit("handlePromoting", e)
    }
  }



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
      handlePromoting
    }}>
      {children}
    </AppContext.Provider>
  )
}

export default Context