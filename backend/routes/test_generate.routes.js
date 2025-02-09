import { createCustomer } from '../core/customers.js';
import { createOffer } from '../core/offers.js';
import { createComment } from '../core/comments.js';
import { checkPermission } from '../authorization.js';
import { testGenerateOptions } from '../schemas/test_generate.schemas.js';

/**
 * Includes the routes for the '/test' API endpoint.
 * 
 * With this route the user can:
 * - POST to generate test data
 */
async function testRoutes(fastify, options) {
    fastify.post("/test/generate", testGenerateOptions, async (request, reply) => {
        if (!checkPermission(request.role, 'generateTestData')) {
            reply.code(403).send({ error: 'Role does not have permission for this operation' });
            return;
        }

        try {
            // Generate test customers
            const customers = [];
            for (let i = 1; i <= 5; i++) {
                const customer = await createCustomer(fastify, {
                    name: `Test Customer ${i}`,
                    email: `test${i}@example.com`,
                    phone: `123456789${i}`,
                    address: `${i} Test St`
                });
                customers.push(customer);
            }

            // Generate test offers
            const offers = [];
            for (let i = 1; i <= 8; i++) {
                const customerIndex = (i % 5) + 1;
                const offer = await createOffer(fastify, {
                    customer_id: customers[customerIndex - 1].id,
                    title: `Test Offer ${i}`,
                    description: `This is a test offer ${i}`,
                    price: 1000 * i,
                    currency: i % 2 === 0 ? "USD" : "EUR",
                    status: i % 2 === 0 ? "draft" : "active",
                    created_by: "Test User"
                });
                offers.push(offer);
            }

            // Generate test comments
            const comments = [];
            for (let i = 0; i < offers.length; i++) {
                for (let j = 1; j <= 2; j++) {
                    const comment = await createComment(fastify, {
                        offer_id: offers[i].id,
                        content: `This is a test comment ${j} for offer ${offers[i].title}`,
                        author: "Test User"
                    });
                    comments.push(comment);
                }
            }

            reply.code(201).send({ customers, offers, comments });
        } catch (err) {
            reply.code(500).send({ error: err.message });
        }
    });
}

export { testRoutes };