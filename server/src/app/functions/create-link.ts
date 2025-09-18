import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schema'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { InvalidUrlFormatError } from './errors/invalid-url-format-error'
import { LinkAlreadyExistsError } from './errors/link-already-exists-error'

const createLinkInputSchema = z.object({
  originalUrl: z.url(),
  urlCode: z.string().min(3).optional(),
})

type CreateLinkInput = z.input<typeof createLinkInputSchema>
type CreateLinkError = InvalidUrlFormatError | LinkAlreadyExistsError
type CreateLinkSuccess = { shortenedUrl: string }

export async function createLink(
  input: CreateLinkInput,
  dependencies: { baseUrl: string }
): Promise<Either<CreateLinkError, CreateLinkSuccess>> {
  const validation = createLinkInputSchema.safeParse(input)

  if (!validation.success) {
    return makeLeft(new InvalidUrlFormatError())
  }

  const { originalUrl, urlCode: userProvidedCode } = validation.data
  const { baseUrl } = dependencies

  if (userProvidedCode) {
    const existingLink = await db.query.links.findFirst({
      where: eq(schema.links.urlCode, userProvidedCode),
    })
    if (existingLink) {
      return makeLeft(new LinkAlreadyExistsError())
    }
  }

  const urlCode = userProvidedCode || nanoid(7)

  const shortenedUrl = new URL(urlCode, baseUrl).toString()

  await db.insert(schema.links).values({ originalUrl, urlCode, shortenedUrl })

  return makeRight({ shortenedUrl })
}
