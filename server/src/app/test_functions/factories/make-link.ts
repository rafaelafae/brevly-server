import { faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schema'

type Overrides = Partial<InferInsertModel<typeof schema.links>>

export async function makeLink(overrides?: Overrides) {
  const urlCode = overrides?.urlCode || nanoid(7)

  const linkData = {
    originalUrl: faker.internet.url(),
    urlCode: urlCode,
    shortenedUrl: `http://localhost/${urlCode}`,
    accessCount: faker.number.int({ min: 0, max: 1000 }),
    ...overrides,
  }

  const [newLink] = await db.insert(schema.links).values(linkData).returning()

  return newLink
}
