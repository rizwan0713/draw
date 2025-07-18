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
app.use(cors())
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

app.post("/room", logger, middleware, async (req: Request, res: Response) => {
  console.log("yahan hun mein")

  const parshedData = RoomSchema.safeParse(req.body);
  console.log("Parse", parshedData);
  if (!parshedData.success) {
    res.status(400).json({
      message: "Incorrect Input",
    });
    return;
  }
  // @ts-ignore
  const userId = req.userId;
  console.log("USER", userId);
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parshedData.data.roomName,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : "Unknown");
    res.status(411).json({
      message: "Room already exist with this name",
    });
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

app.get("/room/:slug", async (req, res) => {
  alert("here")
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });

  
  res.json({
    room
  });
});

app.listen(5001);
