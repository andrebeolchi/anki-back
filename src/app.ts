import packageJson from '../package.json'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'

import { userRoutes } from '~/http/controllers/user/routes'
import { statusRoutes } from '~/http/controllers/status/routes'

import { globalErrorHandler } from '~/services/_errors'
import fastifyJwt from '@fastify/jwt'

import { env } from '~/env'
import { deckRoutes } from './http/controllers/deck/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: `${env?.JWT_SECRET}`,
  sign: { expiresIn: '10m' },
})

// Register Swagger plugin to generate API documentation
app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: packageJson.name,
      description: packageJson.description,
      version: packageJson.version,
    },
  },
  transform: jsonSchemaTransform,
})

// Register Swagger UI plugin to serve API documentation
app.register(fastifySwaggerUi, {
  routePrefix: '/',
})

// Register Zod Type Provider to validate and serialize payloads
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.withTypeProvider<ZodTypeProvider>()

app.register(userRoutes)
app.register(deckRoutes)
app.register(statusRoutes)

// Set Error Handler
app.setErrorHandler(globalErrorHandler)
