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

export interface IGetByUserIdAndDeckId {
  userId: string
  deckId: string
}

export interface IUpdateStreakBody extends Pick<IUserDeck, | 'currentStreak' | 'maxStreak' | 'lastStudyAt'> {
  userId: string
  deckId: string
}

export interface IUserDeckRepository {
  getUserDecks(userId: string): Promise<IGetUserDecksResponse>
  createUserDeck({ userId, deckId }: ICreateUserDecksParams): Promise<IUserDeck>
  changeUserDeckStatus({ id, status }: IChangeUserDeckStatusParams): Promise<IUserDeck>
  getByUserIdAndDeckId(body: IGetByUserIdAndDeckId): Promise<IUserDeck | null>
  updateStreak(body: IUpdateStreakBody): Promise<IUserDeck>
}
