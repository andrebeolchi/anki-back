import { IUser } from '~/models/user-interface'

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
