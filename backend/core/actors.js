import { connectToDatabase } from './mongoClient.js';
import { ObjectId } from 'mongodb';

export async function getActors(fastify) {
    const statement = fastify.db.prepare("SELECT * FROM Actor");

    try {
        const actors = statement.all();
        return actors;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export async function getActorById(fastify, id) {
    const statement = fastify.db.prepare("SELECT * FROM Actor WHERE id = ?");

    try {
        const actor = statement.get(id);
        return actor;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export async function createActor(fastify, actorProps) {
    if (!actorProps.name || !actorProps.birth_date) {
        throw new Error('Missing required actor properties.');
    }

    const insertStatement = fastify.db.prepare(`
        INSERT INTO Actor (name, birth_date)
        VALUES (?, ?)
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM Actor WHERE id = ?");

    try {
        const info = insertStatement.run(actorProps.name, actorProps.birth_date);

        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert actor.');
        }

        const newActor = selectStatement.get(info.lastInsertRowid);

        // Synchronisiere mit MongoDB
        const mongoDb = await connectToDatabase();
        await mongoDb.collection('actors').insertOne(newActor);

        return newActor;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export async function updateActor(fastify, id, actorProps) {
    const fields = [];
    const values = [];

    if (actorProps.name) {
        fields.push("name = ?");
        values.push(actorProps.name);
    }
    if (actorProps.birth_date) {
        fields.push("birth_date = ?");
        values.push(actorProps.birth_date);
    }

    values.push(id);

    const updateStatement = fastify.db.prepare(`
        UPDATE Actor
        SET ${fields.join(", ")}
        WHERE id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM Actor WHERE id = ?");

    try {
        const info = updateStatement.run(...values);

        if (info.changes === 0) {
            throw new Error(`Actor with ID ${id} not found`);
        }

        const updatedActor = selectStatement.get(id);

        // Synchronisiere mit MongoDB
        const mongoDb = await connectToDatabase();
        await mongoDb.collection('actors').updateOne(
            { _id: new ObjectId(id) },
            { $set: actorProps }
        );

        return updatedActor;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export async function deleteActor(fastify, id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM Actor WHERE id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM Actor WHERE id = ?");

    try {
        const actorToDelete = selectStatement.get(id);

        const info = deleteStatement.run(id);

        if (info.changes === 0) {
            throw new Error(`Actor with ID ${id} not found`);
        }

        // Synchronisiere mit MongoDB
        const mongoDb = await connectToDatabase();
        await mongoDb.collection('actors').deleteOne({ _id: new ObjectId(id) });

        return actorToDelete;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}