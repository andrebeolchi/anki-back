import { IUserRepository } from '~/repositories/user-repository'
import { InvalidCredentialsError } from '../_errors'

export class SignInService {
  constructor(private usersRepository: IUserRepository) {}

  async execute(username: string) {
    const user = await this.usersRepository.getByEmail(username)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    return user
  }
}
