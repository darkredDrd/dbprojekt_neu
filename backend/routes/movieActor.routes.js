import {
    getMovieActors,
    getMovieActorById,
    createMovieActor,
    updateMovieActor,
    deleteMovieActor,
    getActorsForMovie,
    addActorToMovie,
    deleteActorFromMovie
} from '../core/movieActor.js';
import {
    getMovieActorsOptions,
    getMovieActorOptions,
    createMovieActorOptions,
    updateMovieActorOptions,
    deleteMovieActorOptions,
    getActorsForMovieOptions,
    addActorToMovieOptions,
    deleteActorFromMovieOptions
} from '../schemas/movieActor.schemas.js';

/**
 * Includes the routes for the '/movieActors' API endpoint.
 * 
 * With this route the user can:
 * - GET all movie actors
 * - GET a single movie actor by movie_id and actor_id
 * - POST a new movie actor
 * - PUT (update) a movie actor by movie_id and actor_id
 * - DELETE a movie actor by movie_id and actor_id
 */
async function movieActorRoutes(fastify, options) {
    fastify.get("/movieActors", { schema: getMovieActorsOptions }, async (request, reply) => {
        const movieActors = await getMovieActors(fastify);
        reply.code(200).send(movieActors);
    });

    fastify.get("/movieActors/:movie_id/:actor_id", { schema: getMovieActorOptions }, async (request, reply) => {
        const movie_id = parseInt(request.params.movie_id, 10);
        const actor_id = parseInt(request.params.actor_id, 10);
        const movieActor = await getMovieActorById(fastify, movie_id, actor_id);
        if (!movieActor) {
            reply.code(400).send({ error: `MovieActor with movie_id ${movie_id} and actor_id ${actor_id} not found` });
        } else {
            reply.code(200).send(movieActor);
        }
    });

    fastify.post("/movieActors", { schema: createMovieActorOptions }, async (request, reply) => {
        const newMovieActor = request.body;
        const insertedMovieActor = await createMovieActor(fastify, newMovieActor);
        reply.code(201).send(insertedMovieActor);
    });

    fastify.put("/movieActors/:movie_id/:actor_id", { schema: updateMovieActorOptions }, async (request, reply) => {
        const movie_id = parseInt(request.params.movie_id, 10);
        const actor_id = parseInt(request.params.actor_id, 10);
        const updatedMovieActor = await updateMovieActor(fastify, movie_id, actor_id, request.body);
        if (!updatedMovieActor) {
            reply.code(400).send({ error: `MovieActor with movie_id ${movie_id} and actor_id ${actor_id} not found` });
        } else {
            reply.code(200).send(updatedMovieActor);
        }
    });

    fastify.delete("/movieActors/:movie_id/:actor_id", { schema: deleteMovieActorOptions }, async (request, reply) => {
        const movie_id = parseInt(request.params.movie_id, 10);
        const actor_id = parseInt(request.params.actor_id, 10);
        const deletedMovieActor = await deleteMovieActor(fastify, movie_id, actor_id);
        if (!deletedMovieActor) {
            reply.code(400).send({ error: `MovieActor with movie_id ${movie_id} and actor_id ${actor_id} not found` });
        } else {
            reply.code(200).send(deletedMovieActor);
        }
    });

    // Add this route to fetch actors for a specific movie
    fastify.get("/movies/:movie_id/actors", { schema: getActorsForMovieOptions }, async (request, reply) => {
        const movie_id = parseInt(request.params.movie_id, 10);
        const actors = await getActorsForMovie(fastify, movie_id);
        reply.code(200).send(actors);
    });

    // Add this route to add an actor to a specific movie
    fastify.post("/movies/:movie_id/actors", { schema: addActorToMovieOptions }, async (request, reply) => {
        const movie_id = parseInt(request.params.movie_id, 10);
        const { actorId } = request.body;
        const result = await addActorToMovie(fastify, movie_id, actorId);
        reply.code(201).send(result);
    });

    // Add this route to delete an actor from a specific movie
    fastify.delete("/movies/:movie_id/actors/:actor_id", { schema: deleteActorFromMovieOptions }, async (request, reply) => {
        const movie_id = parseInt(request.params.movie_id, 10);
        const actor_id = parseInt(request.params.actor_id, 10);
        const result = await deleteActorFromMovie(fastify, movie_id, actor_id);
        reply.code(200).send(result);
    });
}

export { movieActorRoutes };