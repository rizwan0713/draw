"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef } from "react"

export default function   Canvas(){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        if(canvasRef.current){
            
            initDraw(canvasRef.current)

        }

    },[canvasRef])
    return <div>
        <h1>this is canvas</h1>
  <canvas ref={canvasRef}  width={2000} height={1000}></canvas>
    </div>
}



