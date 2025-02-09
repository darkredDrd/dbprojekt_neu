import {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentsByOfferId
} from '../core/documents.js';
import {
    getDocumentsOptions,
    getDocumentOptions,
    createDocumentOptions,
    updateDocumentOptions,
    deleteDocumentOptions,
    getDocumentsByOfferIdOptions,
    getDocumentContentOptions
} from '../schemas/document.schemas.js';
import { checkPermission } from '../authorization.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getOfferById } from '../core/offers.js';

// Define __filename and __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Includes the routes for the '/documents' API endpoint.
 * 
 * With this route the user can:
 * - GET all documents
 * - GET a single document by ID
 * - POST a new document
 * - PUT (update) a document by ID
 * - DELETE a document by ID
 * - GET all documents for a specific offer
 * - GET the content of a document by URL
 */
async function documentRoutes(fastify, options) {
    fastify.get("/documents", getDocumentsOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'getDocuments')) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const { filename, uploaded_by } = request.query;
        const documents = getDocuments(fastify, { filename, uploaded_by });

        if (!documents) {
            reply.code(500);
            return { error: "Could not get documents" };
        }

        reply.code(200);
        return documents;
    });

    fastify.get("/documents/:id", getDocumentOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'getDocumentById')) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const id = parseInt(request.params.id, 10);

        const document = getDocumentById(fastify, id);
        if (!document) {
            reply.code(400);
            return { error: `Document with ID ${id} not found` };
        }

        reply.code(200);
        return { document: document };
    });

    fastify.get("/offers/:offerId/documents", getDocumentsByOfferIdOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'getDocumentsByOfferId')) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const offerId = parseInt(request.params.offerId, 10);

        const documents = getDocumentsByOfferId(fastify, offerId);
        if (!documents) {
            reply.code(500);
            return { error: `Could not get documents for offer with ID ${offerId}` };
        }

        reply.code(200);
        return { documents: documents };
    });

    fastify.get("/documents/content/:fileId", getDocumentContentOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'getDocumentContent')) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const fileId = parseInt(request.params.fileId, 10);

        // Fetch the document from the database to get the file URL
        const document = getDocumentById(fastify, fileId);
        if (!document) {
            reply.code(404).send({ error: `Document with ID ${fileId} not found` });
            return;
        }

        const filePath = path.join(__dirname, '..', document.file_url);

        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            reply.code(200).send(fileContent);
        } catch (err) {
            fastify.log.error(err);
            reply.code(404).send({ error: `File with ID ${fileId} not found` });
        }
    });

    fastify.post("/offers/:offerId/documents", createDocumentOptions, async (request, reply) => {
        const offer = getOfferById(fastify, parseInt(request.params.offerId, 10));
        if (!checkPermission(request.role, 'createDocument', offer.status)) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const data = await request.file();
        const { uploaded_by } = request.headers;
        const file = data;

        const documentProps = { offer_id: request.params.offerId, uploaded_by };

        try {
            const document = await createDocument(fastify, documentProps, file);

            if (!document) {
                reply.code(500);
                return { error: "Could not create document" };
            }

            reply.code(201);
            return { document: document };
        } catch (err) {
            reply.code(400);
            return { error: err.message };
        }
    });

    fastify.put("/offers/:offerId/documents/:id", updateDocumentOptions, async (request, reply) => {
        const offer = getOfferById(fastify, parseInt(request.params.offerId, 10));
        if (!checkPermission(request.role, 'updateDocument', offer.status)) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const id = parseInt(request.params.id, 10);
        const data = await request.file();
        const { uploaded_by } = request.headers;
        const file = data;

        const documentProps = { uploaded_by };

        try {
            const document = await updateDocument(fastify, id, documentProps, file);

            if (!document) {
                reply.code(400);
                return { error: `Document with ID ${id} not found` };
            }

            reply.code(200);
            return { document: document };
        } catch (err) {
            reply.code(400);
            return { error: err.message };
        }
    });

    fastify.delete("/offers/:offerId/documents/:id", deleteDocumentOptions, async (request, reply) => {
        const offer = getOfferById(fastify, parseInt(request.params.offerId, 10));
        if (!checkPermission(request.role, 'deleteDocument', offer.status)) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const id = parseInt(request.params.id, 10);

        const document = deleteDocument(fastify, id);

        if (!document) {
            reply.code(400);
            return { error: `Document with ID ${id} not found` };
        }

        reply.code(200);
        return { message: `Document with ID ${id} successfully deleted` };
    });
}

export { documentRoutes };