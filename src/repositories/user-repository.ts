import { IUser } from '~/models'

export interface ICreateUserData {
  email: string
  password: string
  name: string
}

export interface IUpdateUserData {
  id: string
  name: string
}

export interface IUserRepository {
  create(data: ICreateUserData): Promise<IUser>

  getByEmail(email: string): Promise<IUser | null>
}
