import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { createUser, schema as createUserSchema } from './create-user'
import { signIn, schema as signInSchema } from './sign-in'

export async function userRoutes(app: FastifyInstance) {
  // Create user
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: createUserSchema,
    },
    createUser
  )

  app.withTypeProvider<ZodTypeProvider>().post(
    '/sign-in',
    {
      schema: signInSchema,
    },
    signIn
  )
}
