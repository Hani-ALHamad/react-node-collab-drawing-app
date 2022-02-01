import React, { useContext, useEffect, useState } from 'react';
import Chat from './chat';
import { AppContext } from "./context";
import { FaPaintBrush, FaEraser } from 'react-icons/fa'


const Tools = () => {
  const { role } = useContext(AppContext)

  return (
    <div className='tools_main'>
      <div className='users_title'>Tools</div>
      <div className='users_underline' />
      <div className='tools_tools'>
        <button className='tools_button_icon'><FaPaintBrush /></button>
        <div className='tools_color'>
          Brush/Eraser
          <div className='tools_row'>
            <input className='tools_width_input_range' type="range" min="0" max="100" />
            <div className='tools_width_input_number'>100px</div>
          </div>
          <input className='tools_color_input' type="color" />
        </div>
        <button className='tools_button_icon'><FaEraser /></button>
        {role === "leader" ? 
          <button className='tools_button'>Clear All</button>
        :
          <button className='tools_button'>Clear All</button>
        }
        <div className='tools_color'>
          Background color
          <input className='tools_color_input'  type="color" />
        </div>
      </div>
    </div>
  )
}

export default Tools