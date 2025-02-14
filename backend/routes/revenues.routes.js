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
        const revenues = await getCollection('revenues');
        reply.code(200).send(revenues);
    });

    fastify.get("/revenues/:id", getRevenueOptions, async (request, reply) => {
        const id = request.params.id;
        const revenues = await getCollection('revenues');
        const revenue = revenues.find(r => r._id.toString() === id);
        if (!revenue) {
            reply.code(400).send({ error: `Revenue with ID ${id} not found` });
        } else {
            reply.code(200).send(revenue);
        }
    });

    fastify.post("/revenues", createRevenueOptions, async (request, reply) => {
        const newRevenue = request.body;
        const insertedRevenue = await insertDocument('revenues', newRevenue);
        reply.code(201).send(insertedRevenue);
    });

    fastify.put("/revenues/:id", updateRevenueOptions, async (request, reply) => {
        const id = request.params.id;
        const updatedRevenue = await updateDocument('revenues', id, request.body);
        if (!updatedRevenue) {
            reply.code(400).send({ error: `Revenue with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedRevenue);
        }
    });

    fastify.delete("/revenues/:id", deleteRevenueOptions, async (request, reply) => {
        const id = request.params.id;
        const deletedRevenue = await deleteDocument('revenues', id);
        if (!deletedRevenue) {
            reply.code(400).send({ error: `Revenue with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedRevenue);
        }
    });
}

export { revenueRoutes };