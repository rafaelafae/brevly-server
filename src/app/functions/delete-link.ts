import { eq, or } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schema'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { LinkNotFoundError } from './errors/link-not-found-error'
import { ValidationError } from './errors/validation-error'

const deleteLinkInputSchema = z
  .object({
    id: z.string().optional(),
    urlCode: z.string().optional(),
    shortenedUrl: z.url().optional(),
  })
  .refine(data => Object.values(data).some(val => val !== undefined), {
    message:
      'At least one identifier (id, urlCode, or shortenedUrl) must be provided.',
  })

type DeleteLinkInput = z.input<typeof deleteLinkInputSchema>

type DeleteLinkError = LinkNotFoundError | ValidationError
type DeleteLinkSuccess = Record<string, never>

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<DeleteLinkError, DeleteLinkSuccess>> {
  const validation = deleteLinkInputSchema.safeParse(input)

  if (!validation.success) {
    const flattenedError = validation.error.flatten()
    const issues: Record<string, string> = {}

    for (const key in flattenedError.fieldErrors) {
      const fieldKey = key as keyof typeof flattenedError.fieldErrors
      if (flattenedError.fieldErrors[fieldKey]) {
        issues[fieldKey] = flattenedError.fieldErrors[fieldKey]![0]
      }
    }

    if (flattenedError.formErrors.length > 0) {
      issues._form = flattenedError.formErrors[0]
    }

    return makeLeft(new ValidationError(issues))
  }

  const { id, urlCode, shortenedUrl } = validation.data
  let codeToUse = urlCode

  if (shortenedUrl) {
    const urlObject = new URL(shortenedUrl)
    codeToUse = urlObject.pathname.substring(1)
  }

  const result = await db
    .delete(schema.links)
    .where(
      or(
        id ? eq(schema.links.id, id) : undefined,
        codeToUse ? eq(schema.links.urlCode, codeToUse) : undefined
      )
    )

  if (result.count === 0) {
    return makeLeft(new LinkNotFoundError())
  }

  return makeRight({})
}
