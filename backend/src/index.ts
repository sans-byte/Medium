import { Hono } from "hono";
import blog from "./blogRoutes";
import user from "./usersRoutes";
import authMiddleware from "./middleware/authMiddleware";

const app = new Hono().basePath("/api/v1");
app.use("/blog/*", authMiddleware);
app.route("/blog", blog);
app.route("/user", user);

export default app;
