import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { validateJwt } from '~/http/middlewares/jwt-validate'

import { createDeck, schema as createDeckSchema } from './create-deck'
import { getDecks, schema as getDecksSchema } from './get-decks'

export async function deckRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/decks',
    {
      preHandler: [validateJwt],
      schema: createDeckSchema,
    },
    createDeck
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/decks',
    {
      preHandler: [validateJwt],
      schema: getDecksSchema
    },
    getDecks
  )
}
