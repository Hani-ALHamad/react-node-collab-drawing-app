import React, {useContext} from 'react';
import './index.css';
import { AppContext } from "./context";
import Canvas from './canvas';
import Welcome from './welcome';
import Sidebar from './sidebar';
import Info from './info';
import { FaQuestionCircle } from 'react-icons/fa'

const App = () => {
  const {
    info, 
    changeInfo,
    joined,
  } = useContext(AppContext)

  // if user is not in a room the welcome page will show
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
      </div>
  )
}

export default App;