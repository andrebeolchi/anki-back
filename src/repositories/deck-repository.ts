import { ICard, IDeck, IUser } from '~/models'

export type ICreateDeckData = Pick<IDeck, 'creatorId' | 'title' | 'description' | 'status'> & {
  cards: Pick<ICard, 'question' | 'answer'>[]
}

export type ICreateDeckResponse = IDeck & { cards: ICard[] }

export type IGetDecksResponse = (IDeck & {
  creator: IUser
  cardsCount: number
  enrolled: boolean
})[]

export type IGetUserDeckData = IDeck & { cards: ICard[]; creator: IUser }

export interface IDeckRepository {
  create(data: ICreateDeckData): Promise<ICreateDeckResponse>

  getPublicDecks(userId: string): Promise<IGetDecksResponse>

  getPublicDecksByCreatorId(userId: string, creatorId: string): Promise<IGetDecksResponse>

  getPrivateDecks(userId: string): Promise<IGetDecksResponse>

  getDecksForUser(userId: string): Promise<IGetDecksResponse>

  getDeckById(deckId: string): Promise<IGetUserDeckData | null>
}
