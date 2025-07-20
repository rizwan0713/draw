import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, signinSchema, RoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { logger } from "./logger";
import  cors from "cors"

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // ✅ specific origin, NOT "*"
  credentials: true, // ✅ allow cookies, tokens, etc.
}))
app.use(logger);

app.post("/signup", logger, async (req, res) => {
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
    console.log("PP",user)
    res.json({
      userId: user.id,
    });
  } catch (error) {
    res.status(411).json({
      message: "user already exits with this user name",
    });
  }
});

app.post("/signin", logger, async (req, res) => {
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

  if (!user) {
    res.status(403).json({
      message: "Not authorized",
    });
  
  }

  const token = jwt.sign(
    {
      userId: user?.id,
    },
    JWT_SECRET
  );

  res.json({ token });
});

app.post("/room", logger, middleware, async (req: Request, res: Response) => {
  console.log("yahan hun mein")

const parsedData = RoomSchema.safeParse(req.body);
  if (!parsedData.success) {
   res.status(400).json({ message: "Incorrect Input" });
  }

  const userId = (req as any).userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data?.roomName!,
        adminId: userId,
        user: {
          connect: { id: userId }, // Add admin to participants too
        },
      },
    });

    res.json({ roomId: room.id });
  } catch (error: any) {
    console.error("Create room error:", error.message);
    res.status(411).json({ message: "Room already exists with this name" });
  }

});

app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 1000,
    });
    res.json({
      messages,
    });
  } catch (e) {res.json({
    messages:[]
  })}
});

app.post("/join",logger, middleware,async (req, res) => {
  const { roomId } = req.body;
  const userId = (req as any).userId;

  try {
    // Add user to room participants
    await prismaClient.room.update({
      where: { id: parseInt(roomId) },
      data: {
        user: {
          connect: { id: userId },
        },
      },
    });

    res.json({ success: true, message: "Joined room successfully" });
  } catch (error: any) {
    console.error("Join room error:", error.message);
    res.status(400).json({ success: false, message: "Failed to join room" });
  }
})

app.get("/room/:slug", async (req, res) => {
  alert("here")
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
    include: {
        user: true,
        admin: true,
      },
  });

  
  res.json({
    room
  });
});

app.listen(8080);
