import { PrismaUserRepository } from '~/repositories/prisma/prisma-user-repository'
import { SignInService } from '../users/sign-in'

export function makeSignInService() {
  const usersRepository = new PrismaUserRepository()
  const signInService = new SignInService(usersRepository)

  return signInService
}
