import React, { useContext, useEffect } from 'react';
import { AppContext } from "./context";
import {format} from 'timeago.js'
import ChatInput from './chatInput';

const Chat = () => {
  const {
    socket,
    changeSocket,
    socketMessages,
    changeSocketMessages,
    sendMessage,
    messageInput, 
    changeMessageInput,
    scrollDown
  } = useContext(AppContext)


  
  
  useEffect(() => {
      const interval = setInterval(() => {
        socketMessages.forEach((item) => {
          item.formattedTime = format(item.time)
        })
        const temp = [...socketMessages]
        changeSocketMessages(temp)
      }, 60000)
      return () => clearInterval(interval)
  }, [changeSocketMessages, socketMessages])

  return (
    <div className='chat_main'>
      <div onClick={scrollDown} id='chat_scroll' className='chat_scroll_hidden'>
        Click to scroll down to new messages
      </div>
      <div className='users_title'>Chat</div>
      <div className='users_underline' />
      <div className='chat_messages_box'>
        {socketMessages.map((item) => (
          <>
            <div className='chat_name_time'>
              <div className='chat_name'>{item.sender}</div>
              <div className='chat_time'>{item.formattedTime}</div>
            </div>
            <div className='chat_message'>{item.message}</div>
          </>
        ))}
      </div>
      <ChatInput />
    </div>
  )
}

export default Chat