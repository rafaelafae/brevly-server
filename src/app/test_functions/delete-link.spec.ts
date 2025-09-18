import { eq } from 'drizzle-orm'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { deleteLink } from '@/app/functions/delete-link'
import { LinkNotFoundError } from '@/app/functions/errors/link-not-found-error'
import { ValidationError } from '@/app/functions/errors/validation-error'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schema'
import { isLeft, isRight } from '@/infra/shared/either'

describe('delete link use case', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  afterAll(async () => {
    await pg.end()
  })

  it('should be able to delete a link by its ID', async () => {
    const [createdLink] = await db
      .insert(schema.links)
      .values({
        originalUrl: 'https://to-be-deleted.com',
        urlCode: 'delete-me-by-id',
        shortenedUrl: 'http://localhost/delete-me-by-id',
      })
      .returning()

    const result = await deleteLink({ id: createdLink.id })
    expect(isRight(result)).toBe(true)

    const linkInDb = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.id, createdLink.id))

    expect(linkInDb).toHaveLength(0)
  })

  it('should be able to delete a link by its urlCode', async () => {
    const [createdLink] = await db
      .insert(schema.links)
      .values({
        originalUrl: 'https://to-be-deleted.com',
        urlCode: 'delete-me-by-id',
        shortenedUrl: 'http://localhost/delete-me-by-id',
      })
      .returning()

    const result = await deleteLink({ urlCode: createdLink.urlCode })
    expect(isRight(result)).toBe(true)

    const linkInDb = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.id, createdLink.id))

    expect(linkInDb).toHaveLength(0)
  })

  it('should be able to delete a link by its shortenedUrl', async () => {
    const [createdLink] = await db
      .insert(schema.links)
      .values({
        originalUrl: 'https://to-be-deleted.com',
        urlCode: 'delete-me-by-id',
        shortenedUrl: 'http://localhost/delete-me-by-id',
      })
      .returning()

    const result = await deleteLink({ shortenedUrl: createdLink.shortenedUrl })
    expect(isRight(result)).toBe(true)

    const linkInDb = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.id, createdLink.id))

    expect(linkInDb).toHaveLength(0)
  })

  it('should return an error if the link is not found', async () => {
    const result = await deleteLink({ id: 'non-existent-id' })
    expect(isLeft(result)).toBe(true)
    expect(result.left).toBeInstanceOf(LinkNotFoundError)
  })

  it('should return a validation error if no identifier is provided', async () => {
    const result = await deleteLink({})
    expect(isLeft(result)).toBe(true)
    expect(result.left).toBeInstanceOf(ValidationError)
  })
})
