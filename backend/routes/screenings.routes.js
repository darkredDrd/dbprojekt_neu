import {
    getCollection,
    insertDocument,
    updateDocument,
    deleteDocument
} from '../database/database.js';

import {
    getScreeningsOptions,
    getScreeningOptions,
    createScreeningOptions,
    updateScreeningOptions,
    deleteScreeningOptions
} from '../schemas/screenings.schemas.js';

import {
    createScreening,
    updateScreening,
    deleteScreening
} from '../core/screenings.js';

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
        const screenings = await getCollection('screenings');
        reply.code(200).send(screenings);
    });

    fastify.get("/screenings/:id", { schema: getScreeningOptions }, async (request, reply) => {
        const id = request.params.id;
        const screenings = await getCollection('screenings');
        const screening = screenings.find(s => s._id.toString() === id);
        if (!screening) {
            reply.code(400).send({ error: `Screening with ID ${id} not found` });
        } else {
            reply.code(200).send(screening);
        }
    });

    fastify.post("/screenings", { schema: createScreeningOptions }, async (request, reply) => {
        const newScreening = request.body;
        const insertedScreening = await createScreening(fastify, newScreening);
        reply.code(201).send(insertedScreening);
    });

    fastify.put("/screenings/:id", { schema: updateScreeningOptions }, async (request, reply) => {
        const id = request.params.id;
        const updatedScreening = await updateScreening(fastify, id, request.body);
        if (!updatedScreening) {
            reply.code(400).send({ error: `Screening with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedScreening);
        }
    });

    fastify.delete("/screenings/:id", { schema: deleteScreeningOptions }, async (request, reply) => {
        const id = request.params.id;
        const deletedScreening = await deleteScreening(fastify, id);
        if (!deletedScreening) {
            reply.code(400).send({ error: `Screening with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedScreening);
        }
    });
}

export { screeningRoutes };