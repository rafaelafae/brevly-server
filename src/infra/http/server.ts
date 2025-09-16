import { env } from '@/env'
import { fastifyCors } from '@fastify/cors'
import fastify from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { createLinkRoute } from './routes/create-link'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'


const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.validation })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Internal server error' })
})

server.register(fastifyCors, { origin: '*' })

server.register(fastifySwagger,{
  openapi: { 
    info: {
      title: 'Brev.ly API',
      description: 'API para encurtador de URL',
      version: '1.0.0'
    },
  },
})

server.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

// Implementar rotas
server.register(createLinkRoute)

console.log(env.DATABASE_URL)

server.listen({ port: 1919, host: '0.0.0.0' }).then(() => {
  console.log('HTTP Server is running!')
})
