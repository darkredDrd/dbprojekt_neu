const movieActorSchema = {
    $id: "movieActorSchema",
    type: "object",
    properties: {
        movie_id: { type: "integer" },
        actor_id: { type: "integer" },
    },
};

const getMovieActorsOptions = {
    schema: {
        response: {
            200: {
                type: "array",
                items: { $ref: "movieActorSchema#" },
            },
        },
    },
};

const getMovieActorOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                movie_id: { type: "integer" },
                actor_id: { type: "integer" },
            },
            required: ["movie_id", "actor_id"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    movieActor: { $ref: "movieActorSchema#" },
                },
            },
        },
    },
};

const createMovieActorOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                movie_id: { type: "integer" },
                actor_id: { type: "integer" },
            },
            required: ["movie_id", "actor_id"],
        },
        response: {
            201: {
                type: "object",
                properties: {
                    movieActor: { $ref: "movieActorSchema#" },
                },
            },
        },
    },
};

const updateMovieActorOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                movie_id: { type: "integer" },
                actor_id: { type: "integer" },
            },
            required: ["movie_id", "actor_id"],
        },
        body: {
            type: "object",
            properties: {
                movie_id: { type: "integer" },
                actor_id: { type: "integer" },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    movieActor: { $ref: "movieActorSchema#" },
                },
            },
        },
    },
};

const deleteMovieActorOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                movie_id: { type: "integer" },
                actor_id: { type: "integer" },
            },
            required: ["movie_id", "actor_id"],
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
    movieActorSchema,
    getMovieActorsOptions,
    getMovieActorOptions,
    createMovieActorOptions,
    updateMovieActorOptions,
    deleteMovieActorOptions,
};