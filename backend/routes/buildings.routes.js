import {
    getCollection,
    insertDocument,
    updateDocument,
    deleteDocument
} from '../database/database.js';
import {
    getBuildingsOptions,
    getBuildingOptions,
    createBuildingOptions,
    updateBuildingOptions,
    deleteBuildingOptions
} from '../schemas/buildings.schemas.js';
import {
    getBuildings,
    getBuildingById,
    createBuilding,
    updateBuilding,
    deleteBuilding
} from '../core/buildings.js';

async function buildingRoutes(fastify, options) {
    fastify.get("/buildings", { schema: getBuildingsOptions }, async (request, reply) => {
        const buildings = await getBuildings(fastify);
        reply.code(200).send(buildings);
    });

    fastify.get("/buildings/:id", { schema: getBuildingOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const building = await getBuildingById(fastify, id);
        if (!building) {
            reply.code(400).send({ error: `Building with ID ${id} not found` });
        } else {
            reply.code(200).send(building);
        }
    });

    fastify.post("/buildings", { schema: createBuildingOptions }, async (request, reply) => {
        const newBuilding = request.body;
        const insertedBuilding = await createBuilding(fastify, newBuilding);
        reply.code(201).send(insertedBuilding);
    });

    fastify.put("/buildings/:id", { schema: updateBuildingOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const updatedBuilding = await updateBuilding(fastify, id, request.body);
        if (!updatedBuilding) {
            reply.code(400).send({ error: `Building with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedBuilding);
        }
    });

    fastify.delete("/buildings/:id", { schema: deleteBuildingOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const deletedBuilding = await deleteBuilding(fastify, id);
        if (!deletedBuilding) {
            reply.code(400).send({ error: `Building with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedBuilding);
        }
    });
}

export { buildingRoutes };