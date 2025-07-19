import { IUserDeckRepository } from '~/repositories/user-deck-repository'

interface IChangeUserDeckParams {
  id: string
  status: 'active' | 'archived'
}

export class ChangeUserDeckService {
  constructor(private userDecksRepository: IUserDeckRepository) {}

  execute({ id, status }: IChangeUserDeckParams) {
    return this.userDecksRepository.changeUserDeckStatus({ id, status })
  }
}
