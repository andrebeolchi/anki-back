import { PrismaUserDeckRepository } from '~/repositories/prisma/prisma-user-deck-repository'
import { GetUserDecksService } from '../user-decks/get-user-decks'

export function makeGetUserDecksService() {
  const userDeckRepository = new PrismaUserDeckRepository()
  const getUserDecksService = new GetUserDecksService(userDeckRepository)

  return getUserDecksService
}
