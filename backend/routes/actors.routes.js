import {
    getActors,
    getActorById,
    createActor,
    updateActor,
    deleteActor
} from '../core/actors.js';
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
        const actors = getActors(fastify);

        if (!actors) {
            reply.code(500);
            return { error: "Could not get actors" };
        }

        reply.code(200);
        return actors;
    });

    fastify.get("/actors/:id", getActorOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const actor = getActorById(fastify, id);
        if (!actor) {
            reply.code(400);
            return { error: `Actor with ID ${id} not found` };
        }

        reply.code(200);
        return { actor: actor };
    });

    fastify.post("/actors", createActorOptions, async (request, reply) => {
        const actorProps = request.body;

        try {
            const actor = await createActor(fastify, actorProps);

            if (!actor) {
                reply.code(500);
                return { error: "Could not create actor" };
            }

            reply.code(201);
            return { actor: actor };
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.put("/actors/:id", updateActorOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const actorProps = request.body;

        try {
            const actor = await updateActor(fastify, id, actorProps);

            if (!actor) {
                reply.code(400).send({ error: `Actor with ID ${id} not found` });
            } else {
                reply.code(200).send({ actor: actor });
            }
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.delete("/actors/:id", deleteActorOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const actor = deleteActor(fastify, id);

        if (!actor) {
            reply.code(400).send({ error: `Actor with ID ${id} not found` });
        } else {
            reply.code(200).send({ message: `Actor with ID ${id} successfully deleted` });
        }
    });
}

export { actorRoutes };