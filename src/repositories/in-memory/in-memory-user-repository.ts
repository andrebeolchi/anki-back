import { User } from '@prisma/client'
import { randomUUID } from 'crypto'
import { omit } from 'ramda'
import { IUser } from '~/models'

import { ICreateUserData, IUserRepository } from '~/repositories/user-repository'

export class InMemoryUserRepository implements IUserRepository {
  public users: User[] = []

  async create(data: ICreateUserData): Promise<IUser> {
    const user = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.users.push(user)

    return omit(['password'], user)
  }

  async getByEmail(email: string): Promise<IUser | null> {
    const user = this.users.find(user => user.email === email)

    if (!user) {
      return Promise.resolve(null)
    }

    return omit(['password'], user)
  }
}
