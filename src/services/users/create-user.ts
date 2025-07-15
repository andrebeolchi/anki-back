import { IUserRepository } from '~/repositories/user-repository'
import { ResourceAlreadyExistsError } from '~/services/_errors'

interface ICreateUserRequest {
  name: string
  email: string
  password: string
}

export class CreateUserService {
  constructor(private usersRepository: IUserRepository) {}

  async execute(body: ICreateUserRequest) {
    const emailExists = await this.usersRepository.getByEmail(body.email)

    if (emailExists) {
      throw new ResourceAlreadyExistsError()
    }

    return await this.usersRepository.create(body)
  }
}
