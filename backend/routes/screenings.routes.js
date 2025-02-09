import {
    getScreenings,
    getScreeningById,
    createScreening,
    updateScreening,
    deleteScreening
} from '../core/screenings.js';
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
    fastify.get("/screenings", getScreeningsOptions, async (request, reply) => {
        const screenings = getScreenings(fastify);

        if (!screenings) {
            reply.code(500);
            return { error: "Could not get screenings" };
        }

        reply.code(200);
        return screenings;
    });

    fastify.get("/screenings/:id", getScreeningOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const screening = getScreeningById(fastify, id);
        if (!screening) {
            reply.code(400);
            return { error: `Screening with ID ${id} not found` };
        }

        reply.code(200);
        return { screening: screening };
    });

    fastify.post("/screenings", createScreeningOptions, async (request, reply) => {
        const screeningProps = request.body;

        try {
            const screening = await createScreening(fastify, screeningProps);

            if (!screening) {
                reply.code(500);
                return { error: "Could not create screening" };
            }

            reply.code(201);
            return { screening: screening };
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.put("/screenings/:id", updateScreeningOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const screeningProps = request.body;

        try {
            const screening = await updateScreening(fastify, id, screeningProps);

            if (!screening) {
                reply.code(400).send({ error: `Screening with ID ${id} not found` });
            } else {
                reply.code(200).send({ screening: screening });
            }
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.delete("/screenings/:id", deleteScreeningOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const screening = deleteScreening(fastify, id);

        if (!screening) {
            reply.code(400).send({ error: `Screening with ID ${id} not found` });
        } else {
            reply.code(200).send({ message: `Screening with ID ${id} successfully deleted` });
        }
    });
}

export { screeningRoutes };