import redis from './redisClient.js';
import { connectToDatabase } from './mongoClient.js';
import { ObjectId } from 'mongodb';

export async function getHalls(fastify) {
    const cacheKey = 'halls';
    const cachedHalls = await redis.get(cacheKey);

    if (cachedHalls) {
        return JSON.parse(cachedHalls);
    }

    const statement = fastify.db.prepare("SELECT * FROM Hall");

    try {
        const halls = statement.all();
        await redis.set(cacheKey, JSON.stringify(halls), 'EX', 3600); // Cache für 1 Stunde
        return halls;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export async function getHallById(fastify, id) {
    const statement = fastify.db.prepare("SELECT * FROM Hall WHERE id = ?");

    try {
        const hall = statement.get(id);
        return hall;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export async function createHall(fastify, hallProps) {
    if (!hallProps.building_id || !hallProps.name || !hallProps.seats) {
        throw new Error('Missing required hall properties.');
    }

    const insertStatement = fastify.db.prepare(`
        INSERT INTO Hall (building_id, name, seats)
        VALUES (?, ?, ?)
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM Hall WHERE id = ?");

    try {
        const info = insertStatement.run(hallProps.building_id, hallProps.name, hallProps.seats);

        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert hall.');
        }

        const newHall = selectStatement.get(info.lastInsertRowid);

        // Synchronisiere mit MongoDB
        const mongoDb = await connectToDatabase();
        await mongoDb.collection('halls').insertOne(newHall);

        await redis.del('halls'); // Cache invalidieren

        return newHall;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export async function updateHall(fastify, id, hallProps) {
    const fields = [];
    const values = [];

    if (hallProps.building_id) {
        fields.push("building_id = ?");
        values.push(hallProps.building_id);
    }
    if (hallProps.name) {
        fields.push("name = ?");
        values.push(hallProps.name);
    }
    if (hallProps.seats) {
        fields.push("seats = ?");
        values.push(hallProps.seats);
    }

    values.push(id);

    const updateStatement = fastify.db.prepare(`
        UPDATE Hall
        SET ${fields.join(", ")}
        WHERE id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM Hall WHERE id = ?");

    try {
        const info = updateStatement.run(...values);

        if (info.changes === 0) {
            throw new Error(`Hall with ID ${id} not found`);
        }

        const updatedHall = selectStatement.get(id);

        // Synchronisiere mit MongoDB
        const mongoDb = await connectToDatabase();
        await mongoDb.collection('halls').updateOne(
            { _id: new ObjectId(id) },
            { $set: hallProps }
        );

        await redis.del('halls'); // Cache invalidieren

        return updatedHall;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export async function deleteHall(fastify, id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM Hall WHERE id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM Hall WHERE id = ?");

    try {
        const hallToDelete = selectStatement.get(id);

        const info = deleteStatement.run(id);

        if (info.changes === 0) {
            throw new Error(`Hall with ID ${id} not found`);
        }

        // Synchronisiere mit MongoDB
        const mongoDb = await connectToDatabase();
        await mongoDb.collection('halls').deleteOne({ _id: new ObjectId(id) });

        await redis.del('halls'); // Cache invalidieren

        return hallToDelete;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}