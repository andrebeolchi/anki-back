import { db } from '~/adapters/db'
import { ICreateDeckData, IDeckRepository } from '~/repositories/deck-repository'

export class PrismaDeckRepository implements IDeckRepository {
  async create({ cards, ...deck }: ICreateDeckData) {
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

  async getPublicDecks() {
    return await db.deck.findMany({
      where: { status: 'public' },
      include: {
        creator: true,
        _count: {
          select: {
            cards: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getPublicDecksByCreatorId(creatorId: string) {
    return await db.deck.findMany({
      where: {
        creatorId,
        status: 'public'
      },
      include: {
        creator: true,
        _count: {
          select: {
            cards: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getPrivateDecks(creatorId: string) {
    return await db.deck.findMany({
      where: {
        status: 'private',
        creatorId
      },
      include: {
        creator: true,
        _count: {
          select: {
            cards: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getDecksForUser(userId: string) {
    return await db.deck.findMany({
      where: {
        OR: [
          { status: 'public' },
          { status: 'private', creatorId: userId }
        ]
      },
      include: {
        creator: true,
        _count: {
          select: {
            cards: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}
