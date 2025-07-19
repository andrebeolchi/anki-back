import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { validateJwt } from '~/http/middlewares/jwt-validate'

import { createUserDeck, schema as createUserDeckSchema } from './create-user-deck'
import { getUserDecks, schema as getUserDecksSchema } from './get-user-decks'
import { changeUserDeck, schema as changeUserDeckSchema } from './change-user-deck'

export async function userDeckRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/user-decks',
    {
      preHandler: [validateJwt],
      schema: createUserDeckSchema,
    },
    createUserDeck
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/user-decks',
    {
      preHandler: [validateJwt],
      schema: getUserDecksSchema,
    },
    getUserDecks
  )

  app.withTypeProvider<ZodTypeProvider>().put(
    '/user-decks',
    {
      preHandler: [validateJwt],
      schema: changeUserDeckSchema,
    },
    changeUserDeck
  )
}
