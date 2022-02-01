import React, { useContext, useEffect, useState } from 'react';
import Chat from './chat';
import { AppContext } from "./context";
import { FaCrown, FaEraser, FaPaintBrush } from 'react-icons/fa'
import { ImExit } from 'react-icons/im'
import { IoPersonCircle } from 'react-icons/io5'

const Users = () => {
  const {
    usersList,
    role,
    socket,
    room,
    brush,
    eraser,
    handleBrushChange,
    handleEraserChange,
    handleLeave,
    handleKick,
    handlePromoting
  } = useContext(AppContext)

    if (usersList.length === 0) {
      return <></>
    }

    if (role === "leader") {
      return (
        <div className='users_main'>
          <div className='users_title'>{room}</div>
          <div className='users_underline' />
          <div className='users_user'>
            <div className='users_button_icon'><ImExit /></div>
            <div className='users_checkbox_container_icon'>
              <FaPaintBrush />
              <FaEraser />
            </div>
            <div className='users_name_icon'><IoPersonCircle /></div>
          </div>
          {usersList.map((user) => (
            <div className='users_user'>
              {user.id === socket.id ?
                <>
                  <button className='users_button' onClick={e => handleLeave(user)}>Leave</button>
                  <div className='users_checkbox_container'>
                    <input type="checkbox" className='users_checkbox' onChange={e => handleBrushChange(user)} checked={user.brush}/>
                    <input type="checkbox" className='users_checkbox' onChange={e => handleEraserChange(user)} checked={user.eraser}/>
                  </div>
                  <div className='users_name info_gold'>(You) <FaCrown /> {user.username}</div>
                </>
                :
                <>
                  <button className='users_button' onClick={e => handleKick(user)}>Kick</button>
                  <div className='users_checkbox_container'>
                    <input type="checkbox" className='users_checkbox' onChange={e => handleBrushChange(user)} checked={user.brush}/>
                    <input type="checkbox" className='users_checkbox' onChange={e => handleEraserChange(user)} checked={user.eraser}/>
                  </div>
                  <div className='users_name' onClick={e => handlePromoting(user)}>{user.username}</div>
                </>
              }
            </div>
          ))}
        </div>
      )
    } else {
      return (
        <div className='users_main'>
          <div className='users_title'>{room}</div>
          <div className='users_underline' />
          <div className='users_user'>
            <div className='users_button_icon'><ImExit /></div>
            <div className='users_checkbox_container_icon'>
              <FaPaintBrush />
              <FaEraser />
            </div>
            <div className='users_name_icon'><IoPersonCircle /></div>
          </div>
          {usersList.map((user) => (
            <div className='users_user'>
              {user.id === socket.id ?
                <>
                  <button className='users_button' onClick={e => handleLeave(user)}>Leave</button>
                  <div className='users_checkbox_container'>
                    <input type="checkbox" className='users_checkbox' checked={user.brush}/>
                    <input type="checkbox" className='users_checkbox' checked={user.eraser}/>
                  </div>
                  <div className='users_name info' >(You) {user.username}</div>
                </>
                :
                <>
                  <button className='users_button' style={{ visibility: "hidden"}}>Kick</button>
                  <div className='users_checkbox_container'>
                    <input type="checkbox" className='users_checkbox' checked={user.brush}/>
                    <input type="checkbox" className='users_checkbox' checked={user.eraser}/>
                  </div>
                  {user.role === "leader" ?
                    <div className='users_name info_gold' ><FaCrown /> {user.username}</div>
                  :
                    <div className='users_name'>{user.username}</div>
                  }
                </>
              }
            </div>
          ))}
        </div>
      )
    }
}

export default Users