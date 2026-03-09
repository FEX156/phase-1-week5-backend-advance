import { t } from "elysia";
import { createInsertSchema } from "drizzle-typebox";
import { usersTable } from "../../db/schemas";
import type { UnwrapSchema } from "elysia";

// DTO classes for service return values
export class RegisterResponseDto<
  T extends { id: any; username: any; email: any; createdAt: any },
> {
  id: string;
  username: string;
  email: string;
  createdAt: Date | string;
  constructor(data: T) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.createdAt = data.createdAt;
  }
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  constructor(data: { accessToken: string; refreshToken: string }) {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
  }
}

// 1. Base user schema for DRY usage
const baseUser = createInsertSchema(usersTable, {
  email: t.String({ format: "email", minLength: 5, maxLength: 255 }),
  username: t.String({ minLength: 3, maxLength: 10 }),
  password: t.String({ minLength: 6, maxLength: 100 }),
});

// 2. Register model: explicit, with comments
export const registerModel = {
  // Only allow username, password, email for registration
  reqBody: t.Pick(baseUser, ["username", "password", "email"]),
  // Response: id, username, email, createdAt
  resBody: t.Pick(baseUser, ["id", "username", "email", "createdAt"]),
  // Error response
  resInvalid: t.Literal("invalid type field input"),
};

export type RegisterType = {
  [K in keyof typeof registerModel]: UnwrapSchema<(typeof registerModel)[K]>;
};

// 3. Login model: explicit, with comments
export const loginModel = {
  // Only allow email, password for login
  reqBody: t.Pick(baseUser, ["email", "password"]),
  // Response: id, username, email, token
  resBody: t.Pick(baseUser, ["id", "username", "email"]), // token is not in baseUser, so add manually
  resToken: t.String({ minLength: 10 }),
  resInvalid: t.Literal("invalid type field input"),
};

export type LoginType = {
  [K in keyof typeof loginModel]: UnwrapSchema<(typeof loginModel)[K]>;
};

// 4. Suggestion: If you want to add token to resBody, you can use t.Intersect
// loginModel.resBody = t.Intersect([
//   t.Pick(baseUser, ["id", "username", "email"]),
//   t.Object({ token: t.String({ minLength: 10 }) })
// ])

// 5. Suggestion: Centralize error literals if reused
export const errorLiterals = {
  invalidType: t.Literal("invalid type field input"),
};
