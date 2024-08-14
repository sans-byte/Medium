import { Hono } from "hono";
const blog = new Hono();

blog.get("/bulk",(c)=>{
    return c.json("requested all blogs");
})

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