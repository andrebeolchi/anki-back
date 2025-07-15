import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { validateJwt } from '~/http/middlewares/jwt-validate'

import { createDeck, schema as createDeckSchema } from './create-deck'

export async function deckRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/decks',
    {
      preHandler: [validateJwt],
      schema: createDeckSchema,
    },
    createDeck
  )
}
