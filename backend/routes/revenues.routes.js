import {
    getRevenues,
    getRevenueById,
    createRevenue,
    updateRevenue,
    deleteRevenue
} from '../core/revenues.js';
import {
    getRevenuesOptions,
    getRevenueOptions,
    createRevenueOptions,
    updateRevenueOptions,
    deleteRevenueOptions
} from '../schemas/revenues.schemas.js';

/**
 * Includes the routes for the '/revenues' API endpoint.
 * 
 * With this route the user can:
 * - GET all revenues
 * - GET a single revenue by ID
 * - POST a new revenue
 * - PUT (update) a revenue by ID
 * - DELETE a revenue by ID
 */
async function revenueRoutes(fastify, options) {
    fastify.get("/revenues", getRevenuesOptions, async (request, reply) => {
        const revenues = getRevenues(fastify);

        if (!revenues) {
            reply.code(500);
            return { error: "Could not get revenues" };
        }

        reply.code(200);
        return revenues;
    });

    fastify.get("/revenues/:id", getRevenueOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const revenue = getRevenueById(fastify, id);
        if (!revenue) {
            reply.code(400);
            return { error: `Revenue with ID ${id} not found` };
        }

        reply.code(200);
        return { revenue: revenue };
    });

    fastify.post("/revenues", createRevenueOptions, async (request, reply) => {
        const revenueProps = request.body;

        try {
            const revenue = await createRevenue(fastify, revenueProps);

            if (!revenue) {
                reply.code(500);
                return { error: "Could not create revenue" };
            }

            reply.code(201);
            return { revenue: revenue };
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.put("/revenues/:id", updateRevenueOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const revenueProps = request.body;

        try {
            const revenue = await updateRevenue(fastify, id, revenueProps);

            if (!revenue) {
                reply.code(400).send({ error: `Revenue with ID ${id} not found` });
            } else {
                reply.code(200).send({ revenue: revenue });
            }
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.delete("/revenues/:id", deleteRevenueOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const revenue = deleteRevenue(fastify, id);

        if (!revenue) {
            reply.code(400).send({ error: `Revenue with ID ${id} not found` });
        } else {
            reply.code(200).send({ message: `Revenue with ID ${id} successfully deleted` });
        }
    });
}

export { revenueRoutes };