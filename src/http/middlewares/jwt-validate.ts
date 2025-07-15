import { FastifyReply, FastifyRequest } from 'fastify'

export async function validateJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await request.jwtVerify({ ignoreExpiration: true }) as { id: string }

    request.user = user

  } catch {
    reply.status(401).send({ message: 'Unauthorized' })
  }
}