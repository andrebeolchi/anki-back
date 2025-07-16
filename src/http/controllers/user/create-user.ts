import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { omit } from 'ramda'
import { z } from 'zod'
import { makeCreateUserService } from '~/services/factory/make-create-user-service'

export const schema = {
  summary: 'Create User',
  description: 'Create a new user',
  tags: ['users'],
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  }),
  response: {
    201: z.object({
      id: z.string(),
      token: z.string(),
      name: z.string(),
      email: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  },
}

export async function createUser(req: FastifyRequest, reply: FastifyReply) {
  const { password, ...body } = req.body as z.infer<typeof schema.body>

  const hashedPassword = await hash(password, 8)

  const createUserService = makeCreateUserService()

  const user = await createUserService.execute({
    ...body,
    password: hashedPassword,
  })

  const token = await reply.jwtSign(omit(['password'], user))

  return reply.status(201).send({ token, ...omit(['password'], user) })
}
