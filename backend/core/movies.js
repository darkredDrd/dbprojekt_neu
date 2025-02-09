export function getMovies(fastify) {
    const statement = fastify.db.prepare("SELECT * FROM Movie");

    try {
        const movies = statement.all();
        return movies;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function getMovieById(fastify, id) {
    const statement = fastify.db.prepare("SELECT * FROM Movie WHERE id = ?");

    try {
        const movie = statement.get(id);
        return movie;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function createMovie(fastify, movieProps) {
    if (!movieProps.title || !movieProps.genre || !movieProps.duration_minutes) {
        throw new Error('Missing required movie properties.');
    }

    const insertStatement = fastify.db.prepare(`
        INSERT INTO Movie (title, genre, duration_minutes)
        VALUES (?, ?, ?)
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM Movie WHERE id = ?");

    try {
        const info = insertStatement.run(movieProps.title, movieProps.genre, movieProps.duration_minutes);

        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert movie.');
        }

        return selectStatement.get(info.lastInsertRowid);
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export function updateMovie(fastify, id, movieProps) {
    const fields = [];
    const values = [];

    if (movieProps.title) {
        fields.push("title = ?");
        values.push(movieProps.title);
    }
    if (movieProps.genre) {
        fields.push("genre = ?");
        values.push(movieProps.genre);
    }
    if (movieProps.duration_minutes) {
        fields.push("duration_minutes = ?");
        values.push(movieProps.duration_minutes);
    }

    values.push(id);

    const updateStatement = fastify.db.prepare(`
        UPDATE Movie
        SET ${fields.join(", ")}
        WHERE id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM Movie WHERE id = ?");

    try {
        const info = updateStatement.run(...values);

        if (info.changes === 0) {
            throw new Error(`Movie with ID ${id} not found`);
        }

        return selectStatement.get(id);
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export function deleteMovie(fastify, id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM Movie WHERE id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM Movie WHERE id = ?");

    try {
        const movieToDelete = selectStatement.get(id);

        const info = deleteStatement.run(id);

        if (info.changes === 0) {
            throw new Error(`Movie with ID ${id} not found`);
        }

        return movieToDelete;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}