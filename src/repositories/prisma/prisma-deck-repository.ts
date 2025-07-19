import { omit } from 'ramda'
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
              answer: card.answer,
            })),
          },
        },
      },
      include: {
        cards: true,
      },
    })
  }

  async getPublicDecks(userId: string) {
    const decks = await db.deck.findMany({
      where: { status: 'public' },
      include: {
        creator: true,
        _count: {
          select: {
            cards: true,
          },
        },
        userDecks: {
          where: {
            userId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return decks.map(deck => ({
      ...omit(['_count'], deck),
      cardsCount: deck._count.cards,
      enrolled: deck.userDecks.length > 0,
    }))
  }

  async getPublicDecksByCreatorId(userId: string, creatorId: string) {
    const decks = await db.deck.findMany({
      where: {
        creatorId,
        status: 'public',
      },
      include: {
        creator: true,
        _count: {
          select: {
            cards: true,
          },
        },
        userDecks: {
          where: {
            userId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return decks.map(deck => ({
      ...omit(['_count'], deck),
      cardsCount: deck._count.cards,
      enrolled: deck.userDecks.length > 0,
    }))
  }

  async getPrivateDecks(userId: string) {
    const decks = await db.deck.findMany({
      where: {
        status: 'private',
        creatorId: userId,
      },
      include: {
        creator: true,
        _count: {
          select: {
            cards: true,
          },
        },
        userDecks: {
          where: {
            userId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return decks.map(deck => ({
      ...omit(['_count'], deck),
      cardsCount: deck._count.cards,
      enrolled: deck.userDecks.length > 0,
    }))
  }

  async getDecksForUser(userId: string) {
    const decks = await db.deck.findMany({
      where: {
        OR: [{ status: 'public' }, { status: 'private', creatorId: userId }],
      },
      include: {
        creator: true,
        _count: {
          select: {
            cards: true,
          },
        },
        userDecks: {
          where: {
            userId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return decks.map(deck => ({
      ...omit(['_count'], deck),
      cardsCount: deck._count.cards,
      enrolled: deck.userDecks.length > 0,
    }))
  }

  async getDeckById(deckId: string) {
    return await db.deck.findUnique({
      where: { id: deckId },
      include: {
        cards: true,
        creator: true,
      },
    })
  }
}
