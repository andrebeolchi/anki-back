import { ICard, IDeck } from '~/models';
import { ICreateDeckData, ICreateDeckResponse, IDeckRepository, IGetDecksResponse } from '../deck-repository';

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

  async getPublicDecks(): Promise<IGetDecksResponse> {
    return this.items
      .filter(deck => deck.status === 'public')
      .map(deck => ({
        ...deck,
        creator: {
          id: deck.creatorId,
          name: '', // Assuming creator name is not stored in this in-memory model
          email: '', // Assuming creator email is not stored in this in-memory model
        },
        _count: {
          cards: deck.cards.length
        },
      }))
  }

  async getPrivateDecks(creatorId: string): Promise<IGetDecksResponse> {
    return this.items
      .filter(deck => deck.status === 'private' && deck.creatorId === creatorId)
      .map(deck => ({
        ...deck,
        creator: {
          id: deck.creatorId,
          name: '', // Assuming creator name is not stored in this in-memory model
          email: '', // Assuming creator email is not stored in this in-memory model
        },
        _count: {
          cards: deck.cards.length
        },
      }))
  }

  async getPublicDecksByCreatorId(creatorId: string): Promise<IGetDecksResponse> {
    return this.items
      .filter(deck => deck.creatorId === creatorId && deck.status === 'public')
      .map(deck => ({
        ...deck,
        creator: {
          id: deck.creatorId,
          name: '', // Assuming creator name is not stored in this in-memory model
          email: '', // Assuming creator email is not stored in this in-memory model
        },
        _count: {
          cards: deck.cards.length
        },
      }))
  }

  async getDecksForUser(userId: string): Promise<IGetDecksResponse> {
    return this.items
      .filter(deck => deck.status === 'public' || (deck.status === 'private' && deck.creatorId === userId))
      .map(deck => ({
        ...deck,
        creator: {
          id: deck.creatorId,
          name: '', // Assuming creator name is not stored in this in-memory model
          email: '', // Assuming creator email is not stored in this in-memory model
        },
        _count: {
          cards: deck.cards.length
        },
      }))
  }
}
