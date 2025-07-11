import { WebSocketServer ,WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {prismaClient} from "@repo/db/client"

const wss = new WebSocketServer({ port: 8081 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];
console.log("ehree");
function checkUser(token: string): string | null {
  try{
    const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded === "string") {
    return null;
  }

  if (!decoded || !decoded.userId) {
    return null;
  }
  return decoded.userId;
  }
  catch(e){
    return null
  }
  return null
}

wss.on("connection", function connection(ws, request) {

  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";

  const userId = checkUser(token);
  if (!userId) {
    ws.close();
    return null;
  }
console.log("ehree1");
  users.push({
    userId,
    rooms: [],
    ws
  });

  ws.on("message",async function message(data) {
    let parsedData;
    // const parsedData = JSON.parse(data as unknown as string);  //  data =  {type:"join-room , roomId:1"}
    if(typeof data !== "string"){
      parsedData = JSON.parse(data.toString())
    }else{
      parsedData = JSON.parse(data)

    }
    if (parsedData.type === "join-room") {
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave-room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }

      user.rooms = user?.rooms.filter(room => room !== parsedData.roomId);
    }

    if (parsedData.type === 'chat') {
      const roomId = parsedData.roomId;
      const message = parsedData.message;


      await prismaClient.chat.create({
        data:{
          roomId:Number(roomId),
          message,
          userId
        }
      })

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId,
            // userId
            
          }));
        }
      });
    }
  });
});
