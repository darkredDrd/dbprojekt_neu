import {
    getMovieActors,
    getMovieActorById,
    createMovieActor,
    updateMovieActor,
    deleteMovieActor
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
import {
    getCollection,
    insertDocument,
    updateDocument,
    deleteDocument
} from '../database/mockDatabase.js';

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
    fastify.get("/movieActors", getMovieActorsOptions, async (request, reply) => {
        const movieActors = getCollection('movieActors');
        reply.code(200).send(movieActors);
    });

    fastify.get("/movieActors/:movie_id/:actor_id", getMovieActorOptions, async (request, reply) => {
        const movie_id = parseInt(request.params.movie_id, 10);
        const actor_id = parseInt(request.params.actor_id, 10);
        const movieActor = getCollection('movieActors').find(ma => ma.movie_id === movie_id && ma.actor_id === actor_id);
        if (!movieActor) {
            reply.code(400).send({ error: `MovieActor with movie_id ${movie_id} and actor_id ${actor_id} not found` });
        } else {
            reply.code(200).send(movieActor);
        }
    });

    fastify.post("/movieActors", createMovieActorOptions, async (request, reply) => {
        const newMovieActor = request.body;
        const insertedMovieActor = insertDocument('movieActors', newMovieActor);
        reply.code(201).send(insertedMovieActor);
    });

    fastify.put("/movieActors/:movie_id/:actor_id", updateMovieActorOptions, async (request, reply) => {
        const movie_id = parseInt(request.params.movie_id, 10);
        const actor_id = parseInt(request.params.actor_id, 10);
        const updatedMovieActor = updateDocument('movieActors', { movie_id, actor_id }, request.body);
        if (!updatedMovieActor) {
            reply.code(400).send({ error: `MovieActor with movie_id ${movie_id} and actor_id ${actor_id} not found` });
        } else {
            reply.code(200).send(updatedMovieActor);
        }
    });

    fastify.delete("/movieActors/:movie_id/:actor_id", deleteMovieActorOptions, async (request, reply) => {
        const movie_id = parseInt(request.params.movie_id, 10);
        const actor_id = parseInt(request.params.actor_id, 10);
        const deletedMovieActor = deleteDocument('movieActors', { movie_id, actor_id });
        if (!deletedMovieActor) {
            reply.code(400).send({ error: `MovieActor with movie_id ${movie_id} and actor_id ${actor_id} not found` });
        } else {
            reply.code(200).send(deletedMovieActor);
        }
    });

    // Add this route to fetch actors for a specific movie
    fastify.get("/movies/:movie_id/actors", getActorsForMovieOptions, async (request, reply) => {
        const movie_id = parseInt(request.params.movie_id, 10);
        const statement = fastify.db.prepare(`
            SELECT Actor.id, Actor.name
            FROM Actor
            JOIN MovieActor ON Actor.id = MovieActor.actor_id
            WHERE MovieActor.movie_id = ?
        `);

        try {
            const actors = statement.all(movie_id);
            reply.code(200).send(actors);
        } catch (err) {
            fastify.log.error(err);
            reply.code(500).send({ error: "Could not fetch actors for the movie" });
        }
    });

    // Add this route to add an actor to a specific movie
    fastify.post("/movies/:movie_id/actors", addActorToMovieOptions, async (request, reply) => {
        const movie_id = parseInt(request.params.movie_id, 10);
        const { actorId } = request.body;

        const statement = fastify.db.prepare(`
            INSERT INTO MovieActor (movie_id, actor_id)
            VALUES (?, ?)
        `);

        try {
            statement.run(movie_id, actorId);
            reply.code(201).send({ message: "Actor added to movie successfully" });
        } catch (err) {
            fastify.log.error(err);
            reply.code(500).send({ error: "Could not add actor to movie" });
        }
    });

    // Add this route to delete an actor from a specific movie
    fastify.delete("/movies/:movie_id/actors/:actor_id", deleteActorFromMovieOptions, async (request, reply) => {
        const movie_id = parseInt(request.params.movie_id, 10);
        const actor_id = parseInt(request.params.actor_id, 10);

        const statement = fastify.db.prepare(`
            DELETE FROM MovieActor
            WHERE movie_id = ? AND actor_id = ?
        `);

        try {
            statement.run(movie_id, actor_id);
            reply.code(200).send({ message: "Actor removed from movie successfully" });
        } catch (err) {
            fastify.log.error(err);
            reply.code(500).send({ error: "Could not remove actor from movie" });
        }
    });
}

export { movieActorRoutes };