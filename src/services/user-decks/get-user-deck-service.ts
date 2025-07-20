import { IUserDeckRepository } from '~/repositories/user-deck-repository'
import { IUserDeck } from '~/models'

interface IGetUserDeckRequest {
  userId: string
  deckId: string
}

export class GetUserDeckService {
  constructor(private userDeckRepository: IUserDeckRepository) {}

  async execute({ userId, deckId }: IGetUserDeckRequest): Promise<IUserDeck | null> {
    return await this.userDeckRepository.getByUserIdAndDeckId({ userId, deckId })
  }
}
