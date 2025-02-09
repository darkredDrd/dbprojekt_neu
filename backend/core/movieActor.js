export function getMovieActors(fastify) {
    const statement = fastify.db.prepare("SELECT * FROM MovieActor");

    try {
        const movieActors = statement.all();
        return movieActors;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function getMovieActorById(fastify, movie_id, actor_id) {
    const statement = fastify.db.prepare("SELECT * FROM MovieActor WHERE movie_id = ? AND actor_id = ?");

    try {
        const movieActor = statement.get(movie_id, actor_id);
        return movieActor;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function createMovieActor(fastify, movieActorProps) {
    if (!movieActorProps.movie_id || !movieActorProps.actor_id) {
        throw new Error('Missing required movie actor properties.');
    }

    const insertStatement = fastify.db.prepare(`
        INSERT INTO MovieActor (movie_id, actor_id)
        VALUES (?, ?)
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM MovieActor WHERE movie_id = ? AND actor_id = ?");

    try {
        const info = insertStatement.run(movieActorProps.movie_id, movieActorProps.actor_id);

        if (!info.changes) {
            throw new Error('Failed to insert movie actor.');
        }

        return selectStatement.get(movieActorProps.movie_id, movieActorProps.actor_id);
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export function updateMovieActor(fastify, movie_id, actor_id, movieActorProps) {
    const fields = [];
    const values = [];

    if (movieActorProps.movie_id) {
        fields.push("movie_id = ?");
        values.push(movieActorProps.movie_id);
    }
    if (movieActorProps.actor_id) {
        fields.push("actor_id = ?");
        values.push(movieActorProps.actor_id);
    }

    values.push(movie_id, actor_id);

    const updateStatement = fastify.db.prepare(`
        UPDATE MovieActor
        SET ${fields.join(", ")}
        WHERE movie_id = ? AND actor_id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM MovieActor WHERE movie_id = ? AND actor_id = ?");

    try {
        const info = updateStatement.run(...values);

        if (info.changes === 0) {
            throw new Error(`MovieActor with movie_id ${movie_id} and actor_id ${actor_id} not found`);
        }

        return selectStatement.get(movie_id, actor_id);
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export function deleteMovieActor(fastify, movie_id, actor_id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM MovieActor WHERE movie_id = ? AND actor_id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM MovieActor WHERE movie_id = ? AND actor_id = ?");

    try {
        const movieActorToDelete = selectStatement.get(movie_id, actor_id);

        const info = deleteStatement.run(movie_id, actor_id);

        if (info.changes === 0) {
            throw new Error(`MovieActor with movie_id ${movie_id} and actor_id ${actor_id} not found`);
        }

        return movieActorToDelete;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}