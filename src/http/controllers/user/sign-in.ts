import { compare } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { omit } from 'ramda'
import { z } from 'zod'
import { InvalidCredentialsError } from '~/services/_errors'
import { makeSignInService } from '~/services/factory/make-sign-in-service'

export const schema = {
  summary: 'Sign In',
  description: 'Sign in a user',
  tags: ['users'],
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  response: {
    200: z.object({
      id: z.string(),
      token: z.string(),
      name: z.string(),
      email: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  },
}

export async function signIn(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = req.body as z.infer<typeof schema.body>

  const signInService = makeSignInService()

  const user = await signInService.execute(email)

  const isValidPassword = compare(password, `${user.password}`)

  if (!isValidPassword) {
    throw new InvalidCredentialsError()
  }

  const token = await reply.jwtSign(omit(['password'], user))

  return reply.status(200).send({ token, ...omit(['password'], user) })
}
