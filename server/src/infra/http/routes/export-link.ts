import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { exportLinksUseCase } from '@/app/functions/export-links'
import { unwrapEither } from '@/infra/shared/either'

export const exportLinksRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links/export',
    {
      schema: {
        summary: 'Export links to a CSV file',
        tags: ['links'],
        querystring: z.object({
          searchQuery: z.string().optional(),
        }),
        response: {
          201: z.object({ exportUrl: z.url() }),
        },
      },
    },
    async (request, reply) => {
      const { searchQuery } = request.query

      const result = await exportLinksUseCase({ searchQuery })

      const { exportUrl } = unwrapEither(result)

      return reply.status(201).send({ exportUrl })
    }
  )
}
