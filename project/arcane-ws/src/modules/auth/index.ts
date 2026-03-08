import { AuthServices } from "./services";
import { db } from "../../db";
import Elysia from "elysia";
import { createUserRequest } from "./model";

const auth = new AuthServices(db);

export const authController = new Elysia({ prefix: "/auth" })
  .get(
    "/test",
    async () => {
      return {
        message: "Halo dari Elysia!",
        status: "success",
      };
    }, //scheama
  )
  .get("/users", async () => {
    const users = await auth.selectUser();
    return {
      success: true,
      data: users,
    };
  })
  .post(
    "/users",
    async ({ body }) => {
      const users = await auth.createUser();
    },
    {
      body: createUserRequest,
    },
  );
