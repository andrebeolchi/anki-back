import { IDeck, IUserDeck } from '~/models'
import { ICreateUserDecksParams } from '~/services/user-decks/create-user-deck'

export type IGetUserDecksResponse = (IDeck & {
  enrollment: IUserDeck
  cardsCount: number
})[]

export interface IChangeUserDeckStatusParams {
  id: string
  status: 'active' | 'archived'
}

export interface IUserDeckRepository {
  getUserDecks(userId: string): Promise<IGetUserDecksResponse>
  createUserDeck({ userId, deckId }: ICreateUserDecksParams): Promise<IUserDeck>
  changeUserDeckStatus({ id, status }: IChangeUserDeckStatusParams): Promise<IUserDeck>
}
