import React, { useContext, useEffect } from 'react';
import { AppContext } from "./context";

const ChatInput = () => {
  const {
    sendMessage,
    messageInput,
    changeMessageInput
  } = useContext(AppContext)

  return (
    <form id="chat_form" onSubmit={sendMessage}>
      <input
        type="text"
        id="chat_input"
        placeholder="Your message"
        value={messageInput}
        onChange={e => changeMessageInput(e.target.value)}
        autoComplete='off'
      />
      <input id="chat_submit" type="submit" value="Send" />
    </form>
  )
}

export default ChatInput