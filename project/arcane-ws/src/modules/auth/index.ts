import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AuthServices } from "./services";
import { db } from "../../db";
import { registerModel, loginModel } from "./model";

const auth = new AuthServices(db);

export const authController = new Elysia({ prefix: "/auth" })
  .use(
    jwt({ name: "accessJwt", secret: process.env.ACCESS_SECRET!, exp: "15m" }),
  )
  .use(
    jwt({ name: "refreshJwt", secret: process.env.REFRESH_SECRET!, exp: "3d" }),
  )
  .post(
    "/register",
    async ({ body, set }) => {
      const users = await auth.register(body);
      set.status = 201;
      return { succes: true, data: users };
    },
    {
      body: registerModel.reqBody,
    },
  )
  .post(
    "/login",
    async ({ body, accessJwt, refreshJwt, set, cookie: { refresh } }) => {
      const { accessToken, refreshToken } = await auth.login(
        body,
        accessJwt,
        refreshJwt,
      );

      refresh?.set({
        value: refreshToken,
        httpOnly: true,
        maxAge: 3 * 86400,
      });
      set.status = 200;
      return { succes: true, data: { token: accessToken } };
    },
    {
      body: loginModel.reqBody,
    },
  )
  .post("/logout", ({ body, accessJwt, refreshJwt }) => true)
  .post("/refresh", ({ body, refreshJwt }) => true);
