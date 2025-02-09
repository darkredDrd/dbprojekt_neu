import { createOffer } from '../core/offers.js';
import { legacyOfferOptions } from '../schemas/legacy.schemas.js';
import { checkPermission } from '../authorization.js';

/**
 * Includes the routes for the '/legacy' API endpoint.
 * 
 * With this route the user can:
 * - POST a legacy offer
 */
async function legacyRoutes(fastify, options) {
    fastify.post("/legacy/offers", legacyOfferOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'importLegacyOffer')) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        const legacyData = request.body;

        // Transform legacy data to new format
        const offerProps = {
            customer_id: legacyData.xOffer.customerId,
            title: legacyData.xOffer.name,
            description: legacyData.xOffer.hints.join(', '),
            price: legacyData.xOffer.price,
            currency: legacyData.xOffer.currency,
            status: legacyData.xOffer.state.toLowerCase().replace('-', '_'),
            created_by: legacyData.xCreatedBy,
            created_at: legacyData.xCreatedOn,
            updated_at: legacyData.xCreatedOn
        };

        try {
            const offer = await createOffer(fastify, offerProps);

            if (!offer) {
                reply.code(500).send({ error: "Could not create offer from legacy data" });
                return;
            }

            reply.code(201).send({ offer: offer });
        } catch (err) {
            reply.code(400).send({ error: err.message });
        }
    });
}

export { legacyRoutes };