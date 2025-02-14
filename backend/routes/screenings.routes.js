import {
    getCollection,
    insertDocument,
    updateDocument,
    deleteDocument
} from '../database/mockDatabase.js';

import {
    getScreeningsOptions,
    getScreeningOptions,
    createScreeningOptions,
    updateScreeningOptions,
    deleteScreeningOptions
} from '../schemas/screenings.schemas.js';

/**
 * Includes the routes for the '/screenings' API endpoint.
 * 
 * With this route the user can:
 * - GET all screenings
 * - GET a single screening by ID
 * - POST a new screening
 * - PUT (update) a screening by ID
 * - DELETE a screening by ID
 */
async function screeningRoutes(fastify, options) {
    fastify.get("/screenings", { schema: getScreeningsOptions }, async (request, reply) => {
        const screenings = getCollection('screenings');
        reply.code(200).send(screenings);
    });

    fastify.get("/screenings/:id", { schema: getScreeningOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const screening = getCollection('screenings').find(s => s.id === id);
        if (!screening) {
            reply.code(400).send({ error: `Screening with ID ${id} not found` });
        } else {
            reply.code(200).send(screening);
        }
    });

    fastify.post("/screenings", { schema: createScreeningOptions }, async (request, reply) => {
        const newScreening = request.body;
        const insertedScreening = insertDocument('screenings', newScreening);
        reply.code(201).send(insertedScreening);
    });

    fastify.put("/screenings/:id", { schema: updateScreeningOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const updatedScreening = updateDocument('screenings', id, request.body);
        if (!updatedScreening) {
            reply.code(400).send({ error: `Screening with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedScreening);
        }
    });

    fastify.delete("/screenings/:id", { schema: deleteScreeningOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const deletedScreening = deleteDocument('screenings', id);
        if (!deletedScreening) {
            reply.code(400).send({ error: `Screening with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedScreening);
        }
    });
}

export { screeningRoutes };