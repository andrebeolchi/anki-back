import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateUserDeckService } from '~/services/factory/make-create-user-deck-service'

export const schema = {
  summary: 'Create User Deck',
  description: 'Create a new User Deck',
  tags: ['user-decks'],
  body: z.object({
    deckId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
  response: {
    201: z.object({
      deckId: z.string().uuid(),
      userId: z.string().uuid(),
      status: z.string(),
      id: z.string().uuid(),
      createdAt: z.date(),
      updatedAt: z.date(),
      currentStreak: z.number(),
      maxStreak: z.number(),
      lastStudyAt: z.date().nullable(),
    }),
  },
}

export async function createUserDeck(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as z.infer<typeof schema.body>

  const createUserDeckService = makeCreateUserDeckService()

  const userDeck = await createUserDeckService.execute({
    userId: req.user?.id,
    deckId: body.deckId,
  })

  return reply.code(201).send(userDeck)
}
