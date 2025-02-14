import {
    getCollection,
    insertDocument,
    updateDocument,
    deleteDocument
} from '../database/database.js';
import {
    getActorsOptions,
    getActorOptions,
    createActorOptions,
    updateActorOptions,
    deleteActorOptions
} from '../schemas/actors.schemas.js';

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
    fastify.get("/actors", getActorsOptions, async (request, reply) => {
        const actors = await getCollection('actors');
        reply.code(200).send(actors);
    });

    fastify.get("/actors/:id", getActorOptions, async (request, reply) => {
        const id = request.params.id;
        const actors = await getCollection('actors');
        const actor = actors.find(a => a._id.toString() === id);
        if (!actor) {
            reply.code(400).send({ error: `Actor with ID ${id} not found` });
        } else {
            reply.code(200).send(actor);
        }
    });

    fastify.post("/actors", createActorOptions, async (request, reply) => {
        const newActor = request.body;
        const insertedActor = await insertDocument('actors', newActor);
        reply.code(201).send(insertedActor);
    });

    fastify.put("/actors/:id", updateActorOptions, async (request, reply) => {
        const id = request.params.id;
        const updatedActor = await updateDocument('actors', id, request.body);
        if (!updatedActor) {
            reply.code(400).send({ error: `Actor with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedActor);
        }
    });

    fastify.delete("/actors/:id", deleteActorOptions, async (request, reply) => {
        const id = request.params.id;
        const deletedActor = await deleteDocument('actors', id);
        if (!deletedActor) {
            reply.code(400).send({ error: `Actor with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedActor);
        }
    });
}

export { actorRoutes };