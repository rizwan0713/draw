import { initDraw } from "@/draw";
import { Socket } from "dgram";
import { useEffect, useRef } from "react";
import { IconButton } from "./iconsButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";

export function Canvas ({roomId,socket} :{
    roomId:string,
    socket:WebSocket
}) {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        
    useEffect(() => {

        if(canvasRef.current){
            
            initDraw(canvasRef.current,roomId,socket)

        }

    },[canvasRef])

    return <div className="h-[100vh] overflow-hidden">
      
  <canvas ref={canvasRef}  width={window.innerWidth} height={window.innerHeight}></canvas>
<TopBar/>
    </div>
    
}

function TopBar (){
    return <div className="fixed top-10 left-10">
         <IconButton icon = {<Pencil/>} onClick={() => {}}></IconButton>
         <IconButton icon = {<Circle/>} onClick={() => {}}></IconButton>
        
         <IconButton icon = {<RectangleHorizontalIcon/>} onClick={() => {}}></IconButton>
    </div>
}