import { Elysia } from "elysia";
import { authCore, verifyAccess } from "../../plugin/auth.plugin";

type messageFormat = {
  userId: string;
  type: string;
  content: string;
};

export const wsApp = new Elysia().use(authCore).ws("/ws", {
  async beforeHandle({ query: { token }, accessJwt, set }) {
    if (!token) {
      console.log("Token not found");
      set.status = 401;
      return "Unauthorized";
    }

    const payload = await accessJwt.verify(token);

    if (!payload) {
      console.log("Token not valid");
      set.status = 401;
      return "Invalid token";
    }
  },
  open(ws) {
    console.log("Koneksi dibuka:", ws.id);
    ws.send(JSON.stringify({ message: "hello guys" }));
    console.log();
  },
  message(ws, message: messageFormat) {
    console.log("Diterima:", message);
    ws.send(JSON.stringify(message.content));
  },
  close(ws, code, message) {
    console.log(`Koneksi ditutup: ${code} ${message}`);
  },
});
