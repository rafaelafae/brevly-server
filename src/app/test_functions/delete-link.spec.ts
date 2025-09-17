import { eq } from 'drizzle-orm'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { deleteLink } from '@/app/functions/delete-link'
import { LinkNotFoundError } from '@/app/functions/errors/link-not-found-error'
import { ValidationError } from '@/app/functions/errors/validation-error'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schema'
import { isLeft, isRight } from '@/infra/shared/either'

describe('delete link use case', () => {
  let createdLink: { id: string; urlCode: string; shortenedUrl: string }

  beforeEach(async () => {
    await db.delete(schema.links)
    ;[createdLink] = await db
      .insert(schema.links)
      .values({
        originalUrl: 'https://to-be-deleted.com',
        urlCode: 'delete-me',
        shortenedUrl: 'http://localhost/delete-me',
      })
      .returning()
  })

  afterAll(async () => {
    await pg.end()
  })

  it('should be able to delete a link by its ID', async () => {
    const result = await deleteLink({ linkId: createdLink.id })
    expect(isRight(result)).toBe(true)

    const linkInDb = await db.query.links.findFirst({
      where: eq(schema.links.id, createdLink.id),
    })
    expect(linkInDb).toBeUndefined()
  })

  it('should be able to delete a link by its urlCode', async () => {
    const result = await deleteLink({ urlCode: createdLink.urlCode })
    expect(isRight(result)).toBe(true)

    const linkInDb = await db.query.links.findFirst({
      where: eq(schema.links.id, createdLink.id),
    })
    expect(linkInDb).toBeUndefined()
  })

  it('should be able to delete a link by its shortenedUrl', async () => {
    const result = await deleteLink({ shortenedUrl: createdLink.shortenedUrl })
    expect(isRight(result)).toBe(true)

    const linkInDb = await db.query.links.findFirst({
      where: eq(schema.links.id, createdLink.id),
    })
    expect(linkInDb).toBeUndefined()
  })

  it('should return an error if the link is not found', async () => {
    const result = await deleteLink({ linkId: 'non-existent-id' })
    expect(isLeft(result)).toBe(true)
    expect(result.left).toBeInstanceOf(LinkNotFoundError)
  })

  it('should return a validation error if no identifier is provided', async () => {
    const result = await deleteLink({})
    expect(isLeft(result)).toBe(true)
    expect(result.left).toBeInstanceOf(ValidationError)
  })
})
