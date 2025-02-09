const movieSchema = {
    $id: "movieSchema",
    type: "object",
    properties: {
        id: { type: "integer" },
        title: { type: "string" },
        description: { type: "string" },
        release_date: { type: "string", format: "date" },
        duration: { type: "integer" },
        rating: { type: "number" },
    },
    required: ["title", "description", "release_date", "duration", "rating"],
};

const getMoviesOptions = {
    schema: {
        querystring: {
            type: "object",
            properties: {
                title: { type: "string" },
                release_date: { type: "string", format: "date" },
                rating: { type: "number" },
            },
        },
        response: {
            200: {
                type: "array",
                items: { $ref: "movieSchema#" },
            },
        },
    },
};

const getMovieOptions = {
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
                    movie: { $ref: "movieSchema#" },
                },
            },
        },
    },
};

const createMovieOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                title: { type: "string" },
                description: { type: "string" },
                release_date: { type: "string", format: "date" },
                duration: { type: "integer" },
                rating: { type: "number" },
            },
            required: ["title", "description", "release_date", "duration", "rating"],
        },
        response: {
            201: {
                type: "object",
                properties: {
                    movie: { $ref: "movieSchema#" },
                },
            },
        },
    },
};

const updateMovieOptions = {
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
                title: { type: "string" },
                description: { type: "string" },
                release_date: { type: "string", format: "date" },
                duration: { type: "integer" },
                rating: { type: "number" },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    movie: { $ref: "movieSchema#" },
                },
            },
        },
    },
};

const deleteMovieOptions = {
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
    movieSchema,
    getMoviesOptions,
    getMovieOptions,
    createMovieOptions,
    updateMovieOptions,
    deleteMovieOptions,
};