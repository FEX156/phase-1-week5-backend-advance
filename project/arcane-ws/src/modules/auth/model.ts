import { t } from "elysia";

export const AuthModel = {
  registerBody: t.Object({
    username: t.String({
      description: "username for unique identifier in chat",
      minLength: 1,
      maxLength: 12,
    }),
    email: t.String({ format: "email", minLength: 1 }),
  }),
};
