import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '../assets');

export function getDocuments(fastify, filters = {}) {
    let query = "SELECT * FROM documents WHERE 1=1";
    const params = [];

    if (filters.filename) {
        query += " AND filename LIKE ?";
        params.push(`%${filters.filename}%`);
    }

    if (filters.uploaded_by) {
        query += " AND uploaded_by LIKE ?";
        params.push(`%${filters.uploaded_by}%`);
    }

    if (filters.offer_id) {
        query += " AND offer_id LIKE ?";
        params.push(`%${filters.offer_id}%`);
    }


    const statement = fastify.db.prepare(query);

    try {
        const documents = statement.all(...params);
        return documents;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function getDocumentById(fastify, id) {
    const statement = fastify.db.prepare("SELECT * FROM documents WHERE id = ?");

    try {
        const document = statement.get(id);
        return document;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function getDocumentsByOfferId(fastify, offerId) {
    const statement = fastify.db.prepare(`
        SELECT id, filename, file_url
        FROM documents
        WHERE offer_id = ?
    `);

    try {
        const documents = statement.all(offerId);
        return documents;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export async function createDocument(fastify, documentProps, file) {
    const { offer_id, uploaded_by } = documentProps;
    const filename = file.filename;

    // Validate the input to ensure required properties are provided
    if (!offer_id || !uploaded_by || !file) {
        throw new Error('Missing required document properties.');
    }

    // Ensure the file is a .txt file
    if (path.extname(filename) !== '.txt') {
        throw new Error('Only .txt files are supported.');
    }

    // Create the timestamp in the format YYYY-MM-DD HH:MM:SS to avoid problems with SQLite
    const now = new Date();
    const sqliteTimestamp = now.toISOString().replace('T', ' ').split('.')[0];

    // Generate a unique ID for the file
    const fileId = uuidv4();
    const filePath = path.join(assetsDir, `${fileId}.txt`);

    // Save the file to the filesystem
    await fs.mkdir(assetsDir, { recursive: true });
    await fs.writeFile(filePath, await file.toBuffer());

    const insertIntostatement = fastify.db.prepare(`
        INSERT INTO documents (offer_id, filename, file_url, uploaded_by, uploaded_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM documents WHERE id = ?");

    const documentToCreate = {
        offer_id,
        filename,
        file_url: `/assets/${fileId}.txt`,
        uploaded_by,
        uploaded_at: sqliteTimestamp,
        updated_at: sqliteTimestamp
    };

    try {
        const { offer_id, filename, file_url, uploaded_by, uploaded_at, updated_at } = documentToCreate;
        const info = insertIntostatement.run(offer_id, filename, file_url, uploaded_by, uploaded_at, updated_at);

        // Check if the insertion was successful
        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert document.');
        }

        return selectStatement.get(info.lastInsertRowid);
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export async function updateDocument(fastify, documentId, documentProps, file) {
    const { uploaded_by } = documentProps;

    // Validate the input to ensure required properties are provided
    if (!documentId || (!file && !uploaded_by)) {
        throw new Error('Missing required document properties.');
    }

    // Create the timestamp in the format YYYY-MM-DD HH:MM:SS to avoid problems with SQLite
    const now = new Date();
    const sqliteTimestamp = now.toISOString().replace('T', ' ').split('.')[0];

    const fields = [];
    const values = [];

    if (uploaded_by) {
        fields.push('uploaded_by = ?');
        values.push(uploaded_by);
    }

    if (file) {
        const filename = file.filename;

        // Ensure the file is a .txt file
        if (path.extname(filename) !== '.txt') {
            throw new Error('Only .txt files are supported.');
        }

        // Generate a unique ID for the file
        const fileId = uuidv4();
        const filePath = path.join(assetsDir, `${fileId}.txt`);

        // Save the file to the filesystem
        await fs.mkdir(assetsDir, { recursive: true });
        await fs.writeFile(filePath, await file.toBuffer());

        fields.push('filename = ?');
        values.push(filename);

        fields.push('file_url = ?');
        values.push(`/assets/${fileId}.txt`);
    }

    fields.push('updated_at = ?');
    values.push(sqliteTimestamp);
    values.push(documentId);

    const updateStatement = fastify.db.prepare(`
        UPDATE documents
        SET ${fields.join(', ')}
        WHERE id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM documents WHERE id = ?");

    try {
        const info = updateStatement.run(...values);

        // Check if the update was successful
        if (info.changes === 0) {
            throw new Error('Failed to update document or no changes made.');
        }

        return selectStatement.get(documentId);
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function deleteDocument(fastify, id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM documents WHERE id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM documents WHERE id = ?");

    try {
        // Retrieve the document before deleting it
        const documentToDelete = selectStatement.get(id);

        // Delete the document
        const info = deleteStatement.run(id);

        if (info.changes === 0) {
            throw new Error(`Document with ID ${id} not found`);
        }

        return documentToDelete;
    } catch (err) {
        // Log the error for debugging
        fastify.log.error(err);
        throw err; // Rethrow the error for the caller to handle
    }
}