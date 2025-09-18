import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createLink } from '@/app/functions/create-link'
import { InvalidUrlFormatError } from '@/app/functions/errors/invalid-url-format-error'
import { LinkAlreadyExistsError } from '@/app/functions/errors/link-already-exists-error'
import { env } from '@/env'
import { isLeft } from '@/infra/shared/either'

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create a link',
        body: z.object({
          url: z.url(),
          urlCode: z
            .string()
            .min(3)
            .regex(/^[a-zA-Z0-9_-]+$/)
            .optional(),
        }),
        response: {
          201: z.object({ shortenedUrl: z.url() }),
          400: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { url, urlCode } = request.body

      const result = await createLink(
        { originalUrl: url, urlCode },
        { baseUrl: env.BASE_URL }
      )

      if (isLeft(result)) {
        const error = result.left

        switch (error.constructor) {
          case InvalidUrlFormatError:
            return reply.status(400).send({ message: error.message })
          case LinkAlreadyExistsError:
            return reply.status(409).send({ message: error.message })
        }
      } else {
        const { shortenedUrl } = result.right
        return reply.status(201).send({ shortenedUrl })
      }
    }
  )
}
