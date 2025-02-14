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

// Schema for fetching actors for a specific movie
const getActorsForMovieOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                movie_id: { type: "integer" },
            },
            required: ["movie_id"],
        },
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        name: { type: "string" },
                    },
                },
            },
        },
    },
};

// Schema for adding an actor to a specific movie
const addActorToMovieOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                movie_id: { type: "integer" },
            },
            required: ["movie_id"],
        },
        body: {
            type: "object",
            properties: {
                actorId: { type: "integer" },
            },
            required: ["actorId"],
        },
        response: {
            201: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
        },
    },
};

// Schema for deleting an actor from a specific movie
const deleteActorFromMovieOptions = {
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
    getActorsForMovieOptions,
    addActorToMovieOptions,
    deleteActorFromMovieOptions,
};