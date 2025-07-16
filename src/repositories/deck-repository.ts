import { ICard, IDeck } from "~/models"

export type ICreateDeckData = Pick<IDeck, 'creatorId' | 'title' | 'description' | 'status'> & {
  cards: Pick<ICard, 'question' | 'answer'>[]
}

export type ICreateDeckResponse = IDeck & { cards: ICard[] }

export interface IDeckRepository {
  create(data: ICreateDeckData): Promise<ICreateDeckResponse>
}
