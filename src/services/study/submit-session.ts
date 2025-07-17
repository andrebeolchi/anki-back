import { IUserCardRepository } from '~/repositories/user-card-repository'
import { CardStatus } from '@prisma/client'

interface ICardAnswer {
  cardId: string
  isCorrect: boolean
  currentStatus?: CardStatus
}

interface ISubmitSessionParams {
  userId: string
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
  private intervals = {
    new: 10 * 60 * 1000,
    learning: 60 * 60 * 1000,
    review: 24 * 60 * 60 * 1000,
    mature: 30 * 24 * 60 * 60 * 1000
  }

  private statusTransitions = {
    new: {
      correct: { nextStatus: 'learning', interval: 'new' },
      incorrect: { nextStatus: 'relearning', interval: 'new' }
    },
    learning: {
      correct: { nextStatus: 'review', interval: 'learning' },
      incorrect: { nextStatus: 'relearning', interval: 'new' }
    },
    review: {
      correct: { nextStatus: 'mature', interval: 'review' },
      incorrect: { nextStatus: 'relearning', interval: 'new' }
    },
    relearning: {
      correct: { nextStatus: 'learning', interval: 'new' },
      incorrect: { nextStatus: 'relearning', interval: 'new' }
    },
    mature: {
      correct: { nextStatus: 'mature', interval: 'mature' },
      incorrect: { nextStatus: 'relearning', interval: 'new' }
    }
  }

  constructor(private userCardRepository: IUserCardRepository) { }

  async execute({ userId, answers }: ISubmitSessionParams): Promise<ISubmitSessionResponse> {
    const processedAnswers: IProcessedAnswer[] = []
    const sessionStats = {
      totalProcessed: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      newCardsLearned: 0,
      cardsToRelearn: 0
    }

    for (const answer of answers) {
      const result = await this.processAnswer(userId, answer)
      processedAnswers.push(result)

      sessionStats.totalProcessed++
      if (result.wasCorrect) {
        sessionStats.correctAnswers++
      } else {
        sessionStats.incorrectAnswers++
      }

      if (result.previousStatus === 'new' && result.wasCorrect) {
        sessionStats.newCardsLearned++
      }

      if (!result.wasCorrect) {
        sessionStats.cardsToRelearn++
      }
    }

    return {
      processedAnswers,
      sessionStats
    }
  }

  private async processAnswer(userId: string, answer: ICardAnswer): Promise<IProcessedAnswer> {
    const existingUserCard = await this.userCardRepository.findByUserAndCard({ userId, cardId: answer.cardId })

    const previousStatus = answer.currentStatus || existingUserCard?.status || 'new'
    const { nextStatus, nextReview } = this.calculateNextReview(previousStatus, answer.isCorrect)

    await this.userCardRepository.upsert({
      userId,
      cardId: answer.cardId,
      status: nextStatus,
      nextReview,
    })

    return {
      cardId: answer.cardId,
      previousStatus,
      newStatus: previousStatus ? nextStatus : 'new',
      nextReview,
      wasCorrect: answer.isCorrect
    }
  }

  private calculateNextReview(currentStatus: CardStatus, isCorrect: boolean): {
    nextStatus: CardStatus
    nextReview: Date
  } {
    const resultType = isCorrect ? 'correct' : 'incorrect'

    const transition = this.statusTransitions[currentStatus]?.[resultType] || this.statusTransitions.new.incorrect
    const intervalMs = this.intervals[transition.interval as keyof typeof this.intervals]

    return {
      nextStatus: transition.nextStatus as CardStatus,
      nextReview: new Date(new Date().getTime() + intervalMs)
    }
  }
}