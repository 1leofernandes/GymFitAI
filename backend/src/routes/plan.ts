import type { FastifyInstance } from 'fastify';
import { DietPlanRequestSchema } from '../types';
import { generateDietPlan } from '../agent';

export async function planRoutes(app: FastifyInstance) {

    app.post('/plan', async (request, reply) => {

        reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8');
        reply.raw.setHeader('Access-Control-Allow-Origin', '*');

        reply.raw.setHeader('Cache-Control', 'no-cache');
        reply.raw.setHeader('Connection', 'keep-alive');
        reply.raw.setHeader('Content-Type', 'text/event-stream');

        const parse = DietPlanRequestSchema.safeParse(request.body);
        if (!parse.success) {
            return reply.status(400).send({ 
                error: "Invalid request body", 
                details: parse.error.flatten(issue => issue.message) 
            });
        }



        try {

            for await (const data of generateDietPlan(parse.data)){
                reply.raw.write(data);
            }

            reply.raw.end();
        } catch (err: any) {
            console.error(err);
            reply.raw.write(`event: error\n ${JSON.stringify(err.message)}`)
            reply.raw.end();
        }

        return reply;
    });
}