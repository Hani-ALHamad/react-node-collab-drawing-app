import React, { useContext, useEffect } from 'react';
import Chat from './chat';
import { AppContext } from "./context";
import { FaCrown, FaEraser, FaPaintBrush } from 'react-icons/fa'
import { ImExit } from 'react-icons/im'
import { IoPersonCircle } from 'react-icons/io5'

const Users = () => {


  return (
    <div className='users_main'>
      <div className='users_title'>*room name*</div>
      <div className='users_underline'/>
      <div className='users_user'>
        <div className='users_button_icon'><ImExit /></div>
        <div className='users_checkbox_container_icon'>
          <FaPaintBrush />
          <FaEraser />
        </div>
        <div className='users_name_icon'><IoPersonCircle /></div>
      </div>
      <div className='users_user'>
        <button className='users_button'>Leave</button>
        <div className='users_checkbox_container'>
          <input type="checkbox" className='users_checkbox' />
          <input type="checkbox" className='users_checkbox' />
        </div>
        <div className='users_name'><FaCrown /> Hani</div>
      </div>
      <div className='users_user'>
        <button className='users_button'>Leave</button>
        <div className='users_checkbox_container'>
          <input type="checkbox" className='users_checkbox' />
          <input type="checkbox" className='users_checkbox' />
        </div>
        <div className='users_name'>Hani</div>
      </div>
      <div className='users_user'>
        <button className='users_button'>Leave</button>
        <div className='users_checkbox_container'>
          <input type="checkbox" className='users_checkbox' />
          <input type="checkbox" className='users_checkbox' />
        </div>
        <div className='users_name'>Hani</div>
      </div>
      <div className='users_user'>
        <button className='users_button'>Leave</button>
        <div className='users_checkbox_container'>
          <input type="checkbox" className='users_checkbox' />
          <input type="checkbox" className='users_checkbox' />
        </div>
        <div className='users_name'>Hani</div>
      </div>
      <div className='users_user'>
        <button className='users_button'>Leave</button>
        <div className='users_checkbox_container'>
          <input type="checkbox" className='users_checkbox' />
          <input type="checkbox" className='users_checkbox' />
        </div>
        <div className='users_name'>Hani</div>
      </div>
    </div>
  )
}

export default Users