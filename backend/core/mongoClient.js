// backend/core/mongoClient.js
import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

export async function connectToDatabase() {
    if (!db) {
        await client.connect();
        db = client.db('cinema-portal');
    }
    return db;
}