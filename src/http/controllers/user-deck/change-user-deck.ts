import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeChangeUserDeckService } from '~/services/factory/make-change-user-deck'

export const schema = {
  summary: 'Change User Deck',
  description: 'Change a User Deck',
  tags: ['user-decks'],
  body: z.object({
    id: z.string().uuid(),
    status: z.enum(['active', 'archived']),
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

export async function changeUserDeck(req: FastifyRequest, reply: FastifyReply) {
  const changeUserDeckService = makeChangeUserDeckService()
  const body = req.body as z.infer<typeof schema.body>

  const userDeck = await changeUserDeckService.execute({
    ...body,
  })

  return reply.code(201).send(userDeck)
}
