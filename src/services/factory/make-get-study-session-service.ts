import { PrismaDeckRepository } from '~/repositories/prisma/prisma-deck-repository'
import { PrismaCardRepository } from '~/repositories/prisma/prisma-card-repository'
import { GetStudySessionService } from '~/services/study/get-study-session'

export function makeGetStudySessionService() {
  const deckRepository = new PrismaDeckRepository()
  const cardRepository = new PrismaCardRepository()
  const getStudySessionService = new GetStudySessionService(deckRepository, cardRepository)

  return getStudySessionService
}
