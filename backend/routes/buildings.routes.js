import {
    getBuildings,
    getBuildingById,
    createBuilding,
    updateBuilding,
    deleteBuilding
} from '../core/buildings.js';
import {
    getBuildingsOptions,
    getBuildingOptions,
    createBuildingOptions,
    updateBuildingOptions,
    deleteBuildingOptions
} from '../schemas/buildings.schemas.js';

/**
 * Includes the routes for the '/buildings' API endpoint.
 * 
 * With this route the user can:
 * - GET all buildings
 * - GET a single building by ID
 * - POST a new building
 * - PUT (update) a building by ID
 * - DELETE a building by ID
 */
async function buildingRoutes(fastify, options) {
    fastify.get("/buildings", getBuildingsOptions, async (request, reply) => {
        const buildings = getBuildings(fastify);

        if (!buildings) {
            reply.code(500);
            return { error: "Could not get buildings" };
        }

        reply.code(200);
        return buildings;
    });

    fastify.get("/buildings/:id", getBuildingOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const building = getBuildingById(fastify, id);
        if (!building) {
            reply.code(400);
            return { error: `Building with ID ${id} not found` };
        }

        reply.code(200);
        return { building: building };
    });

    fastify.post("/buildings", createBuildingOptions, async (request, reply) => {
        const buildingProps = request.body;

        try {
            const building = await createBuilding(fastify, buildingProps);

            if (!building) {
                reply.code(500);
                return { error: "Could not create building" };
            }

            reply.code(201);
            return { building: building };
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.put("/buildings/:id", updateBuildingOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const buildingProps = request.body;

        try {
            const building = await updateBuilding(fastify, id, buildingProps);

            if (!building) {
                reply.code(400).send({ error: `Building with ID ${id} not found` });
            } else {
                reply.code(200).send({ building: building });
            }
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.delete("/buildings/:id", deleteBuildingOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const building = deleteBuilding(fastify, id);

        if (!building) {
            reply.code(400).send({ error: `Building with ID ${id} not found` });
        } else {
            reply.code(200).send({ message: `Building with ID ${id} successfully deleted` });
        }
    });
}

export { buildingRoutes };