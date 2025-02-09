const screeningSchema = {
    $id: "screeningSchema",
    type: "object",
    properties: {
        id: { type: "integer" },
        movie_id: { type: "integer" },
        hall_id: { type: "integer" },
        date_time: { type: "string", format: "date-time" },
    },
    required: ["movie_id", "hall_id", "date_time"],
};

const getScreeningsOptions = {
    schema: {
        response: {
            200: {
                type: "array",
                items: { $ref: "screeningSchema#" },
            },
        },
    },
};

const getScreeningOptions = {
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
                    screening: { $ref: "screeningSchema#" },
                },
            },
        },
    },
};

const createScreeningOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                movie_id: { type: "integer" },
                hall_id: { type: "integer" },
                date_time: { type: "string", format: "date-time" },
            },
            required: ["movie_id", "hall_id", "date_time"],
        },
        response: {
            201: {
                type: "object",
                properties: {
                    screening: { $ref: "screeningSchema#" },
                },
            },
        },
    },
};

const updateScreeningOptions = {
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
                movie_id: { type: "integer" },
                hall_id: { type: "integer" },
                date_time: { type: "string", format: "date-time" },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    screening: { $ref: "screeningSchema#" },
                },
            },
        },
    },
};

const deleteScreeningOptions = {
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
    screeningSchema,
    getScreeningsOptions,
    getScreeningOptions,
    createScreeningOptions,
    updateScreeningOptions,
    deleteScreeningOptions,
};