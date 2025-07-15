import { db } from '~/adapters/db'
import { IUser } from '~/models'
import { ICreateUserData, IUserRepository } from '~/repositories/user-repository'

export class PrismaUserRepository implements IUserRepository {
  async create(data: ICreateUserData): Promise<IUser> {
    return await db.user.create({ data })
  }

  async getByEmail(email: string): Promise<IUser | null> {
    return await db.user.findUnique({
      where: { email },
    })
  }
}
