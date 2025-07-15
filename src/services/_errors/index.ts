import { FastifyReply, FastifyRequest } from 'fastify'
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from 'fastify-type-provider-zod'
import { env } from '~/env'

export class ResourceNotFoundError extends Error {
  constructor() {
    super('Resource not found')
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Username or password is incorrect')
  }
}

export class ResourceAlreadyExistsError extends Error {
  constructor() {
    super('Resource already exists')
  }
}

interface ErrorHandlerMap {
  [key: string]: (error: Error, request: FastifyRequest, reply: FastifyReply) => void
}

export const errorHandlerMap: ErrorHandlerMap = {
  ResourceNotFoundError: (error, __, reply) =>
    reply.status(404).send({
      message: error.message,
    }),

  InvalidCredentialsError: (error, __, reply) =>
    reply.status(401).send({
      message: error.message,
    }),
  ResourceAlreadyExistsError: (error, __, reply) =>
    reply.status(409).send({
      message: error.message,
    }),
}

export const globalErrorHandler = (error: Error, req: FastifyRequest, reply: FastifyReply) => {
  if (env?.NODE_ENV === 'development') {
    console.error(error)
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      error: 'Response Validation Error',
      message: "Request doesn't match the schema",
      statusCode: 400,
      ...(env?.NODE_ENV === 'development' && {
        details: {
          issues: error.validation,
          method: req.method,
          url: req.url,
        },
      }),
    })
  }

  if (isResponseSerializationError(error)) {
    return reply.code(500).send({
      error: 'Internal Server Error',
      message: "Response doesn't match the schema",
      statusCode: 500,
      ...(env?.NODE_ENV === 'development' && {
        details: {
          issues: error.cause.issues,
          method: error.method,
          url: error.url,
        },
      }),
    })
  }

  const handler = errorHandlerMap[error.constructor.name]

  if (handler) return handler(error, req, reply)

  return reply.status(500).send({
    message: 'Internal server error',
  })
}
