import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { createLink } from '@/app/functions/create-link'
import { InvalidUrlFormatError } from '@/app/functions/errors/invalid-url-format'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schema'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'

describe('create link use case (integration)', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  afterAll(async () => {
    await pg.end()
  })

  it('should be able to create a new short link', async () => {
    const result = await createLink({
      url: 'https://www.google.com',
    })

    expect(isRight(result)).toBe(true)

    const savedLink = await db.query.links.findFirst({
      where: (links, { eq }) => eq(links.originalUrl, 'https://www.google.com'),
    })

    expect(savedLink).toBeDefined()
    expect(savedLink?.urlCode).toHaveLength(7)
  })

  it('should return an error if URL format is invalid', async () => {
    const result = await createLink({
      url: 'not-a-valid-url',
    })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(InvalidUrlFormatError)

    const savedLinks = await db.query.links.findMany()
    expect(savedLinks).toHaveLength(0)
  })
})
