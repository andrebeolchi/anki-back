import { PrismaUserDeckRepository } from '~/repositories/prisma/prisma-user-deck-repository'
import { ChangeUserDeckService } from '~/services/user-decks/change-user-deck'

export function makeChangeUserDeckService() {
  const userDeckRepository = new PrismaUserDeckRepository()
  const changeUserDeckService = new ChangeUserDeckService(userDeckRepository)

  return changeUserDeckService
}
