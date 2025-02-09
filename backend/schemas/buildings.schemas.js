const buildingSchema = {
    $id: "buildingSchema",
    type: "object",
    properties: {
        id: { type: "integer" },
        name: { type: "string" },
        address: { type: "string" },
    },
};

const getBuildingsOptions = {
    schema: {
        response: {
            200: {
                type: "array",
                items: { $ref: "buildingSchema#" },
            },
        },
    },
};

const getBuildingOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                id: { type: "integer" },
            },
            required: ["id"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    building: { $ref: "buildingSchema#" },
                },
            },
        },
    },
};

const createBuildingOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                name: { type: "string" },
                address: { type: "string" },
            },
            required: ["name", "address"],
        },
        response: {
            201: {
                type: "object",
                properties: {
                    building: { $ref: "buildingSchema#" },
                },
            },
        },
    },
};

const updateBuildingOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                id: { type: "integer" },
            },
            required: ["id"],
        },
        body: {
            type: "object",
            properties: {
                name: { type: "string" },
                address: { type: "string" },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    building: { $ref: "buildingSchema#" },
                },
            },
        },
    },
};

const deleteBuildingOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                id: { type: "integer" },
            },
            required: ["id"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
        },
    },
};

export {
    buildingSchema,
    getBuildingsOptions,
    getBuildingOptions,
    createBuildingOptions,
    updateBuildingOptions,
    deleteBuildingOptions,
};