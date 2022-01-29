import React, {useState, useEffect, createContext} from 'react'
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
      socket.emit("sendMessage", messageInput, () => {
        const element = document.getElementsByClassName('chat_messages_box')[0]        
        console.log(element.clientHeight + element.scrollTop, element.scrollHeight)
        if (element.clientHeight + element.scrollTop - element.scrollHeight > - 20){
          var scrollOrNot = true
        } else {
          scrollOrNot = false
          document.getElementById("chat_scroll").classList.remove("chat_scroll_hidden")
        }
        console.log(document.getElementsByClassName('chat_messages_box')[0].clientHeight)
        console.log(document.getElementsByClassName('chat_messages_box')[0].scrollHeight)
        console.log(document.getElementsByClassName('chat_messages_box')[0].scrollY)
        console.log(document.getElementsByClassName('chat_messages_box')[0].scrollTop)
        console.log(document.getElementsByClassName('chat_messages_box')[0].clientTop)


        const time = new Date().getTime()
        changeSocketMessages(socketMessages.concat({ sender: "Hani", message: messageInput , time: time, formattedTime: format(time)}))
        changeMessageInput("")
        document.getElementById("chat_input").focus()
        if(scrollOrNot){
          element.scrollTo({
            top: element.scrollHeight,
            behavior: "smooth"
          })
        } else {
          console.log("new unread messages")
        }
        console.log("sent")
      })
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
        }
      })
    }
  }

  useEffect(() => {
    const getUsersData = () => {
      if (joined && socket) {
        socket.emit("getUsersData", room, (users) => {
          changeUsersList(users)
          const exists = users.find((element) => {
            return socket.id === element.id
          })
          if(exists){
            changeRole(exists.role)
          }
        })
      }
    }
      const interval = setInterval(() => {
        getUsersData()
        }, 1000)
      getUsersData()
      return () => clearInterval(interval)
  },[socket, joined, room, role])

  useEffect(() => {
    const message = (m) => {
      console.log(m)
    }
    if(socket){
      socket.on("systemMessage", message)
    }
  },[socket])


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
      loading
    }}>
      {children}
    </AppContext.Provider>
  )
}

export default Context