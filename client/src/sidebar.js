import React from 'react';
import Chat from './chat';
import Tools from './tools';
import Users from './users';

const Sidebar = () => {
  
  return (
    <div className='sidebar_main'>
      <div className='sidebar_title'>
        Collaborative Drawing App
      </div>
      <Users />
      <Tools />
      <Chat />
    </div>
  )
}

export default Sidebar