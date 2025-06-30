import { NextFunction, Request, Response } from "express";

export const logger = async(req:Request, res: Response, next:NextFunction)=>{
console.log(`HELLO ${req.path}/${req.method}`);
next();
}