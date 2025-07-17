import { IUserCard } from '~/models';
import { IUpsertUserCardData, IUserCardRepository } from '../user-card-repository';
import { db } from '~/adapters/db';

export class PrismaUserCardRepository implements IUserCardRepository {
  async findByUserAndCard({ userId, cardId }: { userId: string; cardId: string; }): Promise<IUserCard | null> {
    return await db.userCard.findUnique({
      where: {
        userId_cardId: { userId, cardId }
      }
    });
  }

  async upsert(data: IUpsertUserCardData): Promise<IUserCard> {
    return await db.userCard.upsert({
      where: {
        userId_cardId: { userId: data.userId, cardId: data.cardId }
      },
      update: {
        status: data.status,
        nextReview: data.nextReview,
        lastReviewed: new Date()
      },
      create: {
        ...data,
        lastReviewed: new Date(),
      }
    });
  }
}
