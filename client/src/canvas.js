import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { AppContext } from "./context";

const Canvas = () => {
  const canv = document.getElementsByTagName("canvas")[0]
  var old

  const {
    ctx,
    changeCtx,
    canvas,
    changeCanvas,
    socket,
    room,
    brushMode,
    brush,
    eraser,
    brushColor,
    brushWidth,
    role,
    username
  } = useContext(AppContext)

  var x = 0
  var y = 0
  var brushModeVAR = useRef(brushMode)
  var brushVAR = useRef(brush)
  var roleVAR = useRef(role)

  // useEffect(() => {
  //   brushModeVAR = brushMode
  //   brushVAR = brush
  //   roleVAR = role
  // }, [brushMode, brush, role])

  useEffect(() => {
    const canv= document.createElement('canvas')
    
    changeCanvas(canv)
    // document.body.appendChild(canv)
    document.getElementsByClassName("canvas_main")[0].appendChild(canv)
    const ctxTemp = canv.getContext("2d")
    ctxTemp.canvas.width = 1460
    ctxTemp.canvas.height = 920
    ctxTemp.lineWidth = 5
    ctxTemp.lineCap = 'round';
    ctxTemp.strokeStyle = '#c0392b';
    changeCtx(ctxTemp)
    
    // ctxTemp.fillStyle = "#FF0000";
    // ctxTemp.fillRect(0, 0, 150, 75);
    // var imgData = ctxTemp.getImageData(10, 10, 1000, 1000)
    // ctxTemp.putImageData(imgData, 10, 70); // not to use
    // console.log(canv.toDataURL()) // to use
  },[])

  const setPosition = useCallback((e) => {
    if(brushMode === "brush" && (brush || role === "leader")){
      console.log("mouse down")
      console.log(ctx)
      // ctx.globalCompositeOperation = "destination-out" // للحذف
      // ctx.globalCompositeOperation = "source-over"; // للكتابة
      x = e.offsetX
      y = e.offsetY
      console.log(x, y)
      ctx.globalCompositeOperation = "source-over"
      ctx.lineWidth = brushWidth
      ctx.strokeStyle = brushColor
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y)
      ctx.stroke()
      socket.emit("sendCanvas", [room, x, y, brushWidth, brushColor], () => {
        console.log("sent")
      })
    } else if (brushMode === "eraser" && (eraser || role === "leader")) {
      console.log("mouse down")
      console.log(ctx)
      // ctx.globalCompositeOperation = "destination-out" // للحذف
      // ctx.globalCompositeOperation = "source-over"; // للكتابة
      x = e.offsetX
      y = e.offsetY
      console.log(x, y)
      ctx.globalCompositeOperation = "destination-out"
      ctx.lineWidth = brushWidth
      ctx.strokeStyle = brushColor
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y)
      ctx.stroke()
      socket.emit("sendCanvas", [room, x, y, brushWidth], () => {
        console.log("sent")
    })
    }
    
  }, [brushMode, brush, role, eraser, brushColor, brushWidth])

  const draw = useCallback((e) => {
    if(e.buttons === 1){
      // console.log(brushModeVAR, brushVAR, roleVAR)
      if (brushMode === "brush" && (brush || role === "leader")) {
        console.log("a")
        ctx.globalCompositeOperation = "source-over"
        ctx.lineWidth = brushWidth
        ctx.strokeStyle = brushColor
        ctx.beginPath()
        ctx.moveTo(x, y)
        x = e.offsetX
        y = e.offsetY
        ctx.lineTo(x, y)
        ctx.stroke()
        // socket.emit("sendMessage", { x: x, y: y }, () => {
        //   console.log("sent")
        // })
        
        socket.emit("sendCanvas", [room, x, y, brushWidth, brushColor], () => {
          console.log("sent")
        })
      } else if (brushMode === "eraser" && (eraser || role === "leader")){
        console.log("a")
        ctx.globalCompositeOperation = "destination-out"
        ctx.lineWidth = brushWidth
        ctx.strokeStyle = brushColor
        ctx.beginPath()
        ctx.moveTo(x, y)
        x = e.offsetX
        y = e.offsetY
        ctx.lineTo(x, y)
        ctx.stroke()
        // socket.emit("sendMessage", { x: x, y: y }, () => {
        //   console.log("sent")
        // })

        socket.emit("sendCanvas", [room, x, y, brushWidth], () => {
          console.log("sent")
        })
      }
    }
  }, [brushMode, brush, role, eraser, brushColor, brushWidth])

  const mouseUp = useCallback(() => {
    console.log("m up")
    old = null
    socket.emit("clearOld", room)
    // console.log(canvas.toDataURL())
  }, [brushMode, brush, role, eraser, brushColor, brushWidth])

  useEffect(() => {
    
  },[brushMode, brush, role])

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

  useEffect(() => {


    socket.on("sendCanvasToUsers", (data) => {
      if (ctx) {
        if (!old) {
          console.log("sssssssssssssssssssssssssssssss")
          old = [data[1], data[2]]
        }
        if(data.length === 5){
          console.log(data.length)
          // console.log(ctx)
          console.log(data)
          ctx.globalCompositeOperation = "source-over"
          // ctx.lineCap = 'square';
          ctx.lineWidth = data[3]
          ctx.strokeStyle = data[4]
          ctx.beginPath()
          ctx.moveTo(old[0], old[1])
          ctx.lineTo(data[1], data[2])
          // ctx.closePath()
          ctx.stroke()
          old = [data[1], data[2]]
        } 
        else {
          if (!old) {
            console.log("sssssssssssssssssssssssssssssss")
            old = [data[1], data[2]]
          }
          // console.log(ctx)
          console.log(data)
          ctx.globalCompositeOperation = "destination-out"
          ctx.lineWidth = data[3]
          ctx.beginPath()
          ctx.moveTo(old[0], old[1])
          ctx.lineTo(data[1], data[2])
          // ctx.closePath()
          ctx.stroke()
          old = [data[1], data[2]]
        }
      }
    })

    socket.on("clearOldForUsers", () => {
      old = undefined
    })
  }, [socket, ctx])

  useEffect(() => {

  },[])
  
  return (
    <div className='canvas_main'>

    </div>
  )
}

export default Canvas