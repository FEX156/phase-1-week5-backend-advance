import { t } from "elysia";
import { createInsertSchema } from "drizzle-typebox";
import { usersTable } from "../../db/schemas";

export const _users = createInsertSchema(usersTable, {
  email: t.String({ format: "email" }),
});
export const createUserRequest = t.Omit(_users, [
  "id",
  "lastSeen",
  "token",
  "createdAt",
  "updatedAt",
]);

// export class AuthDto {}
