import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { validateJwt } from '~/http/middlewares/jwt-validate'
import { getStudySession, schema as getStudySessionSchema } from './get-study-session'

export async function studyRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/study/:deckId',
    {
      preHandler: [validateJwt],
      schema: getStudySessionSchema
    },
    getStudySession
  )
}
