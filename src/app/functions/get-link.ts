import { eq, sql } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schema'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { LinkNotFoundError } from './errors/link-not-found'

type GetLinkInput = {
  urlCode: string
}

type GetLinkError = LinkNotFoundError
type GetLinkSuccess = {
  originalUrl: string
}

export async function getLink(
  input: GetLinkInput
): Promise<Either<GetLinkError, GetLinkSuccess>> {
  const { urlCode } = input

  const result = await db.transaction(async tx => {
    const link = await tx.query.links.findFirst({
      where: eq(schema.links.urlCode, urlCode),
    })

    if (!link) {
      return null
    }

    await tx
      .update(schema.links)
      .set({
        accessCount: sql`${schema.links.accessCount} + 1`,
      })
      .where(eq(schema.links.id, link.id))

    return link.originalUrl
  })

  if (result === null) {
    return makeLeft(new LinkNotFoundError())
  }

  return makeRight({ originalUrl: result })
}
