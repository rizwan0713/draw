import {z}  from "zod"

export const CreateUserSchema = z.object({
    username:z.string().min(3).max(20),
    password:z.string().min(8).max(25),
    email:z.string().min(3).max(50)
})
export const signinSchema = z.object({
    email:z.string().min(3).max(50),
    password:z.string().min(8).max(25),

})
export const RoomSchema = z.object({
    roomName:z.string().min(3).max(20)
})