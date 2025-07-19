import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetUserDecksService } from '~/services/factory/make-get-user-decks-service'

export const schema = {
  summary: 'Get User Decks',
  description: 'Get User Decks',
  tags: ['user-decks'],
  response: {
    201: z.object({
      id: z.string().uuid(),
      deckId: z.string().uuid(),
      userId: z.string().uuid(),
      cardsCount: z.number(),
      title: z.string(),
      description: z.string().optional(),
      status: z.enum(['public', 'private']),
      creator: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string().email(),
      }),
      enrollment: z.object({
        id: z.string().uuid(),
        deckId: z.string().uuid(),
        userId: z.string().uuid(),
        cardsCount: z.number(),
        title: z.string(),
        description: z.string().optional(),
        status: z.enum(['public', 'private']),
        creator: z.object({
          id: z.string().uuid(),
          name: z.string(),
          email: z.string().email(),
        }),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
      cards: z.array(
        z.object({
          id: z.string().uuid(),
          question: z.string(),
          answer: z.string(),
        })
      ),
    }),
  },
}

export async function getUserDecks(req: FastifyRequest, reply: FastifyReply) {
  const getUserDecksService = makeGetUserDecksService()

  const userDecks = await getUserDecksService.execute({
    userId: req.user?.id,
  })

  return reply.code(200).send(userDecks)
}
