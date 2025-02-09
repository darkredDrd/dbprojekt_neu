import {
    getMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
} from '../core/movies.js';
import {
    getMoviesOptions,
    getMovieOptions,
    createMovieOptions,
    updateMovieOptions,
    deleteMovieOptions
} from '../schemas/movies.schemas.js';

/**
 * Includes the routes for the '/movies' API endpoint.
 * 
 * With this route the user can:
 * - GET all movies
 * - GET a single movie by ID
 * - POST a new movie
 * - PUT (update) a movie by ID
 * - DELETE a movie by ID
 */
async function movieRoutes(fastify, options) {
    fastify.get("/movies", getMoviesOptions, async (request, reply) => {
        const movies = getMovies(fastify);

        if (!movies) {
            reply.code(500);
            return { error: "Could not get movies" };
        }

        reply.code(200);
        return movies;
    });

    fastify.get("/movies/:id", getMovieOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const movie = getMovieById(fastify, id);
        if (!movie) {
            reply.code(400);
            return { error: `Movie with ID ${id} not found` };
        }

        reply.code(200);
        return { movie: movie };
    });

    fastify.post("/movies", createMovieOptions, async (request, reply) => {
        const movieProps = request.body;

        try {
            const movie = await createMovie(fastify, movieProps);

            if (!movie) {
                reply.code(500);
                return { error: "Could not create movie" };
            }

            reply.code(201);
            return { movie: movie };
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.put("/movies/:id", updateMovieOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const movieProps = request.body;

        try {
            const movie = await updateMovie(fastify, id, movieProps);

            if (!movie) {
                reply.code(400).send({ error: `Movie with ID ${id} not found` });
            } else {
                reply.code(200).send({ movie: movie });
            }
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.delete("/movies/:id", deleteMovieOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);

        const movie = deleteMovie(fastify, id);

        if (!movie) {
            reply.code(400).send({ error: `Movie with ID ${id} not found` });
        } else {
            reply.code(200).send({ message: `Movie with ID ${id} successfully deleted` });
        }
    });
}

export { movieRoutes };