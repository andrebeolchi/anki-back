import { ICard, IUserCard } from "~/models";

export interface ICardWithUserProgress extends ICard {
  userCards: IUserCard[]
};

export interface ICardRepository {
  findByDeckWithUserProgress({ deckId, userId }: { deckId: string; userId: string }): Promise<ICardWithUserProgress[]>;
}
