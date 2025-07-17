import { db } from '~/adapters/db';
import { ICardRepository } from '../card-repository';

export class PrismaCardRepository implements ICardRepository {
  async findByDeckWithUserProgress({ deckId, userId }: { deckId: string; userId: string }) {
    return await db.card.findMany({
      where: { deckId },
      include: {
        userCards: {
          where: { userId }
        }
      }
    })
  }
}
