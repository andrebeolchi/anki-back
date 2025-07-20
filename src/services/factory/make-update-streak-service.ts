import { PrismaUserDeckRepository } from '~/repositories/prisma/prisma-user-deck-repository'
import { UpdateStreakService } from '~/services/user-decks/update-streak-service'

export function makeUpdateStreakService() {
  const userDeckRepository = new PrismaUserDeckRepository()
  const updateStreak = new UpdateStreakService(userDeckRepository)

  return updateStreak
}
