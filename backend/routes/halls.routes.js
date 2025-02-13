import {
    getCollection,
    insertDocument,
    updateDocument,
    deleteDocument
} from '../database/mockDatabase.js';
import {
    getHallsOptions,
    getHallOptions,
    createHallOptions,
    updateHallOptions,
    deleteHallOptions
} from '../schemas/halls.schemas.js';

/**
 * Includes the routes for the '/halls' API endpoint.
 * 
 * With this route the user can:
 * - GET all halls
 * - GET a single hall by ID
 * - POST a new hall
 * - PUT (update) a hall by ID
 * - DELETE a hall by ID
 */
async function hallRoutes(fastify, options) {
    fastify.get("/halls", getHallsOptions, async (request, reply) => {
        const halls = getCollection('halls');
        reply.code(200).send(halls);
    });

    fastify.get("/halls/:id", getHallOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const hall = getCollection('halls').find(h => h.id === id);
        if (!hall) {
            reply.code(400).send({ error: `Hall with ID ${id} not found` });
        } else {
            reply.code(200).send(hall);
        }
    });

    fastify.post("/halls", createHallOptions, async (request, reply) => {
        const newHall = request.body;
        const insertedHall = insertDocument('halls', newHall);
        reply.code(201).send(insertedHall);
    });

    fastify.put("/halls/:id", updateHallOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const updatedHall = updateDocument('halls', id, request.body);
        if (!updatedHall) {
            reply.code(400).send({ error: `Hall with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedHall);
        }
    });

    fastify.delete("/halls/:id", deleteHallOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const deletedHall = deleteDocument('halls', id);
        if (!deletedHall) {
            reply.code(400).send({ error: `Hall with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedHall);
        }
    });
}

export { hallRoutes };