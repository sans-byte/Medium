import { Hono } from 'hono'
import blog from './blogRoutes'
import user from './usersRoutes'

const app = new Hono().basePath("/api/v1");
app.route('/blog', blog)
app.route('/user', user)
export default app
