import { db, type dbType } from "../../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../../db/schemas";
import {
  type RegisterType,
  type LoginType,
  RegisterResponseDto,
  LoginResponseDto,
} from "./model";

export class AuthServices {
  constructor(private db: dbType) {}

  private async validateCredential(request: LoginType["reqBody"]) {
    const user = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.email, request.email),
    });
    const isValid =
      user && (await Bun.password.verify(request.password, user.password!));

    if (!isValid) {
      throw Error("invalid email and password");
    }

    return user;
  }

  public async register(request: RegisterType["reqBody"]) {
    const hashedPassword = await Bun.password.hash(request.password, {
      algorithm: "bcrypt",
      cost: 10,
    });
    request["password"] = hashedPassword;
    const [user] = await this.db.insert(usersTable).values(request).returning();

    return new RegisterResponseDto(user!);
  }

  public async login(
    request: LoginType["reqBody"],
    accessJwt: any,
    refreshJwt: any,
  ) {
    const validUser = await this.validateCredential(request);
    const payload = { id: validUser.id, username: validUser.username };

    const accessToken = await accessJwt.sign(payload);
    const refreshToken = await refreshJwt.sign(payload);

    await this.db
      .update(usersTable)
      .set({ token: refreshToken })
      .where(eq(usersTable.email, request.email));

    return new LoginResponseDto({ accessToken, refreshToken });
  }
  public async logout() {}
  public async getRefreshToken() {}
}
