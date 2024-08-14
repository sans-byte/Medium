import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

const authMiddleware = createMiddleware(async (c, next) => {
  try {
    const bearerToken = c.req.header("Authorization");
    if (!bearerToken) {
      c.status(403);
      return c.json({ message: "Unauthorized" });
    }
    const token = bearerToken.split(" ")[1];
    if (!token) {
      c.status(403);
      return c.json({ message: "Unauthorized" });
    }
    await verify(token, c.env.JWT_SECRET);
    await next();
  } catch (error) {
    console.log(error);
    c.status(403);
    return c.json({ message: "Unauthorized access Forbidden" });
  }
});

export default authMiddleware;
