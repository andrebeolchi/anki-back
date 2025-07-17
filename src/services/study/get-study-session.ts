import { ResourceNotFoundError } from '~/services/_errors'

import { IDeckRepository } from '~/repositories/deck-repository'
import { ICardRepository } from '~/repositories/card-repository'
import { ICard, IUserCard } from '~/models'

interface ICardWithUserProgress extends ICard {
  userCards: IUserCard[]
}

interface IGetStudySessionParams {
  userId: string
  deckId: string
}

interface IProcessedCard extends Omit<ICardWithUserProgress, 'userCards'> {
  userCard: IUserCard | null
}

interface IStudySessionResponse {
  deck: {
    id: string
    title: string
    description: string | null
    creator: {
      id: string
      name: string
    }
  }
  cards: IProcessedCard[]
  stats: {
    totalCards: number
    newCards: number
    reviewCards: number
  }
}

export class GetStudySessionService {
  constructor(
    private deckRepository: IDeckRepository,
    private cardRepository: ICardRepository,
  ) { }

  private processCardsForStudy(cards: ICardWithUserProgress[]): IProcessedCard[] {
    return cards.map(({ userCards, ...card }) => ({
      ...card,
      userCard: userCards[0] || null
    }))
  }

  private sortProcessedCards(cards: IProcessedCard[]): IProcessedCard[] {
    return cards.sort((a, b) => {
      if (!a.userCard && b.userCard) return -1
      if (a.userCard && !b.userCard) return 1
      if (!a.userCard || !b.userCard) return 0

      if (!a.userCard.nextReview && b.userCard.nextReview) return 1
      if (a.userCard.nextReview && !b.userCard.nextReview) return -1
      if (!a.userCard.nextReview && !b.userCard.nextReview) return 0

      return new Date(a.userCard.nextReview!).getTime() - new Date(b.userCard.nextReview!).getTime()
    })
  }

  private calculateStudyStats(cards: IProcessedCard[]) {
    return {
      totalCards: cards.length,
      newCards: cards.filter(card => !card.userCard).length,
      reviewCards: cards.filter(card =>
        card.userCard && card.userCard.nextReview &&
        new Date(card.userCard.nextReview) <= new Date()
      ).length
    }
  }

  async execute({ userId, deckId }: IGetStudySessionParams): Promise<IStudySessionResponse> {
    const deck = await this.deckRepository.getDeckById(deckId)

    if (!deck) {
      throw new ResourceNotFoundError()
    }

    const cards = await this.cardRepository.findByDeckWithUserProgress({ deckId, userId })

    const processedCards = this.processCardsForStudy(cards)
    const sortedCards = this.sortProcessedCards(processedCards)

    const stats = this.calculateStudyStats(sortedCards)

    return {
      deck: {
        id: deck.id!,
        title: deck.title,
        description: deck.description || null,
        creator: {
          id: deck.creator.id!,
          name: deck.creator.name
        }
      },
      cards: sortedCards,
      stats
    }
  }
}
