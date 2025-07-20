import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config"
import  jwt  from "jsonwebtoken";




export function middleware (req:Request ,res:Response,next:NextFunction):void{

const authHeader = req.headers["authorization"] ?? "";
console.log("authHeader  in middleware",authHeader )


const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
console.log("token in middleware",token)
if(!token){
     res.status(401).json({ message: "Unauthorized: No token provided" });
     return
}

const decoded = jwt.verify(token,JWT_SECRET);



if(decoded){
    //@ts-ignore
   req.userId = decoded.userId;
   next();
}
else {
    res.status(403).json({
        message:"unauthorized"
    })
}
}