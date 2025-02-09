const hallSchema = {
    $id: "hallSchema",
    type: "object",
    properties: {
        id: { type: "integer" },
        building_id: { type: "integer" },
        name: { type: "string" },
        seats: { type: "integer" },
    },
};

const getHallsOptions = {
    schema: {
        response: {
            200: {
                type: "array",
                items: { $ref: "hallSchema#" },
            },
        },
    },
};

const getHallOptions = {
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
                    hall: { $ref: "hallSchema#" },
                },
            },
        },
    },
};

const createHallOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                building_id: { type: "integer" },
                name: { type: "string" },
                seats: { type: "integer" },
            },
            required: ["building_id", "name", "seats"],
        },
        response: {
            201: {
                type: "object",
                properties: {
                    hall: { $ref: "hallSchema#" },
                },
            },
        },
    },
};

const updateHallOptions = {
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
                building_id: { type: "integer" },
                name: { type: "string" },
                seats: { type: "integer" },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    hall: { $ref: "hallSchema#" },
                },
            },
        },
    },
};

const deleteHallOptions = {
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
    hallSchema,
    getHallsOptions,
    getHallOptions,
    createHallOptions,
    updateHallOptions,
    deleteHallOptions,
};