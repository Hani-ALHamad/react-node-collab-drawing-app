import React, { useContext, useEffect } from 'react';
import { AppContext } from "./context";

const Canvas = () => {
  const {
    ctx,
    changeCtx,
    canvas,
    changeCanvas,
    socket
  } = useContext(AppContext)

  var x = 0
  var y = 0

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

  const setPosition = (e) => {
    console.log("mouse down")
    console.log(ctx)
    // ctx.globalCompositeOperation = "destination-out" // للحذف
    // ctx.globalCompositeOperation = "source-over"; // للكتابة
    x = e.offsetX
    y = e.offsetY
    console.log(x, y)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, y)
    ctx.stroke()
    // socket.emit("sendMessage", {x: x, y: y, w: 5, o: "s"}, () => {
    //   console.log("sent")
    // })
  }

  const draw = (e) => {
    if(e.buttons === 1){
      ctx.beginPath()
      ctx.moveTo(x, y)
      x = e.offsetX
      y = e.offsetY
      ctx.lineTo(x, y)
      ctx.stroke()
      // socket.emit("sendMessage", { x: x, y: y }, () => {
      //   console.log("sent")
      // })
      socket.emit("sendMessage", { x: x, y: y, w: 5, o: "s" }, () => {
        console.log("sent")
      })
    }
  }

  const mouseUp = () => {
    console.log("m up")
    // console.log(canvas.toDataURL())
  }

  useEffect(() => {
    if(ctx){
      document.getElementsByTagName("canvas")[0].addEventListener("mousedown", setPosition)
      document.getElementsByTagName("canvas")[0].addEventListener("mousemove", draw)
      document.addEventListener("mouseup", mouseUp)
    }
  },[ctx])

  
  return (
    <div className='canvas_main'>

    </div>
  )
}

export default Canvas