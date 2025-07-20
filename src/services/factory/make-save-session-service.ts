import { SubmitSessionService } from '../study/submit-session'
import { PrismaUserCardRepository } from '~/repositories/prisma/prisma-user-card-repository'
import { makeUpdateStreakService } from './make-update-streak-service'

export function makeSaveSessionService() {
  const updateStreakService = makeUpdateStreakService()
  const userCardRepository = new PrismaUserCardRepository()
  const saveSessionService = new SubmitSessionService(userCardRepository, updateStreakService)

  return saveSessionService
}
