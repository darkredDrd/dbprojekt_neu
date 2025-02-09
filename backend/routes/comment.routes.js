import {
    getComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
    getCommentsByOfferId
} from '../core/comments.js';
import {
    getCommentsOptions,
    getCommentOptions,
    createCommentOptions,
    updateCommentOptions,
    deleteCommentOptions,
    getCommentsByOfferIdOptions
} from '../schemas/comment.schemas.js';
import { checkPermission } from '../authorization.js';
import { getOfferById } from '../core/offers.js';

/**
 * Includes the routes for the '/comments' API endpoint.
 * 
 * With this route the user can:
 * - GET all comments
 * - GET a single comment by ID
 * - POST a new comment
 * - PUT (update) a comment by ID
 * - DELETE a comment by ID
 * - GET all comments for a specific offer
 */
async function commentRoutes(fastify, options) {
    fastify.get("/comments", getCommentsOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'getComments')) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const { author, content } = request.query;
        const comments = getComments(fastify, { author, content });

        if (!comments) {
            reply.code(500);
            return { error: "Could not get comments" };
        }

        reply.code(200);
        return comments;
    });

    fastify.get("/comments/:id", getCommentOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'getCommentById')) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const id = parseInt(request.params.id, 10);

        const comment = getCommentById(fastify, id);
        if (!comment) {
            reply.code(400);
            return { error: `Comment with ID ${id} not found` };
        }

        reply.code(200);
        return { comment: comment };
    });

    fastify.get("/offers/:offerId/comments", getCommentsByOfferIdOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'getCommentsByOfferId')) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const offerId = parseInt(request.params.offerId, 10);

        const comments = getCommentsByOfferId(fastify, offerId);
        if (!comments) {
            reply.code(500);
            return { error: `Could not get comments for offer with ID ${offerId}` };
        }

        reply.code(200);
        return comments;
    });

    fastify.post("/offers/:offerId/comments", createCommentOptions, async (request, reply) => {
        const offer = getOfferById(fastify, parseInt(request.params.offerId, 10));
        if (!checkPermission(request.role, 'createComment', offer.status)) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const commentProps = request.body;

        try {
            const comment = await createComment(fastify, commentProps);

            if (!comment) {
                reply.code(500);
                return { error: "Could not create comment" };
            }

            reply.code(201);
            return { comment: comment };
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.put("/offers/:offerId/comments/:id", updateCommentOptions, async (request, reply) => {
        const offer = getOfferById(fastify, parseInt(request.params.offerId, 10));
        if (!checkPermission(request.role, 'updateComment', offer.status)) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const id = parseInt(request.params.id, 10);
        const commentProps = request.body;

        try {
            const comment = await updateComment(fastify, id, commentProps);

            if (!comment) {
                reply.code(400).send({ error: `Comment with ID ${id} not found` });
            } else {
                reply.code(200).send({ comment: comment });
            }
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.delete("/offers/:offerId/comments/:id", deleteCommentOptions, async (request, reply) => {
        const offer = getOfferById(fastify, parseInt(request.params.offerId, 10));
        if (!checkPermission(request.role, 'deleteComment', offer.status)) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const id = parseInt(request.params.id, 10);

        const comment = deleteComment(fastify, id);

        if (!comment) {
            reply.code(400).send({ error: `Comment with ID ${id} not found` });
        } else {
            reply.code(200).send({ message: `Comment with ID ${id} successfully deleted` });
        }
    });
}

export { commentRoutes };