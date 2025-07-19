import { PrismaUserDeckRepository } from '~/repositories/prisma/prisma-user-deck-repository'
import { CreateUserDeckService } from '~/services/user-decks/create-user-deck'

export function makeCreateUserDeckService() {
  const userDeckRepository = new PrismaUserDeckRepository()
  const createUserDeckService = new CreateUserDeckService(userDeckRepository)

  return createUserDeckService
}
