import { initDraw } from "@/draw";
import { Socket } from "dgram";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./iconsButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";

type Shape = "circle" | "rect" | "pencil";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Shape>("circle");

  useEffect (() => {
     //@ts-ignore 
    window.selectedTool = selectedTool

  },[selectedTool])
   

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket);
    }
  }, [canvasRef]);

  return (
    <div className="h-[100vh] overflow-hidden">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}

function TopBar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Shape;
  setSelectedTool: (tool:Shape) => void;
}) {
  return (
    <div className="fixed top-10 left-10">
      <div className="flex gap-5">

        <IconButton 
         onClick={() => {setSelectedTool("pencil")}}
        
          activated={selectedTool === "pencil"}
          icon={<Pencil />}
        ></IconButton>
        <IconButton
          activated={selectedTool === "circle"}
          icon={<Circle />}
           onClick={() => {setSelectedTool("circle")}}
        ></IconButton>

        <IconButton
          activated={selectedTool === "rect"}
          icon={<RectangleHorizontalIcon />}
     onClick={() => {setSelectedTool("rect")}}

        ></IconButton>
      </div>
    </div>
  );
}
