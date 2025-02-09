import {
    getHalls,
    getHallById,
    createHall,
    updateHall,
    deleteHall
} from '../core/halls.js';
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
        const halls = getHalls(fastify);

        if (!halls) {
            reply.code(500);
            return { error: "Could not get halls" };
        }

        reply.code(200);
        return halls;
    });

    fastify.get("/halls/:id", getHallOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const hall = getHallById(fastify, id);
        if (!hall) {
            reply.code(400);
            return { error: `Hall with ID ${id} not found` };
        }

        reply.code(200);
        return { hall: hall };
    });

    fastify.post("/halls", createHallOptions, async (request, reply) => {
        const hallProps = request.body;

        try {
            const hall = await createHall(fastify, hallProps);

            if (!hall) {
                reply.code(500);
                return { error: "Could not create hall" };
            }

            reply.code(201);
            return { hall: hall };
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.put("/halls/:id", updateHallOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const hallProps = request.body;

        try {
            const hall = await updateHall(fastify, id, hallProps);

            if (!hall) {
                reply.code(400).send({ error: `Hall with ID ${id} not found` });
            } else {
                reply.code(200).send({ hall: hall });
            }
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.delete("/halls/:id", deleteHallOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const hall = deleteHall(fastify, id);

        if (!hall) {
            reply.code(400).send({ error: `Hall with ID ${id} not found` });
        } else {
            reply.code(200).send({ message: `Hall with ID ${id} successfully deleted` });
        }
    });
}

export { hallRoutes };