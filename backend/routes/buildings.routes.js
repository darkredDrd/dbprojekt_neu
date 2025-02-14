import {
    getCollection,
    insertDocument,
    updateDocument,
    deleteDocument
} from '../database/mockDatabase.js';
import {
    getBuildingsOptions,
    getBuildingOptions,
    createBuildingOptions,
    updateBuildingOptions,
    deleteBuildingOptions
} from '../schemas/buildings.schemas.js';

async function buildingRoutes(fastify, options) {
    fastify.get("/buildings", getBuildingsOptions, async (request, reply) => {
        const buildings = getCollection('buildings');
        reply.code(200).send(buildings);
    });

    fastify.get("/buildings/:id", getBuildingOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const building = getCollection('buildings').find(b => b.id === id);
        if (!building) {
            reply.code(400).send({ error: `Building with ID ${id} not found` });
        } else {
            reply.code(200).send(building);
        }
    });

    fastify.post("/buildings", createBuildingOptions, async (request, reply) => {
        const newBuilding = request.body;
        const insertedBuilding = insertDocument('buildings', newBuilding);
        reply.code(201).send(insertedBuilding);
    });

    fastify.put("/buildings/:id", updateBuildingOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const updatedBuilding = updateDocument('buildings', id, request.body);
        if (!updatedBuilding) {
            reply.code(400).send({ error: `Building with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedBuilding);
        }
    });

    fastify.delete("/buildings/:id", deleteBuildingOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const deletedBuilding = deleteDocument('buildings', id);
        if (!deletedBuilding) {
            reply.code(400).send({ error: `Building with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedBuilding);
        }
    });
}

export { buildingRoutes };