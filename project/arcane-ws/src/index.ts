import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { authController } from "./modules/auth";
import { errorGlobalPlugin } from "./plugin/error.plugin";
import { wsApp } from "./modules/websocket";

const app = new Elysia()
  .use(cors())
  .use(errorGlobalPlugin)
  .get("/test", () => ({ message: "hello from Elysia", status: "success" }))
  .use(authController)
  .use(wsApp)
  .listen(3000);

console.log(`🚀 Server running at http://localhost:3000/`);
console.log(`📚 Swagger documentation at http://localhost:3000/swagger`);
console.log(`🔌 WebSocket endpoint at ws://localhost:3000/ws`);

export default app;
