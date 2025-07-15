import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export const schema = {
  summary: 'Status',
  description: 'Check if the server is running',
  tags: ['status'],
  response: {
    200: z.object({
      status: z.enum(['ok']),
    }),
  },
}

export async function statusRoutes(app: FastifyInstance) {
  app.withTypeProvider().get('/status', { schema }, async (_req, reply) => {
    return reply.send({ status: 'ok' })
  })
}
