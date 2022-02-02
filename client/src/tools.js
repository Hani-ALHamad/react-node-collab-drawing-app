import React, { useContext, useEffect, useState } from 'react';
import Chat from './chat';
import { AppContext } from "./context";
import { FaPaintBrush, FaEraser } from 'react-icons/fa'


const Tools = () => {
  const { 
    role, 
    brushMode,
    changeBrushMode, 
    brushWidth, 
    changeBrushWidth,
    brushColor,
    changeBrushColor,
    bgColor,
    changeBgColor,
    handleClearCanvas
  } = useContext(AppContext)

  return (
    <div className='tools_main'>
      <div className='users_title'>Tools</div>
      <div className='users_underline' />
      <div className='tools_tools'>
        <button className={brushMode === "brush" ? 'tools_button_icon white_bg' : 'tools_button_icon'} onClick={e => changeBrushMode("brush")}><FaPaintBrush /></button>
        <div className='tools_color'>
          Brush/Eraser
          <div className='tools_row'>
            <input className='tools_width_input_range' value={brushWidth} onChange={e => changeBrushWidth(e.target.value)} type="range" min="1" max="100" />
            <div className='tools_width_input_number'>{brushWidth}px</div>
          </div>
          <input className='tools_color_input_1' value={brushColor} onChange={e => changeBrushColor(e.target.value)} type="color" />
        </div>
        <button className={brushMode === "eraser" ? 'tools_button_icon white_bg' : 'tools_button_icon'} onClick={e => changeBrushMode("eraser")}><FaEraser /></button>
        {role === "leader" ? 
          <button className='tools_button' onClick={handleClearCanvas}>Clear All</button>
        :
          <button className='tools_button'>Clear All</button>
        }
        <div className='tools_color'>
          Background color
          <input className='tools_color_input_2' value={bgColor} onChange={e => changeBgColor(e.target.value)} type="color" />
        </div>
      </div>
    </div>
  )
}

export default Tools