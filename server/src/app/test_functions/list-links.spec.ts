import dayjs from 'dayjs'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { listLinks } from '@/app/functions/list-links'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schema'
import { isRight } from '@/infra/shared/either'
import { makeLink } from './factories/make-link'

describe('list links use case', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  afterAll(async () => {
    await pg.end()
  })

  it('should be able to search for links', async () => {
    const searchTerm = 'special-term'
    await makeLink({ originalUrl: `https://test.com/${searchTerm}-1` })
    await makeLink({ originalUrl: `https://test.com/${searchTerm}-2` })
    await makeLink({ originalUrl: 'https://another-url.com' })

    const result = await listLinks({ searchQuery: searchTerm })

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      expect(result.right.total).toBe(2)
      expect(result.right.links).toHaveLength(2)
    }
  })

  it('should be able to fetch paginated links', async () => {
    for (let i = 0; i < 22; i++) {
      await makeLink()
    }

    const result = await listLinks({ page: 3, pageSize: 10 })

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      expect(result.right.total).toBe(22)
      expect(result.right.links).toHaveLength(2)
    }
  })

  it('should be able to fetch links sorted by createdAt', async () => {
    const link1 = await makeLink({
      createdAt: dayjs().subtract(2, 'days').toDate(),
    })
    const link2 = await makeLink({
      createdAt: dayjs().subtract(1, 'day').toDate(),
    })
    const link3 = await makeLink({ createdAt: new Date() })

    const result = await listLinks({
      sortBy: 'createdAt',
      shortenedUrl: 'asc',
    })

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      expect(result.right.links.map(link => link.id)).toEqual([
        link1.id,
        link2.id,
        link3.id,
      ])
    }
  })
})
