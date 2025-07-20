import { omit } from 'ramda'
import { db } from '~/adapters/db'
import { IChangeUserDeckStatusParams, IGetByUserIdAndDeckId, IUserDeckRepository } from '../user-deck-repository'
import { ICreateUserDecksParams } from '~/services/user-decks/create-user-deck'
import { IUserDeck } from '~/models'

export class PrismaUserDeckRepository implements IUserDeckRepository {
  async getUserDecks(userId: string) {
    const decks = await db.userDeck.findMany({
      where: {
        user: { id: userId },
      },
      include: {
        deck: {
          include: {
            _count: {
              select: {
                cards: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return decks.map(deck => ({
      ...omit(['_count'], deck.deck),
      cardsCount: deck.deck._count.cards,
      enrollment: {
        ...omit(['deck'], deck),
      },
    }))
  }

  async createUserDeck({ userId, deckId }: ICreateUserDecksParams) {
    return await db.userDeck.create({
      data: {
        deckId,
        userId,
      },
    })
  }

  async changeUserDeckStatus({ id, status }: IChangeUserDeckStatusParams) {
    return await db.userDeck.update({
      where: { id },
      data: { status },
    })
  }

  async getByUserIdAndDeckId({ deckId, userId }: IGetByUserIdAndDeckId): Promise<IUserDeck | null> {
    return await db.userDeck.findUnique({
      where: {
        userId_deckId: {
          deckId,
          userId,
        },
      },
    })
  }

  async updateStreak({ deckId, userId, currentStreak, maxStreak, lastStudyAt }: IUserDeck): Promise<IUserDeck> {
    return await db.userDeck.update({
      where: {
        userId_deckId: {
          deckId,
          userId,
        },
      },
      data: {
        currentStreak,
        maxStreak,
        lastStudyAt,
      },
    })
  }
}
