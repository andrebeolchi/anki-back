import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetDecksService } from '~/services/factory/make-get-decks-service'

export const schema = {
  summary: 'Get Decks',
  description: 'Get Decks',
  tags: ['decks'],
  querystring: z.object({
    status: z.enum(['public', 'private']).optional(),
    creatorId: z.string().uuid().optional(),
  }),
  response: {
    201: z.object({
      id: z.string().uuid(),
      title: z.string(),
      description: z.string().optional(),
      status: z.enum(['public', 'private']),
      creator: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string().email(),
      }),
      _count: z.object({
        cards: z.number(),
      }),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  },
}

export async function getDecks(req: FastifyRequest, reply: FastifyReply) {
  const params = req.query as z.infer<typeof schema.querystring>

  const getDecksService = makeGetDecksService()

  const deck = await getDecksService.execute({
    ...params,
    userId: req.user?.id,
  })

  return reply.code(200).send(deck)
}
