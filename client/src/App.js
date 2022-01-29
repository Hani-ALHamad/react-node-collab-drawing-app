import React, {useContext, useEffect} from 'react';
import './index.css';
import { AppContext } from "./context";
import Chat from './chat';
import Canvas from './canvas';
import Welcome from './welcome';
import LoadingPage from './loadingPage'
import Sidebar from './sidebar';
import Info from './info';
import { FaQuestionCircle } from 'react-icons/fa'

const App = () => {
  const {
    socket,
    changeSocket,
    socketMessage,
    changeSocketMessage,
    info, 
    changeInfo,
    joined,
    username,
    changeUsername,
    room,
    changeRoom
  } = useContext(AppContext)


  console.log(window.innerHeight)

  



  if(!joined){
    return (
      <div className='main'>
        <Welcome />
      </div>
    )
  }

  return(
      <div className='main'>
      <div className='question' onClick={e => changeInfo(true)}><FaQuestionCircle /></div>
        {info ? <Info /> : <></>}
        <Canvas />
        <Sidebar />
        {/* <LoadingPage /> */}
        {/* <Welcome /> */}
          
      </div>

  )
}

export default App;
