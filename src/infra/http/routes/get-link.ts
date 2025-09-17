import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { LinkNotFoundError } from '@/app/functions/errors/link-not-found-error'
import { getLink } from '@/app/functions/get-link'
import { isLeft } from '@/infra/shared/either'

export const getLinkRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/:urlCode',
    {
      schema: {
        summary: 'Redirect to original URL',
        params: z.object({
          urlCode: z.string().min(3),
        }),
        response: {
          307: z.void(),
          404: z.object({ message: z.string() }),
          500: z
            .object({ message: z.string() })
            .describe('Internal server error.'),
        },
      },
    },
    async (request, reply) => {
      const { urlCode } = request.params

      const result = await getLink({ urlCode })

      if (isLeft(result)) {
        const error = result.left

        if (error instanceof LinkNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }
        return reply.status(500).send({ message: 'Internal server error.' })
      }

      const { originalUrl } = result.right

      return reply.status(307).redirect(originalUrl)
    }
  )
}
