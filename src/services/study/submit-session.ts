import { IUserCardRepository } from '~/repositories/user-card-repository'
import { CardStatus } from '@prisma/client'
import { UpdateStreakService } from '~/services/user-decks/update-streak-service'
import { CardScheduler } from '~/services/user-decks/card-scheduler'

interface ICardAnswer {
  cardId: string
  isCorrect: boolean
}

interface ISubmitSessionParams {
  userId: string
  deckId: string
  answers: ICardAnswer[]
}

interface IProcessedAnswer {
  cardId: string
  previousStatus?: CardStatus | null
  newStatus: CardStatus
  nextReview: Date
  wasCorrect: boolean
}

interface ISubmitSessionResponse {
  processedAnswers: IProcessedAnswer[]
  sessionStats: {
    totalProcessed: number
    correctAnswers: number
    incorrectAnswers: number
    newCardsLearned: number
    cardsToRelearn: number
  }
}

export class SubmitSessionService {
  private scheduler = new CardScheduler()

  constructor(
    private userCardRepository: IUserCardRepository,
    private updateStreakService: UpdateStreakService
  ) { }

  private computeSessionStats(processedAnswers: IProcessedAnswer[]): ISubmitSessionResponse['sessionStats'] {
    return processedAnswers.reduce<ISubmitSessionResponse['sessionStats']>((stats, result) => {
      stats.totalProcessed++
      if (result.wasCorrect) {
        stats.correctAnswers++
      } else {
        stats.incorrectAnswers++
        stats.cardsToRelearn++
      }

      if (result.previousStatus === 'new' && result.wasCorrect) {
        stats.newCardsLearned++
      }

      return stats
    }, {
      totalProcessed: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      newCardsLearned: 0,
      cardsToRelearn: 0
    })
  }

  private async processAnswer(userId: string, answer: ICardAnswer): Promise<IProcessedAnswer> {
    const existingUserCard = await this.userCardRepository.findByUserAndCard({
      userId,
      cardId: answer.cardId
    })

    const previousStatus = existingUserCard?.status ?? 'new'

    const { nextStatus, nextReview } = this.scheduler.getNextReview(previousStatus, answer.isCorrect)

    await this.userCardRepository.upsert({
      userId,
      cardId: answer.cardId,
      status: nextStatus,
      nextReview
    })

    return {
      cardId: answer.cardId,
      previousStatus,
      newStatus: nextStatus,
      nextReview,
      wasCorrect: answer.isCorrect
    }
  }

  public async execute({ userId, deckId, answers }: ISubmitSessionParams): Promise<ISubmitSessionResponse> {
    const processedAnswers = await Promise.all(answers.map(answer => this.processAnswer(userId, answer)))

    const sessionStats = this.computeSessionStats(processedAnswers)

    await this.updateStreakService.execute({
      userId,
      deckId
    })

    return { processedAnswers, sessionStats }
  }
}