import { ICard, IDeck, IUser } from "~/models"

export type ICreateDeckData = Pick<IDeck, 'creatorId' | 'title' | 'description' | 'status'> & {
  cards: Pick<ICard, 'question' | 'answer'>[]
}

export type ICreateDeckResponse = IDeck & { cards: ICard[] }

export type IGetDecksResponse = (IDeck & {
  creator: IUser,
  _count: { cards: number }
})[]

export interface IDeckRepository {
  create(data: ICreateDeckData): Promise<ICreateDeckResponse>

  getPublicDecks(): Promise<IGetDecksResponse>

  getPublicDecksByCreatorId(creatorId: string): Promise<IGetDecksResponse>

  getPrivateDecks(userId: string): Promise<IGetDecksResponse>

  getDecksForUser(userId: string): Promise<IGetDecksResponse>
}
