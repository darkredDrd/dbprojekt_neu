import {
    getOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
    updateOfferStatus
} from '../core/offers.js';
import {
    getOffersOptions,
    getOfferOptions,
    createOfferOptions,
    updateOfferOptions,
    deleteOfferOptions,
    updateOfferStatusOptions
} from '../schemas/offer.schemas.js';
import { checkPermission } from '../authorization.js';

/**
 * Includes the routes for the '/offers' API endpoint.
 * 
 * With this route the user can:
 * - GET all offers
 * - GET a single offer by ID
 * - POST a new offer
 * - PUT (update) an offer by ID
 * - DELETE an offer by ID
 * - PUT (update) the status of an offer by ID
 */
async function offerRoutes(fastify, options) {
    fastify.get("/offers", getOffersOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'getOffers')) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const { title, customer_id, status } = request.query;
        const offers = getOffers(fastify, { title, customer_id, status });

        if (!offers) {
            reply.code(500);
            return { error: "Could not get offers" };
        }

        reply.code(200);
        return offers;
    });

    fastify.get("/offers/:id", getOfferOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'getOfferById')) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const id = parseInt(request.params.id, 10);

        const offer = getOfferById(fastify, id);
        if (!offer) {
            reply.code(400);
            return { error: `Offer with ID ${id} not found` };
        }

        reply.code(200);
        return { offer: offer };
    });

    fastify.post("/offers", createOfferOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'createOffer')) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const offerProps = request.body;

        try {
            const offer = await createOffer(fastify, offerProps);

            if (!offer) {
                reply.code(500);
                return { error: "Could not create offer" };
            }

            reply.code(201);
            return { offer: offer };
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.put("/offers/:id", updateOfferOptions, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const offer = getOfferById(fastify, id);

        if (!checkPermission(request.role, 'updateOffer', offer.status)) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const offerProps = request.body;

        try {
            const updatedOffer = await updateOffer(fastify, id, offerProps);

            if (!updatedOffer) {
                reply.code(400).send({ error: `Offer with ID ${id} not found` });
            } else {
                reply.code(200).send({ offer: updatedOffer });
            }
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.put("/offers/:id/status", updateOfferStatusOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'updateOfferStatus')) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const id = parseInt(request.params.id, 10);
        const { status } = request.body;

        try {
            const offer = await updateOfferStatus(fastify, id, status);

            if (!offer) {
                reply.code(400).send({ error: `Offer with ID ${id} not found` });
            } else {
                reply.code(200).send({ offer: offer });
            }
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });

    fastify.delete("/offers/:id", deleteOfferOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'deleteOffer')) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const id = parseInt(request.params.id, 10);

        const offer = deleteOffer(fastify, id);

        if (!offer) {
            reply.code(400).send({ error: `Offer with ID ${id} not found` });
        } else {
            reply.code(200).send({ message: `Offer with ID ${id} successfully deleted` });
        }
    });
}

export { offerRoutes };