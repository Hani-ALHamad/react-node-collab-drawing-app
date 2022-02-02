import React, { useCallback, useContext, useEffect } from 'react';
import { AppContext } from "./context";

const Canvas = () => {
  // old coordinates for the brush
  var old

  const {
    ctx,
    changeCtx,
    changeCanvas,
    socket,
    room,
    brushMode,
    brush,
    eraser,
    brushColor,
    brushWidth,
    role,
  } = useContext(AppContext)
  
  // used !ctx to prevent them from resetting whenever a permission changes
  if(!ctx){
    var x = 0
    var y = 0
  }

  // this will create a new canvas, and change "ctx" state value to it
  useEffect(() => {
    const canv= document.createElement('canvas')
    changeCanvas(canv)
    document.getElementsByClassName("canvas_main")[0].appendChild(canv)
    const ctxTemp = canv.getContext("2d")
    ctxTemp.canvas.width = 1460
    ctxTemp.canvas.height = 920
    ctxTemp.lineWidth = 5
    ctxTemp.lineCap = 'round';
    ctxTemp.strokeStyle = '#c0392b';
    changeCtx(ctxTemp)
  },[])

  // when mouse down, will draw or erase depends on the state, will emit "sendCanvas" too to send drawing data to the other users
  const setPosition = useCallback((e) => {
    if(brushMode === "brush" && (brush || role === "leader")){
      x = e.offsetX
      y = e.offsetY
      ctx.globalCompositeOperation = "source-over"
      ctx.lineWidth = brushWidth
      ctx.strokeStyle = brushColor
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y)
      ctx.stroke()
      socket.emit("sendCanvas", [room, x, y, brushWidth, brushColor])
    } 
    else if (brushMode === "eraser" && (eraser || role === "leader")) {
      x = e.offsetX
      y = e.offsetY
      ctx.globalCompositeOperation = "destination-out"
      ctx.lineWidth = brushWidth
      ctx.strokeStyle = brushColor
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y)
      ctx.stroke()
      socket.emit("sendCanvas", [room, x, y, brushWidth])
    }
    
  }, [brushMode, brush, role, eraser, brushColor, brushWidth])


  // when mouse moves, will draw or erase depends on the state, will emit "sendCanvas" too to send drawing data to the other users
  const draw = useCallback((e) => {
    if(e.buttons === 1){
      if (brushMode === "brush" && (brush || role === "leader")) {
        ctx.globalCompositeOperation = "source-over"
        ctx.lineWidth = brushWidth
        ctx.strokeStyle = brushColor
        ctx.beginPath()
        ctx.moveTo(x, y)
        x = e.offsetX
        y = e.offsetY
        ctx.lineTo(x, y)
        ctx.stroke()
        
        socket.emit("sendCanvas", [room, x, y, brushWidth, brushColor])
      } 
      else if (brushMode === "eraser" && (eraser || role === "leader")){
        ctx.globalCompositeOperation = "destination-out"
        ctx.lineWidth = brushWidth
        ctx.strokeStyle = brushColor
        ctx.beginPath()
        ctx.moveTo(x, y)
        x = e.offsetX
        y = e.offsetY
        ctx.lineTo(x, y)
        ctx.stroke()

        socket.emit("sendCanvas", [room, x, y, brushWidth])
      }
    }
  }, [brushMode, brush, role, eraser, brushColor, brushWidth])


  // when mouse is up, will change old's value to null as well and tell the other users to do the same
  const mouseUp = useCallback(() => {
    old = null
    socket.emit("clearOld", room)
  }, [brushMode, brush, role, eraser, brushColor, brushWidth])


  // will add and remove event listeners, whenever one of the dependencies below updates
  // used that method and turned the functions above to callback functions (useCallback) to allow them to have updated state data
  useEffect((e) => {
    if(ctx){
      document.getElementsByTagName("canvas")[0].addEventListener("mousedown", setPosition)
      document.getElementsByTagName("canvas")[0].addEventListener("mousemove", draw)
      document.addEventListener("mouseup", mouseUp)

      return () =>{
        document.getElementsByTagName("canvas")[0].removeEventListener("mousedown", setPosition)
        document.getElementsByTagName("canvas")[0].removeEventListener("mousemove", draw)
        document.removeEventListener("mouseup", mouseUp)
      }
    }
  }, [ctx, brushMode, brush, role, eraser, brushColor, brushWidth, setPosition, draw, mouseUp])


  // when the client recieves canvas data from socket io it will draw/erase depends on the length of "data" array
  useEffect(() => {
    socket.on("sendCanvasToUsers", (data) => {
      if (ctx) {
        if (!old) {
          old = [data[1], data[2]]
        }
        if(data.length === 5){
          ctx.globalCompositeOperation = "source-over"
          ctx.lineWidth = data[3]
          ctx.strokeStyle = data[4]
          ctx.beginPath()
          ctx.moveTo(old[0], old[1])
          ctx.lineTo(data[1], data[2])
          ctx.stroke()
          old = [data[1], data[2]]
        } 
        else {
          if (!old) {
            old = [data[1], data[2]]
          }
          ctx.globalCompositeOperation = "destination-out"
          ctx.lineWidth = data[3]
          ctx.beginPath()
          ctx.moveTo(old[0], old[1])
          ctx.lineTo(data[1], data[2])
          ctx.stroke()
          old = [data[1], data[2]]
        }
      }
    })

    // this will clear old variable for other users
    socket.on("clearOldForUsers", () => {
      old = undefined
    })
  }, [socket, ctx])
  
  return (
    <div className='canvas_main'>

    </div>
  )
}

export default Canvas