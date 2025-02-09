import fp from "fastify-plugin";
import Database from "better-sqlite3";


const filePath = "./database/database.db";


// Defines SQL statement to create tables - note that we don't use VARCHAR as SQLite automatically converts it to TEXT //
// We use cascading deletes to ensure that child-data is deleted when parent-data is deleted //
const createTableStatements = `
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, -- to identify the customer
        email TEXT NOT NULL, -- to contact the customer by email
        phone TEXT NOT NULL, -- to contact the customer by phone
        address TEXT NOT NULL, -- to know where the customer is located
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS offers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL, -- to link the offer to a customer
        title TEXT NOT NULL, -- to identify the offer
        description TEXT NOT NULL, -- to describe the offer
        price REAL NOT NULL, -- to specify the price of the offer
        currency TEXT CHECK(currency IN ('EUR', 'USD', 'GBP')) NOT NULL, -- to specify the currency of the price
        status TEXT CHECK(status IN ('draft', 'in_progress', 'active', 'on_ice')) NOT NULL, 
        created_by TEXT NOT NULL, -- to assign the offer to an account manager
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        offer_id INTEGER NOT NULL, -- to link the document to an offer
        filename TEXT NOT NULL, -- to identify the document
        file_url TEXT NOT NULL, -- to access the document
        uploaded_by TEXT NOT NULL, -- to know who uploaded the document
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        offer_id INTEGER NOT NULL, -- to link the comment to an offer
        author TEXT NOT NULL, -- to identify the author of the comment
        content TEXT NOT NULL, -- to specify the content of the comment
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE
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