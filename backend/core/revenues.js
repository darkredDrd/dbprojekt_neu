import { connectToDatabase } from './mongoClient.js';
import { ObjectId } from 'mongodb';
import Database from 'better-sqlite3';

const sqliteDb = new Database('./database/cinema-database.db');

export async function getRevenues(fastify) {
    const statement = sqliteDb.prepare("SELECT * FROM Revenue");

    try {
        const revenues = statement.all();
        return revenues;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export async function getRevenueById(fastify, id) {
    const statement = fastify.db.prepare("SELECT * FROM Revenue WHERE id = ?");

    try {
        const revenue = statement.get(id);
        return revenue;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export async function createRevenue(fastify, revenueProps) {
    if (!revenueProps.screening_id || !revenueProps.total_revenue) {
        throw new Error('Missing required revenue properties.');
    }

    const insertStatement = fastify.db.prepare(`
        INSERT INTO Revenue (screening_id, total_revenue)
        VALUES (?, ?)
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM Revenue WHERE id = ?");

    try {
        const info = insertStatement.run(revenueProps.screening_id, revenueProps.total_revenue);

        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert revenue.');
        }

        const newRevenue = selectStatement.get(info.lastInsertRowid);

        // Synchronisiere mit MongoDB
        const mongoDb = await connectToDatabase();
        await mongoDb.collection('revenues').insertOne(newRevenue);

        return newRevenue;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export async function updateRevenue(fastify, id, revenueProps) {
    const fields = [];
    const values = [];

    if (revenueProps.screening_id) {
        fields.push("screening_id = ?");
        values.push(revenueProps.screening_id);
    }
    if (revenueProps.total_revenue) {
        fields.push("total_revenue = ?");
        values.push(revenueProps.total_revenue);
    }

    values.push(id);

    const updateStatement = fastify.db.prepare(`
        UPDATE Revenue
        SET ${fields.join(", ")}
        WHERE id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM Revenue WHERE id = ?");

    try {
        const info = updateStatement.run(...values);

        if (info.changes === 0) {
            throw new Error(`Revenue with ID ${id} not found`);
        }

        const updatedRevenue = selectStatement.get(id);

        // Synchronisiere mit MongoDB
        const mongoDb = await connectToDatabase();
        await mongoDb.collection('revenues').updateOne({ _id: new ObjectId(id) }, { $set: updatedRevenue });

        return updatedRevenue;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export async function deleteRevenue(fastify, id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM Revenue WHERE id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM Revenue WHERE id = ?");

    try {
        const revenueToDelete = selectStatement.get(id);

        const info = deleteStatement.run(id);

        if (info.changes === 0) {
            throw new Error(`Revenue with ID ${id} not found`);
        }

        // Synchronisiere mit MongoDB
        const mongoDb = await connectToDatabase();
        await mongoDb.collection('revenues').deleteOne({ _id: new ObjectId(id) });

        return revenueToDelete;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}