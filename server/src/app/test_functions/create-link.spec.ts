import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { createLink } from '@/app/functions/create-link'
import { LinkAlreadyExistsError } from '@/app/functions/errors/link-already-exists-error'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schema'
import { isLeft, isRight } from '@/infra/shared/either'
import { InvalidUrlFormatError } from '../functions/errors/invalid-url-format-error'

type CreateLinkInput = Parameters<typeof createLink>[0]

function createLinkInTest(input: CreateLinkInput) {
  const dependencies = {
    baseUrl: 'http://test.com',
  }

  return createLink(input, dependencies)
}

describe('create link use case', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  afterAll(async () => {
    await pg.end()
  })

  it('should be able to create a new short link with a random code', async () => {
    const result = await createLinkInTest({
      originalUrl: 'https://www.google.com',
    })

    expect(isRight(result)).toBe(true)
  })

  it('should be able to create a new short link with a custom code', async () => {
    const result = await createLinkInTest({
      originalUrl: 'https://www.github.com',
      urlCode: 'my-github',
    })

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      expect(result.right.shortenedUrl).toBe('http://test.com/my-github')
    }
  })

  it('should return a validation error if URL format is invalid', async () => {
    const result = await createLinkInTest({
      originalUrl: 'not-a-valid-url',
    })

    expect(isLeft(result)).toBe(true)
    expect(result.left).toBeInstanceOf(InvalidUrlFormatError)
  })

  it('should return an error if custom code already exists', async () => {
    await createLinkInTest({
      originalUrl: 'https://some-url.com',
      urlCode: 'existing-code',
    })

    const result = await createLinkInTest({
      originalUrl: 'https://another-url.com',
      urlCode: 'existing-code',
    })

    expect(isLeft(result)).toBe(true)
    const error = result.left
    expect(error).toBeInstanceOf(LinkAlreadyExistsError)
  })
})
