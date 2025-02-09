const actorSchema = {
    $id: "actorSchema",
    type: "object",
    properties: {
        id: { type: "integer" },
        name: { type: "string" },
        birth_date: { type: "string", format: "date" }, //Example: "birth_date": "1980-01-01"
    },
};

const getActorsOptions = {
    schema: {
        response: {
            200: {
                type: "array",
                items: { $ref: "actorSchema#" },
            },
        },
    },
};

const getActorOptions = {
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
                    actor: { $ref: "actorSchema#" },
                },
            },
        },
    },
};

const createActorOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                name: { type: "string" },
                birth_date: { type: "string", format: "date" },
            },
            required: ["name", "birth_date"],
        },
        response: {
            201: {
                type: "object",
                properties: {
                    actor: { $ref: "actorSchema#" },
                },
            },
        },
    },
};

const updateActorOptions = {
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
                birth_date: { type: "string", format: "date" },
            },
            required: ["name", "birth_date"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    actor: { $ref: "actorSchema#" },
                },
            },
        },
    },
};

const deleteActorOptions = {
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
    actorSchema,
    getActorsOptions,
    getActorOptions,
    createActorOptions,
    updateActorOptions,
    deleteActorOptions,
};