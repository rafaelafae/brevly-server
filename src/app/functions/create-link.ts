import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schema'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { InvalidUrlFormatError } from './errors/invalid-url-format'
import { LinkAlreadyExistsError } from './errors/link-already-exists'

const createLinkInputSchema = z.object({
  url: z.url(),
})

type CreateLinkInput = z.input<typeof createLinkInputSchema>

type CreateLinkError = InvalidUrlFormatError

type CreateLinkSuccess = { urlCode: string }

export async function createLink(
  input: CreateLinkInput
): Promise<Either<CreateLinkError, CreateLinkSuccess>> {
  const validation = createLinkInputSchema.safeParse(input)

  if (!validation.success) {
    return makeLeft(new InvalidUrlFormatError())
  }

  const { url } = validation.data

  try {
    let urlCode: string
    for (let i = 0; i < 5; i++) {
      urlCode = nanoid(7)
      const existingLink = await db.query.links.findFirst({
        where: eq(schema.links.urlCode, urlCode),
      })

      if (!existingLink) {
        const [newLink] = await db
          .insert(schema.links)
          .values({ originalUrl: url, urlCode: urlCode })
          .returning({ code: schema.links.urlCode })

        return makeRight({ urlCode: newLink.code })
      }
    }

    return makeLeft(new Error('Could not generate a unique code.'))
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === '23505') {
      return makeLeft(new LinkAlreadyExistsError())
    }
    console.error(error)
    return makeLeft(new Error('Internal database error.'))
  }
}
