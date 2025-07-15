import { ICard, IDeck } from '~/models';
import { ICreateDeckData, ICreateDeckResponse, IDeckRepository } from '../deck-repository';

type Item = IDeck & { createdAt: Date; updatedAt: Date; cards: ICard[] }

export class InMemoryDeckRepository implements IDeckRepository {
  public items: Item[] = []

  async create({ cards, ...deck }: ICreateDeckData): Promise<ICreateDeckResponse> {
    const deckId = crypto.randomUUID();

    const createdDeck: Item = {
      id: deckId,
      ...deck,
      cards: cards.map(card => ({
        id: crypto.randomUUID(),
        deckId,
        ...card,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(createdDeck);

    return createdDeck
  }
}
