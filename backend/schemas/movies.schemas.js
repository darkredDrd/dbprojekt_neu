const movieSchema = {
    $id: "movieSchema",
    type: "object",
    properties: {
        id: { type: "integer" },
        title: { type: "string" },
        genre: { type: "string" },
        duration_minutes: { type: "integer" },
    },
    required: ["title", "genre", "duration_minutes"],
};

const getMoviesOptions = {
    schema: {
        querystring: {
            type: "object",
            properties: {
                title: { type: "string" },
                genre: { type: "string" },
                duration_minutes: { type: "integer" },
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
                genre: { type: "string" },
                duration_minutes: { type: "integer" },
            },
            required: ["title", "genre", "duration_minutes"],
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
                genre: { type: "string" },
                duration_minutes: { type: "integer" },
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