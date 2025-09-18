import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { listLinks } from '@/app/functions/list-links'
import { unwrapEither } from '@/infra/shared/either'

export const listLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'List, search, and sort links',
        tags: ['links'],
        querystring: z.object({
          searchQuery: z.string().optional(),
          sortBy: z.enum(['createdAt']).optional(),
          shortenedUrl: z.enum(['asc', 'desc']).optional(),
          page: z.coerce.number().optional().default(1),
          pageSize: z.coerce.number().optional().default(20),
        }),
        response: {
          200: z.object({
            links: z.array(
              z.object({
                id: z.string(),
                originalUrl: z.string(),
                shortenedUrl: z.string(),
                urlCode: z.string(),
                accessCount: z.number(),
                createdAt: z.date(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },

    async (request, reply) => {
      const { page, pageSize, searchQuery, sortBy, shortenedUrl } =
        request.query

      const result = await listLinks({
        page,
        pageSize,
        searchQuery,
        sortBy,
        shortenedUrl,
      })

      const { total, links } = unwrapEither(result)

      return reply.status(200).send({ total, links })
    }
  )
}
