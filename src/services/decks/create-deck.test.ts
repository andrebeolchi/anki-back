import { InMemoryDeckRepository } from "~/repositories/in-memory/in-memory-deck-repository";
import { CreateDeckService } from "./create-deck";

describe('Create Deck Service', () => {
  it('should create a deck with all data', async () => {
    const inMemoryDeckRepository = new InMemoryDeckRepository()
    const createDeckService = new CreateDeckService(inMemoryDeckRepository)

    const deck = await createDeckService.execute({
      title: 'Deck 1',
      description: 'Description of Deck 1',
      creatorId: 'e5d200dc-328d-5612-a843-d8333f505a6c',
      cards: [
        { question: 'What is the capital of France?', answer: 'Paris' },
        { question: 'What is 2 + 2?', answer: '4' },
      ],
    })

    expect(deck).toEqual(
      expect.objectContaining({
        title: 'Deck 1',
        description: 'Description of Deck 1',
        creatorId: 'e5d200dc-328d-5612-a843-d8333f505a6c',
        cards: expect.arrayContaining([
          expect.objectContaining({ question: 'What is the capital of France?', answer: 'Paris' }),
          expect.objectContaining({ question: 'What is 2 + 2?', answer: '4' }),
        ]),
      })
    )

    expect(inMemoryDeckRepository.items).toHaveLength(1)
    expect(inMemoryDeckRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Deck 1',
          description: 'Description of Deck 1',
          creatorId: 'e5d200dc-328d-5612-a843-d8333f505a6c',
        }),
      ])
    )
  })
});
