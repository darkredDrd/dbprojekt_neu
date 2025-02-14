import fp from "fastify-plugin";
import Database from "better-sqlite3";
import { connectToDatabase } from '../core/mongoClient.js';
import { ObjectId } from 'mongodb';

const filePath = "./database/cinema-database.db";

// Defines SQL statement to create tables - note that we don't use VARCHAR as SQLite automatically converts it to TEXT //
// We use cascading deletes to ensure that child-data is deleted when parent-data is deleted //
const createTableStatements = `
    CREATE TABLE IF NOT EXISTS Building (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Hall (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    building_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    seats INTEGER NOT NULL,
    FOREIGN KEY (building_id) REFERENCES Building(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Movie (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Actor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    birth_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS MovieActor (
    movie_id INTEGER NOT NULL,
    actor_id INTEGER NOT NULL,
    PRIMARY KEY (movie_id, actor_id),
    FOREIGN KEY (movie_id) REFERENCES Movie(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES Actor(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Screening (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    hall_id INTEGER NOT NULL,
    date_time DATETIME NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES Movie(id) ON DELETE CASCADE,
    FOREIGN KEY (hall_id) REFERENCES Hall(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Revenue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    screening_id INTEGER NOT NULL,
    total_revenue REAL NOT NULL,
    FOREIGN KEY (screening_id) REFERENCES Screening(id) ON DELETE CASCADE
);
`;

// Initialize the database
const db = new Database(filePath);

// Execute the create table statement
db.exec(createTableStatements);

export default fp(async (fastify, opts) => {
    fastify.decorate('db', db);

    fastify.addHook('onClose', (fastifyInstance, done) => {
        db.close();
        done();
    });
});

export async function getCollection(collectionName) {
    const db = await connectToDatabase();
    return db.collection(collectionName).find().toArray();
}

export async function insertDocument(collectionName, document) {
    const db = await connectToDatabase();
    const result = await db.collection(collectionName).insertOne(document);
    return result.ops[0];
}

export async function updateDocument(collectionName, id, updatedDocument) {
    const db = await connectToDatabase();
    const result = await db.collection(collectionName).findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedDocument },
        { returnOriginal: false }
    );
    return result.value;
}

export async function deleteDocument(collectionName, id) {
    const db = await connectToDatabase();
    const result = await db.collection(collectionName).findOneAndDelete({ _id: new ObjectId(id) });
    return result.value;
}