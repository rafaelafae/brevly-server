import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createLink } from '@/app/functions/create-link'
import { LinkAlreadyExistsError } from '@/app/functions/errors/link-already-exists'
import { isLeft } from '@/infra/shared/either'

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create a link',
        body: z.object({
          url: z.url(),
        }),
        response: {
          201: z.object({ shortUrl: z.string() }),
          409: z.object({ message: z.string() }).describe('Url already exists'),
          400: z
            .object({ message: z.string() })
            .describe('Could not create link after multiple attempts'),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error.'),
        },
      },
    },
    async (request, reply) => {
      const { url } = request.body

      const result = await createLink({ url })

      if (isLeft(result)) {
        const error = result.left
        if (error instanceof LinkAlreadyExistsError) {
          return reply.status(409).send({ message: error.message })
        }
        return reply.status(400).send({ message: error.message })
      }

      const { urlCode } = result.right
      const shortUrl = new URL(`/${urlCode}`, 'http://localhost:1919')

      return reply.status(201).send({ shortUrl: shortUrl.toString() })
    }
  )
}
