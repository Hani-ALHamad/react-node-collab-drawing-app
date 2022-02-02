import React, { useContext } from 'react';
import { AppContext } from "./context";
import { FaCrown, FaEraser, FaPaintBrush } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'

const Info = () => {
  const { changeInfo } = useContext(AppContext)

  return (
    <div className='info_main'>
      <div className='info_x' onClick={e => changeInfo(false)}><AiOutlineClose /></div>
      <div className='info_title'>Useful info</div>
      <div className='info_small_title'>Permissions:</div>
      <div className='info_text'>- The participant with a <span className='info_gold'><FaCrown /></span> symbol beside their name is the leader.</div>
      <div className='info_text'>- Leader can allow or prevent other participants from using <FaPaintBrush /> or <FaEraser /> tools.
      </div>
      <div className='info_text'>- Only leader can use the "Clear All" button.</div>
      <div className='info_text'>- Leader does have the ability to kick other participants.</div>
      <div className='info_text'>- Leader can transfer leadership to another participant (by clicking on their name).</div>
      <div className='info_small_title'>Resizing the side panel:</div>
      <div className='info_text'>- You can resize it by zooming in or zooming out the page (example: press (CTRL and -)) on keyboard to zoom out</div>
      <div className='info_text'>and that will not affect the size of the drawing board.</div>
    </div>
  )
}

export default Info