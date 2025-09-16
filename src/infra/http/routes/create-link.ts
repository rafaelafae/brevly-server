import { db } from "@/infra/db";
import { schema } from "@/infra/db/schema";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { nanoid } from "nanoid";
import { z } from "zod";

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
    server.post('/links', {
        schema: {
            summary: 'Create a link',
            body: z.object({
                url: z.url(),
            }),
            response: {
                201: z.object({ urlId: z.string() }),
                409: z.object({ message: z.string() }).describe('Url already exists'),
            },
        },
    }, async (request, reply) => {
        const { url } = request.body;
        const urlCode = nanoid(7);

        await db.insert(schema.links).values({
            originalUrl: url,
            urlCode: urlCode,
        })
        return reply.status(201).send({ urlId: 'test' })
    })
}