import Elysia from "elysia";
import { db } from "../../db";
import { AuthServices } from "./services";
import { authCore, verifyRefresh } from "../../plugin/auth.plugin";
import { registerModel, loginModel } from "./model";

const auth = new AuthServices(db);

export const authController = new Elysia({ prefix: "/auth" })
  .use(authCore)
  .post(
    "/register",
    async ({ body, set }) => {
      const users = await auth.register(body);
      set.status = 201;
      return { succes: true, message: "User Created", data: users };
    },
    {
      body: registerModel.reqBody,
      response: registerModel.resBody,
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
  .group("/session", (app) =>
    app
      .use(verifyRefresh)
      .post("/logout", async ({ refreshUser, set }) => {
        await auth.deleteSession(refreshUser.id);
        set.status = 200;
        return { succes: true, data: null };
      })
      .post("/refresh", async ({ refreshUser, refreshJwt, set }) => {
        const token = await auth.newRefreshToken(refreshUser, refreshJwt);
        set.status = 200;
        return { succes: true, data: token };
      }),
  );
