import { Hono } from "hono";
import { getPrisma } from "./db";
import { decode, sign, verify } from "hono/jwt";
import { z } from "zod";

const user = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

enum statusCodes {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

const userSignUp = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

const userSignIn = userSignUp.pick({
  email: true,
  password: true,
});

user.get("/", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const users = await prisma.user.findMany();
  return c.json(users);
});

user.post("/signup", async (c) => {
  try {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const body = await c.req.json();
    const { success } = userSignUp.safeParse(body);
    if (!success) {
      c.status(statusCodes.BAD_REQUEST);
      return c.json({
        message: "Invalid input",
      });
    }

    const token = await sign(body, c.env.JWT_SECRET);

    const findUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (findUser) {
      c.status(statusCodes.BAD_REQUEST);
      return c.json({ message: "User already exists" });
    }

    const response = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });
    return c.json({ data: response, token });
  } catch (error) {
    console.log(error);
    c.status(statusCodes.INTERNAL_SERVER_ERROR);
    return c.json({ message: "Something went wrong while signup" });
  }
});

user.post("/signin", async (c) => {
  try {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const body = await c.req.json();
    const { success } = userSignIn.safeParse(body);
    if (!success) {
      c.status(statusCodes.BAD_REQUEST);
      return c.json({ message: "Invalid input" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      c.status(statusCodes.NOT_FOUND);
      return c.json({ message: "User not found" });
    }

    const token = await sign(user, c.env.JWT_SECRET);

    return c.json({ token });
  } catch (error) {
    console.log(error);
    c.status(statusCodes.INTERNAL_SERVER_ERROR);
    c.json("Something went wrong while signing in");
  }
});

export default user;
