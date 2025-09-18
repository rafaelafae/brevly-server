import { asc, count, desc, ilike, or } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schema'
import { type Either, makeRight } from '@/infra/shared/either'

const listLinksInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  shortenedUrl: z.enum(['asc', 'desc']).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
})

type ListLinksInput = z.input<typeof listLinksInput>

type ListLinksOutput = {
  links: {
    id: string
    originalUrl: string
    shortenedUrl: string
    urlCode: string
    accessCount: number
    createdAt: Date
  }[]
  total: number
}

export async function listLinks(
  input: ListLinksInput
): Promise<Either<never, ListLinksOutput>> {
  const { searchQuery, page, pageSize, sortBy, shortenedUrl } =
    listLinksInput.parse(input)

  const [links, [{ total }]] = await Promise.all([
    db
      .select({
        id: schema.links.id,
        originalUrl: schema.links.originalUrl,
        shortenedUrl: schema.links.shortenedUrl,
        urlCode: schema.links.urlCode,
        accessCount: schema.links.accessCount,
        createdAt: schema.links.createdAt,
      })
      .from(schema.links)
      .where(
        searchQuery
          ? ilike(schema.links.originalUrl, `%${searchQuery}%`)
          : undefined
      )
      .orderBy(fields => {
        if (sortBy && shortenedUrl === 'asc') {
          return asc(fields[sortBy])
        }
        if (sortBy && shortenedUrl === 'desc') {
          return desc(fields[sortBy])
        }

        return desc(fields.id)
      })
      .offset((page - 1) * pageSize)
      .limit(pageSize),

    db
      .select({ total: count(schema.links.id) })
      .from(schema.links)
      .where(
        searchQuery
          ? ilike(schema.links.originalUrl, `%${searchQuery}%`)
          : undefined
      ),
  ])

  return makeRight({
    links,
    total,
  })
}
