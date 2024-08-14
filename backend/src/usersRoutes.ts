import { Hono } from "hono";

const user = new Hono();

user.get("/",(c)=>{
    return c.text("Hello Hono");
})

user.post("/signup", (c) => {
    return c.json("Signup");
})

user.post("/signin", (c) => {
    return c.json("signin");
})


export default user;