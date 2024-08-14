import { Hono } from "hono";
import { getPrisma } from "./db";
const blog = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

blog.get("/bulk", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const allBlogs = await prisma.post.findMany();
  console.log(allBlogs);
  return c.json(allBlogs);
});

blog.get("/:id", (c) => {
  const id = c.req.param("id");
  return c.json(`requested blog with id: ${id}`);
});

blog.post("/", (c) => {
  return c.json("Blog posted");
});

blog.put("/", (c) => {
  return c.json("Blog posted");
});

export default blog;
