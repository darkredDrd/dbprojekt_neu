import {
    getActorsOptions,
    getActorOptions,
    createActorOptions,
    updateActorOptions,
    deleteActorOptions
} from '../schemas/actors.schemas.js';
import {
    getActors,
    getActorById,
    createActor,
    updateActor,
    deleteActor
} from '../core/actors.js';

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
    fastify.get("/actors", { schema: getActorsOptions }, async (request, reply) => {
        const actors = await getActors(fastify);
        reply.code(200).send(actors);
    });

    fastify.get("/actors/:id", { schema: getActorOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const actor = await getActorById(fastify, id);
        if (!actor) {
            reply.code(400).send({ error: `Actor with ID ${id} not found` });
        } else {
            reply.code(200).send(actor);
        }
    });

    fastify.post("/actors", { schema: createActorOptions }, async (request, reply) => {
        const newActor = request.body;
        const insertedActor = await createActor(fastify, newActor);
        reply.code(201).send(insertedActor);
    });

    fastify.put("/actors/:id", { schema: updateActorOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const updatedActor = await updateActor(fastify, id, request.body);
        if (!updatedActor) {
            reply.code(400).send({ error: `Actor with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedActor);
        }
    });

    fastify.delete("/actors/:id", { schema: deleteActorOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const deletedActor = await deleteActor(fastify, id);
        if (!deletedActor) {
            reply.code(400).send({ error: `Actor with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedActor);
        }
    });
}

export { actorRoutes };