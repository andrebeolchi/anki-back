import { IUserDeckRepository } from '~/repositories/user-deck-repository'
import { IUserDeck } from '~/models'
import { ResourceNotFoundError } from '../_errors'

interface IUpdateStreakRequest {
  userId: string
  deckId: string
}

export class UpdateStreakService {
  constructor(private userDeckRepository: IUserDeckRepository) {}

  async execute({ userId, deckId }: IUpdateStreakRequest): Promise<IUserDeck> {
    const userDeck = await this.userDeckRepository.getByUserIdAndDeckId({ userId, deckId })

    if (!userDeck) {
      throw new ResourceNotFoundError()
    }

    const today = new Date()
    const todayStr = today.toDateString()
    const lastStr = userDeck.lastStudyAt?.toDateString()

    if (lastStr === todayStr) {
      return userDeck
    }

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()

    const newStreak = lastStr === yesterdayStr ? userDeck.currentStreak + 1 : 1
    const maxStreak = Math.max(newStreak, userDeck.maxStreak)

    return await this.userDeckRepository.updateStreak({
      userId,
      deckId,
      currentStreak: newStreak,
      maxStreak,
      lastStudyAt: today
    })
  }
}