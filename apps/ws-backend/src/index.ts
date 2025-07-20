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
async function checkUser(token: string) {
  console.log("OKAY CHECK ")
  try{
    console.log("CHECK USER")
    const decoded = await jwt.verify(token, JWT_SECRET);
    console.log("DECODED",decoded)
  if (typeof decoded === "string") {
    console.log("STRIng RETURN")
    return null;
  }
  
  if (!decoded || !decoded.userId) {
    console.log("Decode RETURN")
    return null;
  }
  console.log("here i am in ws in dex")
  console.log("Decoded",decoded)
  return decoded.userId;
}
catch(e){
  console.log("Error RETURN")
  return null
  }
  return null
}

wss.on("connection", async function connection(ws, request) {
console.log("CONNECTION OPEN MERE BHAI")
  const url = request.url;
  console.log(url)
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  console.log("QUERY",queryParams)
  const token = queryParams.get("token") ?? "";
  const roomId = queryParams.get("roomId")?? "";
console.log("token", token)
  const userId = await checkUser(token);
  console.log("USERID", userId)
  if (!userId) {
    ws.close();
    return null;
  }
console.log("ehree1");
  users.push({
    userId,
    rooms: roomId ? [roomId] : [],
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
        console.log("FOREEACH")
        console.log("USER MERA",user," and ",user.rooms.includes(roomId))
        if (user.rooms.includes(roomId)) {

          console.log("HELLO CLIENT")
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
