import { IUserCard } from "~/models";

export type IUpsertUserCardData = Pick<IUserCard, 'cardId' | 'userId' | 'status' | 'nextReview'>;

export interface IUserCardRepository {
  findByUserAndCard({ userId, cardId }: { userId: string; cardId: string }): Promise<IUserCard | null>;

  upsert(data: IUpsertUserCardData): Promise<IUserCard>;
}
