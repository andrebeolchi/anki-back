import { PrismaUserRepository } from '~/repositories/prisma/prisma-user-repository'
import { CreateUserService } from '~/services/users/create-user'

export function makeCreateUserService() {
  const userRepository = new PrismaUserRepository()
  const createUserService = new CreateUserService(userRepository)

  return createUserService
}
