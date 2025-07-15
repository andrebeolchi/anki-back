import { db } from '~/adapters/db'
import { ICreateDeckData, ICreateDeckResponse, IDeckRepository } from '~/repositories/deck-repository'

export class PrismaDeckRepository implements IDeckRepository {
  async create({ cards, ...deck }: ICreateDeckData): Promise<ICreateDeckResponse> {
    return await db.deck.create({
      data: {
        ...deck,
        cards: {
          createMany: {
            data: cards.map(card => ({
              question: card.question,
              answer: card.answer
            }))
          }
        }
      },
      include: {
        cards: true
      }
    })
  }
}
