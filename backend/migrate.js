// backend/migrate.js
import Database from 'better-sqlite3';
import { MongoClient } from 'mongodb';

const sqliteFilePath = './database/cinema-database.db';
const mongoUri = 'mongodb://localhost:27017';
const mongoDbName = 'cinema-portal';

async function migrate() {
    // Verbinde mit SQLite
    const sqliteDb = new Database(sqliteFilePath);

    // Verbinde mit MongoDB
    const mongoClient = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoClient.connect();
    const mongoDb = mongoClient.db(mongoDbName);

    // Migriere die Daten
    try {
        // Migriere Buildings
        const buildings = sqliteDb.prepare('SELECT * FROM Building').all();
        const buildingsCollection = mongoDb.collection('buildings');
        await buildingsCollection.insertMany(buildings);

        // Migriere Halls
        const halls = sqliteDb.prepare('SELECT * FROM Hall').all();
        const hallsCollection = mongoDb.collection('halls');
        await hallsCollection.insertMany(halls);

        // Migriere Movies
        const movies = sqliteDb.prepare('SELECT * FROM Movie').all();
        const moviesCollection = mongoDb.collection('movies');
        await moviesCollection.insertMany(movies);

        // Migriere Actors
        const actors = sqliteDb.prepare('SELECT * FROM Actor').all();
        const actorsCollection = mongoDb.collection('actors');
        await actorsCollection.insertMany(actors);

        // Migriere MovieActors
        const movieActors = sqliteDb.prepare('SELECT * FROM MovieActor').all();
        const movieActorsCollection = mongoDb.collection('movieActors');
        await movieActorsCollection.insertMany(movieActors);

        // Migriere Screenings
        const screenings = sqliteDb.prepare('SELECT * FROM Screening').all();
        const screeningsCollection = mongoDb.collection('screenings');
        await screeningsCollection.insertMany(screenings);

        // Migriere Revenues
        const revenues = sqliteDb.prepare('SELECT * FROM Revenue').all();
        const revenuesCollection = mongoDb.collection('revenues');
        await revenuesCollection.insertMany(revenues);

        console.log('Migration erfolgreich abgeschlossen!');
    } catch (err) {
        console.error('Fehler bei der Migration:', err);
    } finally {
        // Schließe die Verbindungen
        sqliteDb.close();
        await mongoClient.close();
    }
}

migrate();