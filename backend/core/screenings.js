import { connectToDatabase } from './mongoClient.js';
import { ObjectId } from 'mongodb';
import Database from 'better-sqlite3';
import redis from './redisClient.js';

const sqliteDb = new Database('./database/cinema-database.db');

export async function getScreenings(fastify) {
    const cacheKey = 'screenings';
    const cachedScreenings = await redis.get(cacheKey);

    if (cachedScreenings) {
        return JSON.parse(cachedScreenings);
    }

    const statement = fastify.db.prepare("SELECT * FROM Screening");

    try {
        const screenings = statement.all();
        await redis.set(cacheKey, JSON.stringify(screenings), 'EX', 3600); // Cache für 1 Stunde
        return screenings;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function getScreeningById(fastify, id) {
    const statement = fastify.db.prepare("SELECT * FROM Screening WHERE id = ?");

    try {
        const screening = statement.get(id);
        return screening;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export async function createScreening(fastify, screeningProps) {
    if (!screeningProps.movie_id || !screeningProps.hall_id || !screeningProps.date_time) {
        throw new Error('Missing required screening properties.');
    }

    const insertStatement = fastify.db.prepare(`
        INSERT INTO Screening (movie_id, hall_id, date_time)
        VALUES (?, ?, ?)
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM Screening WHERE id = ?");

    try {
        const info = insertStatement.run(screeningProps.movie_id, screeningProps.hall_id, screeningProps.date_time);

        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert screening.');
        }

        const newScreening = selectStatement.get(info.lastInsertRowid);

        // Synchronisiere mit MongoDB
        const mongoDb = await connectToDatabase();
        await mongoDb.collection('screenings').insertOne(newScreening);

        await redis.del('screenings'); // Cache invalidieren

        return newScreening;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export async function updateScreening(fastify, id, screeningProps) {
    const fields = [];
    const values = [];

    if (screeningProps.movie_id) {
        fields.push("movie_id = ?");
        values.push(screeningProps.movie_id);
    }
    if (screeningProps.hall_id) {
        fields.push("hall_id = ?");
        values.push(screeningProps.hall_id);
    }
    if (screeningProps.date_time) {
        fields.push("date_time = ?");
        values.push(screeningProps.date_time);
    }

    values.push(id);

    const updateStatement = fastify.db.prepare(`
        UPDATE Screening
        SET ${fields.join(", ")}
        WHERE id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM Screening WHERE id = ?");

    try {
        const info = updateStatement.run(...values);

        if (info.changes === 0) {
            throw new Error(`Screening with ID ${id} not found`);
        }

        const updatedScreening = selectStatement.get(id);

        // Synchronisiere mit MongoDB
        const mongoDb = await connectToDatabase();
        await mongoDb.collection('screenings').updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedScreening }
        );

        await redis.del('screenings'); // Cache invalidieren

        return updatedScreening;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export async function deleteScreening(fastify, id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM Screening WHERE id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM Screening WHERE id = ?");

    try {
        const screeningToDelete = selectStatement.get(id);

        const info = deleteStatement.run(id);

        if (info.changes === 0) {
            throw new Error(`Screening with ID ${id} not found`);
        }

        // Synchronisiere mit MongoDB
        const mongoDb = await connectToDatabase();
        await mongoDb.collection('screenings').deleteOne({ _id: new ObjectId(id) });

        await redis.del('screenings'); // Cache invalidieren

        return screeningToDelete;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}