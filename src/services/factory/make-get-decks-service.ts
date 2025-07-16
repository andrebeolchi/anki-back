import { PrismaDeckRepository } from '~/repositories/prisma/prisma-deck-repository'
import { GetDecksService } from '../decks/get-decks'

export function makeGetDecksService() {
  const deckRepository = new PrismaDeckRepository()
  const getDecksService = new GetDecksService(deckRepository)

  return getDecksService
}
