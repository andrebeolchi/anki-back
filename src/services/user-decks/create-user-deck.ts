import { IUserDeckRepository } from '~/repositories/user-deck-repository'

export interface ICreateUserDecksParams {
  userId: string
  deckId: string
}

export class CreateUserDeckService {
  constructor(private userDecksRepository: IUserDeckRepository) {}

  execute({ userId, deckId }: ICreateUserDecksParams) {
    return this.userDecksRepository.createUserDeck({ userId, deckId })
  }
}
