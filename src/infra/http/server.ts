import { fastifyCors } from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '@/env'
import { createLinkRoute } from './routes/create-link'
import { getLinkRoute } from './routes/get-link'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, _request, reply) => {
  if (error.validation) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.validation })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Internal server error' })
})

server.register(fastifyCors, { origin: '*' })

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev.ly API',
      description: 'API para encurtador de URL',
      version: '1.0.0',
    },
  },
})

server.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

// Implementar rotas
server.register(createLinkRoute)
server.register(getLinkRoute)

console.log(env.DATABASE_URL)

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('🚀 HTTP Server is running!')
})
