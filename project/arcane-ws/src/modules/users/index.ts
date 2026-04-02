import Elysia from "elysia";
import { updateUser } from "./model";
import { verifyAccess } from "../../plugin/auth.plugin";

export const userController = new Elysia()
  .use(verifyAccess)
  .patch(
    "/users",
    ({ body }) => {
      return body;
    },
    { body: updateUser.reqBody },
  )
  .delete("/users", () => {})
  .get("/users", () => {});
