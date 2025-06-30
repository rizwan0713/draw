
import express from "express";
import jwt from "jsonwebtoken"
import  {JWT_SECRET}  from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreateUserSchema ,signupSchema , RoomSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client";



const app = express();

app.post("/signup" , async (req,res) => {


    const withOutParsedData = req.body;
    console.log( "Without parsed data ",withOutParsedData)
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
         res.json({
            message:"Incorrect Input"
        })
        return;
    }
    res.json({
        userId :"123466"
    })

   const user = await prismaClient.user.create({
  data: {
    email:parsedData.data?.username,
    password:parsedData.data?.password,
    name:parsedData.data?.name

  }
   })



})
app.post("signin", (req,res) => {
    const data = signupSchema.safeParse(req.body);
    if(!data.success){
         res.json({
            message:"Incorrect Input"
        })
        return;
    }

    const userId = 1;
   const token =  jwt.sign({
        userId
    },JWT_SECRET);


    res.json({token})



})
app.post("/room" , middleware ,(req,res) => {
        const data = RoomSchema.safeParse(req.body);
    if(!data.success){
         res.json({
            message:"Incorrect Input"
        })
        return;
    }
    res.json({
        roomId:123
    })

})

app.listen(3001)