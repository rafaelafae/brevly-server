import { eq } from 'drizzle-orm'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { LinkNotFoundError } from '@/app/functions/errors/link-not-found'
import { getLink } from '@/app/functions/get-link'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schema'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'

describe('get link use case (integration)', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  afterAll(async () => {
    await pg.end()
  })

  it('should be able to get a link and increment its access count', async () => {
    const [createdLink] = await db
      .insert(schema.links)
      .values({
        originalUrl: 'https://www.github.com',
        urlCode: 'github123',
      })
      .returning()

    const result = await getLink({ urlCode: 'github123' })

    expect(isRight(result)).toBe(true)

    const updatedLink = await db.query.links.findFirst({
      where: eq(schema.links.id, createdLink.id),
    })

    expect(updatedLink).toBeDefined()
    expect(updatedLink?.accessCount).toBe(1)
  })

  it('should return an error if the link is not found', async () => {
    const result = await getLink({ urlCode: 'non-existent-code' })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(LinkNotFoundError)
  })
})
