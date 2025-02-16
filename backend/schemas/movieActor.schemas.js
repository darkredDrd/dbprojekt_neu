const movieActorSchema = {
    $id: 'movieActorSchema',
    type: "object",
    properties: {
        movie_id: { type: "integer" },
        actor_id: { type: "integer" }
    },
    required: ["movie_id", "actor_id"]
};

const getMovieActorsOptions = {
    schema: {
        response: {
            200: {
                type: "array",
                items: { $ref: 'movieActorSchema#' }
            }
        }
    }
};

const getMovieActorOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                movie_id: { type: "integer" },
                actor_id: { type: "integer" }
            },
            required: ["movie_id", "actor_id"]
        },
        response: {
            200: { $ref: 'movieActorSchema#' }
        }
    }
};

const createMovieActorOptions = {
    schema: {
        body: { $ref: 'movieActorSchema#' },
        response: {
            201: { $ref: 'movieActorSchema#' }
        }
    }
};

const updateMovieActorOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                movie_id: { type: "integer" },
                actor_id: { type: "integer" }
            },
            required: ["movie_id", "actor_id"]
        },
        body: { $ref: 'movieActorSchema#' },
        response: {
            200: { $ref: 'movieActorSchema#' }
        }
    }
};

const deleteMovieActorOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                movie_id: { type: "integer" },
                actor_id: { type: "integer" }
            },
            required: ["movie_id", "actor_id"]
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" }
                }
            }
        }
    }
};

const getActorsForMovieOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                movie_id: { type: "integer" }
            },
            required: ["movie_id"]
        },
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        name: { type: "string" },
                        birth_date: { type: "string", format: "date" }
                    }
                }
            }
        }
    }
};

const addActorToMovieOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                movie_id: { type: "integer" }
            },
            required: ["movie_id"]
        },
        body: {
            type: "object",
            properties: {
                actorId: { type: "integer" }
            },
            required: ["actorId"]
        },
        response: {
            201: { $ref: 'movieActorSchema#' }
        }
    }
};

const deleteActorFromMovieOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                movie_id: { type: "integer" },
                actor_id: { type: "integer" }
            },
            required: ["movie_id", "actor_id"]
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" }
                }
            }
        }
    }
};

const getMoviesForActorOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                actor_id: { type: "integer" }
            },
            required: ["actor_id"]
        },
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        title: { type: "string" },
                        genre: { type: "string" },
                        duration_minutes: { type: "integer" }
                    }
                }
            }
        }
    }
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
    getMoviesForActorOptions
};