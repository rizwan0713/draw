import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

 export async  function initDraw(canvas: HTMLCanvasElement , roomId:string, socket:WebSocket) {
  const ctx = canvas.getContext("2d");
  let existingShapes: Shape[] = await getExistingShapes(roomId)
  if (!ctx) {
    return;
  }

 socket.onmessage = (event) => {

 
    const message = JSON.parse(event.data)
    if(message.type === "chat"){
        const parshedShape = JSON.parse(message.message)
        existingShapes.push(parshedShape.shape)
        clearCanvas(existingShapes,canvas,ctx)


    }


 }


clearCanvas(existingShapes,canvas,ctx)
  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    console.log("down down dowan");
    startX = e.clientX;
    console.log("startX", startX);
    startY = e.clientY;
    console.log("startY", startY);
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    console.log("up up up");
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    const shape :Shape = {
      //@ts-ignore
      type: window.selectedTool,
      x: startX,
      y: startY,
      width: width,
      height: height,
    }
  existingShapes.push(shape);
  socket.send(JSON.stringify ({
    type:"chat",
    message:JSON.stringify({
        shape
    }),
    roomId
  }))
    // existingShapes.push({
    //   type: "rect",
    //   x: startX,
    //   y: startY,
    //   width: width,
    //   height: height,
    // });
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      console.log("mousemoove: ");
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(existingShapes, canvas, ctx);

      ctx.strokeStyle = "white";
      //@ts-ignore
      const selectedTool = window.selectedTool
      if(selectedTool === "rect"){
      ctx.strokeRect(startX, startY, width, height);
    
      }else if (selectedTool === "circle"){
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        const radius = Math.max(width,height) / 2;
        ctx.beginPath();
        ctx.arc(centerX,centerY , radius , 0, Math.PI * 2 );
        ctx.stroke();
        ctx.closePath()
      }
    }
  });
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  (ctx.fillStyle = "rgbs(0,0,0)"),
    ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "white";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
    else if (shape.type === "circle"){
       const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        const radius = Math.max(width,height) / 2;
        ctx.beginPath();
        ctx.arc(centerX,centerY , radius , 0, Math.PI * 2 );
        ctx.stroke();
        ctx.closePath()

    }
  });
}

async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const messages = res.data.messages;
  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });
  return shapes;
}
