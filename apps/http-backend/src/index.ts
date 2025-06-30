import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, signinSchema, RoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const withOutParsedData = req.body;
  console.log("Without parsed data ", withOutParsedData);

  const parsedData = CreateUserSchema.safeParse(req.body);
  console.log(" parsed data ", parsedData);

  if (!parsedData.success) {
    res.json({
      message: "Incorrect Input",
    });
    return;
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.email,
        //hashed password
        password: parsedData.data?.password,
        username: parsedData.data?.username,
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (error) {
    res.status(411).json({
      message: "user already exits with this user name",
    });
  }
});
app.post("/signin", async (req, res) => {
  const ParshedData = signinSchema.safeParse(req.body);
  if (!ParshedData.success) {
    res.json({
      message: "Incorrect Input",
    });
    return;
  }

  //totdo compare hashed password
  const user = await prismaClient.user.findFirst({
    where: {
      email: ParshedData.data.email,
      password: ParshedData.data.password,
    },
  });

  if(!user){
    res.status(403).json({
        message:"Not authorized"
    })
    return;
  }



  const token = jwt.sign(
    {
      userId: user?.id,
    },
    JWT_SECRET
  );

  res.json({ token });
});









app.post("/room",middleware , async (req, res) => {
  const parshedData = RoomSchema.safeParse(req.body);
  if (!parshedData.success) {
    res.json({
      message: "Incorrect Input",
    });
    return;
  }
// @ts-ignore
  const userId = req.userId;
 try{
    const room = await prismaClient.room.create({
    
    data :{
        slug:parshedData.data.roomName,
        admin:userId
    }
   })
   
  res.json({
    roomId: room.id
  });
 }
 catch(error){
    res.status(411).json({
      message:"Room already exist with this name"
    })
 }
});

app.listen(3001);
