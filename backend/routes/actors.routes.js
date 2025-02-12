import {
    getCollection,
    insertDocument,
    updateDocument,
    deleteDocument
} from '../database/mockDatabase.js';

/**
 * Includes the routes for the '/actors' API endpoint.
 * 
 * With this route the user can:
 * - GET all actors
 * - GET a single actor by ID
 * - POST a new actor
 * - PUT (update) an actor by ID
 * - DELETE an actor by ID
 */
async function actorRoutes(fastify, options) {
    fastify.get("/actors", async (request, reply) => {
        const actors = getCollection('actors');
        reply.code(200).send(actors);
    });

    fastify.get("/actors/:id", async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const actor = getCollection('actors').find(a => a.id === id);
        if (!actor) {
            reply.code(400).send({ error: `Actor with ID ${id} not found` });
        } else {
            reply.code(200).send(actor);
        }
    });

    fastify.post("/actors", async (request, reply) => {
        const newActor = request.body;
        const insertedActor = insertDocument('actors', newActor);
        reply.code(201).send(insertedActor);
    });

    fastify.put("/actors/:id", async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const updatedActor = updateDocument('actors', id, request.body);
        if (!updatedActor) {
            reply.code(400).send({ error: `Actor with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedActor);
        }
    });

    fastify.delete("/actors/:id", async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const deletedActor = deleteDocument('actors', id);
        if (!deletedActor) {
            reply.code(400).send({ error: `Actor with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedActor);
        }
    });
}

export { actorRoutes };