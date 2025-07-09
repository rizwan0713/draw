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

export function initDraw(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  let existingShapes: Shape[] = [];
  if (!ctx) {
    return;
  }
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    existingShapes.push({
        type:"rect",
      x: startX,
      y: startY,
      width: width,
      height: height
    }) 
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
        console.log("mousemoove: " )
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(existingShapes,canvas,ctx);
      

      ctx.strokeStyle = "white";
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}


function clearCanvas(existingShapes:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle ="rgbs(0,0,0)",
    ctx.fillRect(0,0,canvas.width,canvas.height)


    existingShapes.map((shape) => {
        if(shape.type === "rect"){
          ctx.strokeStyle = "white";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}