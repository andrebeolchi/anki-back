import { CardStatus } from '@prisma/client'

type IntervalKey = 'new' | 'learning' | 'review' | 'mature'

type Transition = {
  nextStatus: CardStatus
  interval: IntervalKey
}

type StatusTransitionMap = Record<CardStatus, {
  correct: Transition
  incorrect: Transition
}>

export class CardScheduler {
  private intervals: Record<IntervalKey, number> = {
    new: 10 * 60 * 1000,
    learning: 60 * 60 * 1000,
    review: 24 * 60 * 60 * 1000,
    mature: 30 * 24 * 60 * 60 * 1000
  }

  private transitions: StatusTransitionMap = {
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

  public getNextReview(currentStatus: CardStatus, isCorrect: boolean): {
    nextStatus: CardStatus
    nextReview: Date
  } {
    const resultType = isCorrect ? 'correct' : 'incorrect'
    const transition = this.transitions[currentStatus]?.[resultType] || this.transitions.new.incorrect
    const intervalMs = this.intervals[transition.interval]

    return {
      nextStatus: transition.nextStatus,
      nextReview: new Date(Date.now() + intervalMs)
    }
  }
}
