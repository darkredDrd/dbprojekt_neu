import {
    getHallsOptions,
    getHallOptions,
    createHallOptions,
    updateHallOptions,
    deleteHallOptions
} from '../schemas/halls.schemas.js';
import {
    getHalls,
    getHallById,
    createHall,
    updateHall,
    deleteHall
} from '../core/halls.js';

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
    fastify.get("/halls", { schema: getHallsOptions }, async (request, reply) => {
        const halls = await getHalls(fastify);
        reply.code(200).send(halls);
    });

    fastify.get("/halls/:id", { schema: getHallOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const hall = await getHallById(fastify, id);
        if (!hall) {
            reply.code(400).send({ error: `Hall with ID ${id} not found` });
        } else {
            reply.code(200).send(hall);
        }
    });

    fastify.post("/halls", { schema: createHallOptions }, async (request, reply) => {
        const newHall = request.body;
        const insertedHall = await createHall(fastify, newHall);
        reply.code(201).send(insertedHall);
    });

    fastify.put("/halls/:id", { schema: updateHallOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const updatedHall = await updateHall(fastify, id, request.body);
        if (!updatedHall) {
            reply.code(400).send({ error: `Hall with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedHall);
        }
    });

    fastify.delete("/halls/:id", { schema: deleteHallOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const deletedHall = await deleteHall(fastify, id);
        if (!deletedHall) {
            reply.code(400).send({ error: `Hall with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedHall);
        }
    });
}

export { hallRoutes };