import {
    getCollection,
    insertDocument,
    updateDocument,
    deleteDocument
} from '../database/database.js';
import {
    getRevenuesOptions,
    getRevenueOptions,
    createRevenueOptions,
    updateRevenueOptions,
    deleteRevenueOptions
} from '../schemas/revenues.schemas.js';
import {
    getRevenues,
    getRevenueById,
    createRevenue,
    updateRevenue,
    deleteRevenue
} from '../core/revenues.js';

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
    fastify.get("/revenues", { schema: getRevenuesOptions }, async (request, reply) => {
        const revenues = await getRevenues(fastify);
        reply.code(200).send(revenues);
    });

    fastify.get("/revenues/:id", { schema: getRevenueOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const revenue = await getRevenueById(fastify, id);
        if (!revenue) {
            reply.code(400).send({ error: `Revenue with ID ${id} not found` });
        } else {
            reply.code(200).send(revenue);
        }
    });

    fastify.post("/revenues", { schema: createRevenueOptions }, async (request, reply) => {
        const newRevenue = request.body;
        const insertedRevenue = await createRevenue(fastify, newRevenue);
        reply.code(201).send(insertedRevenue);
    });

    fastify.put("/revenues/:id", { schema: updateRevenueOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const updatedRevenue = await updateRevenue(fastify, id, request.body);
        if (!updatedRevenue) {
            reply.code(400).send({ error: `Revenue with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedRevenue);
        }
    });

    fastify.delete("/revenues/:id", { schema: deleteRevenueOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const deletedRevenue = await deleteRevenue(fastify, id);
        if (!deletedRevenue) {
            reply.code(400).send({ error: `Revenue with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedRevenue);
        }
    });
}

export { revenueRoutes };