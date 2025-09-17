import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { deleteLink } from '@/app/functions/delete-link'
import { LinkNotFoundError } from '@/app/functions/errors/link-not-found-error'
import { ValidationError } from '@/app/functions/errors/validation-error'
import { isLeft } from '@/infra/shared/either'

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    '/links',
    {
      schema: {
        summary: 'Delete a link by id, code, or url',
        body: z.object({
          linkId: z.string().optional(),
          urlCode: z.string().optional(),
          shortenedUrl: z.string().url().optional(),
        }),
        response: {
          204: z.void(),
          404: z.object({ message: z.string() }),
          400: z.object({
            message: z.string(),
            issues: z.record(z.string(), z.string()).optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { linkId, urlCode, shortenedUrl } = request.body

      const result = await deleteLink({ linkId, urlCode, shortenedUrl })

      if (isLeft(result)) {
        const error = result.left
        if (error instanceof LinkNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }
        if (error instanceof ValidationError) {
          return reply.status(400).send({
            message: error.message,
            issues: error.issues,
          })
        }
      }

      return reply.status(204).send()
    }
  )
}
