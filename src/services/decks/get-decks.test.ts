import { InMemoryDeckRepository } from '~/repositories/in-memory/in-memory-deck-repository'
import { GetDecksService } from './get-decks'

describe('Get Decks Service', () => {
  let inMemoryDeckRepository: InMemoryDeckRepository
  let getDecksService: GetDecksService

  beforeEach(() => {
    inMemoryDeckRepository = new InMemoryDeckRepository()
    getDecksService = new GetDecksService(inMemoryDeckRepository)

    // Mock data
    inMemoryDeckRepository.items.push(
      {
        id: '1',
        title: 'Public Deck A',
        description: 'Public Deck by creator 1',
        creatorId: 'creator-1',
        status: "public",
        cards: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Private Deck A',
        description: 'Private Deck by user 1',
        creatorId: 'user-1',
        status: "private",
        cards: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        title: 'Public Deck B',
        description: 'Public Deck by creator 2',
        creatorId: 'creator-2',
        status: "public",
        cards: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    )
  })

  it('should return public decks by creatorId', async () => {
    const result = await getDecksService.execute({
      creatorId: 'creator-1',
      userId: 'user-1',
    })

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      title: 'Public Deck A',
      creatorId: 'creator-1',
      status: "public",
    })
  })

  it('should return all public decks', async () => {
    const result = await getDecksService.execute({
      status: 'public',
      userId: 'user-1',
    })

    expect(result).toHaveLength(2)
    expect(result.every(deck => deck.status === 'public')).toBe(true)
  })

  it('should return only private decks for the user', async () => {
    const result = await getDecksService.execute({
      status: 'private',
      userId: 'user-1',
    })

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      creatorId: 'user-1',
      status: "private"
    })
  })

  it('should return all decks (public + private) for the user', async () => {
    const result = await getDecksService.execute({
      userId: 'user-1',
    })

    // Esperado: 1 privado (do próprio usuário) + 2 públicos (mesmo que não sejam dele)
    expect(result).toHaveLength(3)
  })
})
