import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateDeckService } from '~/services/factory/make-create-deck-service'

export const schema = {
  summary: 'Create User',
  description: 'Create a new user',
  tags: ['users'],
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    cards: z.array(
      z.object({
        question: z.string().min(1, 'Question is required'),
        answer: z.string().min(1, 'Answer is required'),
      })
    ).min(1, 'At least one card is required'),
  }),
  response: {
    201: z.object({
      id: z.string().uuid(),
      title: z.string(),
      description: z.string().optional(),
      cards: z.array(
        z.object({
          id: z.string().uuid(),
          question: z.string(),
          answer: z.string(),
        })
      ),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  },
}

export async function createDeck(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as z.infer<typeof schema.body>

  const createDeckService = makeCreateDeckService()

  const deck = await createDeckService.execute({
    creatorId: req.user?.id,
    ...body
  })

  return reply.code(201).send(deck)
}
