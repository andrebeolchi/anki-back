import { PrismaDeckRepository } from '~/repositories/prisma/prisma-deck-repository'
import { CreateDeckService } from '~/services/decks/create-deck'

export function makeCreateDeckService() {
  const deckRepository = new PrismaDeckRepository()
  const createDeckService = new CreateDeckService(deckRepository)

  return createDeckService
}
