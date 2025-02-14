import {
    getRevenues,
    getRevenueById,
    createRevenue,
    updateRevenue,
    deleteRevenue
} from '../core/revenues.js';
import {
    getRevenuesOptions,
    getRevenueOptions,
    createRevenueOptions,
    updateRevenueOptions,
    deleteRevenueOptions
} from '../schemas/revenues.schemas.js';

/**
 * Includes the routes for the '/revenues' API endpoint.
 * 
 * With this route the user can:
 * - GET all revenues
 * - GET a single revenue by ID
 * - POST a new revenue
 * - PUT (update) a revenue by ID
 * - DELETE a revenue by ID
 */
async function revenueRoutes(fastify, options) {
    fastify.get("/revenues", getRevenuesOptions, async (request, reply) => {
        const revenues = getRevenues(fastify);
        reply.code(200).send(revenues);
    });

    fastify.get("/revenues/:id", getRevenueOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const revenue = getRevenueById(fastify, id);
        if (!revenue) {
            reply.code(400).send({ error: `Revenue with ID ${id} not found` });
        } else {
            reply.code(200).send(revenue);
        }
    });

    fastify.post("/revenues", createRevenueOptions, async (request, reply) => {
        const newRevenue = request.body;
        const insertedRevenue = createRevenue(fastify, newRevenue);
        reply.code(201).send(insertedRevenue);
    });

    fastify.put("/revenues/:id", updateRevenueOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const updatedRevenue = updateRevenue(fastify, id, request.body);
        if (!updatedRevenue) {
            reply.code(400).send({ error: `Revenue with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedRevenue);
        }
    });

    fastify.delete("/revenues/:id", deleteRevenueOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const deletedRevenue = deleteRevenue(fastify, id);
        if (!deletedRevenue) {
            reply.code(400).send({ error: `Revenue with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedRevenue);
        }
    });
}

export { revenueRoutes };