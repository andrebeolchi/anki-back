import { IUserDeckRepository } from '~/repositories/user-deck-repository'

interface IGetUserDecksParams {
  userId: string
}

export class GetUserDecksService {
  constructor(private userDecksRepository: IUserDeckRepository) {}

  execute({ userId }: IGetUserDecksParams) {
    return this.userDecksRepository.getUserDecks(userId)
  }
}
