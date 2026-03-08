import { db } from "../../db";
import { usersTable } from "../../db/schemas";

type database = typeof db;

export class AuthServices {
  constructor(private db: database) {}
  public async selectUser() {
    return await this.db.select().from(usersTable);
  }
  public async createUser() {
    // return await this.db.insert()
  }
}
