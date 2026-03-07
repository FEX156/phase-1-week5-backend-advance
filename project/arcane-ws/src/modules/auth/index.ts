import Elysia from "elysia";

export const authController = new Elysia({ prefix: "/auth" }).get(
  "/users",
  async () => {
    return {
      message: "Halo dari Elysia!",
      status: "success",
    };
  }, //scheama
);
