import type { drizzleDB } from "../../db";
import { conversationsTable } from "../../db/schemas";
import { participantsTable } from "../../db/schemas";
import { messagesTable } from "../../db/schemas";
import { eq, and, exists } from "drizzle-orm";

export class ConversationServices {
  constructor(private db: drizzleDB | any) {}

  private async checkIfDuplicatePrivateConversation(
    userId: string,
    partnerId: string,
  ) {
    const existingChat = await this.db
      .select({ id: conversationsTable.id })
      .from(conversationsTable)
      .innerJoin(
        participantsTable,
        eq(conversationsTable.id, participantsTable.conversationId),
      )
      .where(
        and(
          eq(conversationsTable.type, "private"),
          eq(participantsTable.userId, partnerId),
          exists(
            this.db
              .select()
              .from(participantsTable)
              .where(
                and(
                  eq(participantsTable.conversationId, conversationsTable.id),
                  eq(participantsTable.userId, userId),
                ),
              ),
          ),
        ),
      )
      .limit(1);

    if (existingChat.length > 0) {
      return existingChat[0].id;
    } else {
      return false;
    }
  }

  public async getConversations(userId: string, limit: number) {}

  public async newPrivateConversation(
    userId: string,
    partnerId: string,
    message: string,
  ) {
    const conversationId = await this.checkIfDuplicatePrivateConversation(
      userId,
      partnerId,
    );

    if (conversationId) {
      const [msg] = await this.db
        .insert(messagesTable)
        .values({
          conversationId: conversationId,
          senderId: userId,
          content: message,
          status: "sent",
        })
        .returning();

      return msg;
    }

    await this.db.transaction(async (tx: any) => {
      // 1. Buat percakapan
      const [conv] = await tx
        .insert(conversationsTable)
        .values({ type: "private" })
        .returning();

      // 2. Tambahkan peserta (Bulk Insert)
      await tx.insert(participantsTable).values([
        { conversationId: conv.id, userId: userId },
        { conversationId: conv.id, userId: partnerId },
      ]);

      // 3. Simpan pesan pertama
      const [msg] = await tx
        .insert(messagesTable)
        .values({
          conversationId: conv.id,
          senderId: userId,
          content: message,
          status: "sent",
        })
        .returning();

      return msg;
    });
  }

  public async newGroupConversation() {}
}
