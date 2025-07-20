import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSaveSessionService } from '~/services/factory/make-save-session-service'

export const schema = {
  summary: 'Get Deck for Study',
  description: 'Get Deck Cards for Study',
  tags: ['decks', 'cards'],
  params: z.object({
    deckId: z.string().uuid(),
  }),
  body: z.object({
    answers: z.array(
      z.object({
        cardId: z.string().uuid(),
        isCorrect: z.boolean(),
      })
    ),
  }),
  response: {
    200: z.object({})
  },
}

export async function submitSession(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as z.infer<typeof schema.body>
  const params = req.params as z.infer<typeof schema.params>

  const saveSessionService = makeSaveSessionService()

  const deck = await saveSessionService.execute({
    ...body,
    deckId: params.deckId,
    userId: req.user?.id,
  })

  return reply.code(200).send(deck)
}
