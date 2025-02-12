import {
    getCollection,
    insertDocument,
    updateDocument,
    deleteDocument
} from '../database/mockDatabase.js';

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
    fastify.get("/revenues", async (request, reply) => {
        const revenues = getCollection('revenues');
        reply.code(200).send(revenues);
    });

    fastify.get("/revenues/:id", async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const revenue = getCollection('revenues').find(r => r.id === id);
        if (!revenue) {
            reply.code(400).send({ error: `Revenue with ID ${id} not found` });
        } else {
            reply.code(200).send(revenue);
        }
    });

    fastify.post("/revenues", async (request, reply) => {
        const newRevenue = request.body;
        const insertedRevenue = insertDocument('revenues', newRevenue);
        reply.code(201).send(insertedRevenue);
    });

    fastify.put("/revenues/:id", async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const updatedRevenue = updateDocument('revenues', id, request.body);
        if (!updatedRevenue) {
            reply.code(400).send({ error: `Revenue with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedRevenue);
        }
    });

    fastify.delete("/revenues/:id", async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const deletedRevenue = deleteDocument('revenues', id);
        if (!deletedRevenue) {
            reply.code(400).send({ error: `Revenue with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedRevenue);
        }
    });
}

export { revenueRoutes };