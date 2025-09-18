import { randomUUID } from 'node:crypto'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportLinksUseCase } from '@/app/functions/export-links'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schema'
import { isRight, unwrapEither } from '@/infra/shared/either'
import * as storage from '@/infra/storage/upload-link-to-storage'
import { makeLink } from './factories/make-link'

describe('export links use case', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  afterAll(async () => {
    await pg.end()
  })

  it('should be able to export links to a CSV file', async () => {
    const uploadStub = vi
      .spyOn(storage, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `downloads/${randomUUID()}.csv`,
          url: 'https://fake-storage.com/links-export.csv',
        }
      })

    const link1 = await makeLink({ urlCode: 'link-1' })
    const link2 = await makeLink({ urlCode: 'link-2' })
    const link3 = await makeLink({ urlCode: 'link-3' })

    const result = await exportLinksUseCase({})

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []
      generatedCSVStream.on('data', chunk => chunks.push(chunk))
      generatedCSVStream.on('end', () =>
        resolve(Buffer.concat(chunks).toString('utf-8'))
      )
      generatedCSVStream.on('error', err => reject(err))
    })

    expect(isRight(result)).toBe(true)
    expect(unwrapEither(result)).toEqual({
      exportUrl: 'https://fake-storage.com/links-export.csv',
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(row => row.split(','))

    expect(csvAsArray).toEqual([
      [
        'ID',
        'Original URL',
        'Shortened URL',
        'Code',
        'Access Count',
        'Created At',
      ],
      [
        link1.id, // DE: `${link1.id}`
        link1.originalUrl,
        link1.shortenedUrl,
        link1.urlCode,
        `${link1.accessCount}`,
        expect.any(String),
      ],
      [
        link2.id,
        link2.originalUrl,
        link2.shortenedUrl,
        link2.urlCode,
        `${link2.accessCount}`,
        expect.any(String),
      ],
      [
        link3.id,
        link3.originalUrl,
        link3.shortenedUrl,
        link3.urlCode,
        `${link3.accessCount}`,
        expect.any(String),
      ],
    ])
  })
})
