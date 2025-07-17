import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetStudySessionService } from '~/services/factory/make-get-study-session-service'

export const schema = {
  summary: 'Get Deck for Study',
  description: 'Get Deck Cards for Study',
  tags: ['decks', 'cards'],
  params: z.object({
    deckId: z.string().uuid(),
  }),
  response: {
    200: z.object({
      deck: z.object({
        id: z.string().uuid(),
        title: z.string().min(1),
        description: z.string().nullable(),
        creator: z.object({
          id: z.string().uuid(),
          name: z.string().min(1)
        })
      }),
      cards: z.array(
        z.object({
          id: z.string().uuid(),
          question: z.string().min(1),
          answer: z.string().min(1),
          userCard: z.object({
            id: z.string().uuid(),
            status: z.enum(['new', 'learning', 'review', 'relearning', 'mature']),
            lastReviewed: z.string().datetime().nullable(),
            nextReview: z.string().datetime().nullable()
          }).nullable()
        })
      ),
      stats: z.object({
        totalCards: z.number().int().min(0),
        newCards: z.number().int().min(0),
        reviewCards: z.number().int().min(0)
      })
    })
  },
}

export async function getStudySession(req: FastifyRequest, reply: FastifyReply) {
  const params = req.params as z.infer<typeof schema.params>

  const getStudySessionService = makeGetStudySessionService()

  const deck = await getStudySessionService.execute({
    deckId: params.deckId,
    userId: req.user?.id,
  })

  return reply.code(200).send(deck)
}
