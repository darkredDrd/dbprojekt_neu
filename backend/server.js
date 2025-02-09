import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { customerRoutes } from "./routes/customer.routes.js";
import { commentRoutes } from "./routes/comment.routes.js";
import { documentRoutes } from "./routes/document.routes.js";
import { legacyRoutes } from "./routes/legacy.routes.js";
import { offerRoutes } from "./routes/offer.routes.js";
import { testRoutes } from "./routes/test_generate.routes.js";
import { customerSchema } from "./schemas/customer.schemas.js";
import { commentSchema } from "./schemas/comment.schemas.js";
import { documentSchema } from "./schemas/document.schemas.js";
import { legacyOfferSchema } from "./schemas/legacy.schemas.js";
import { offerSchema } from "./schemas/offer.schemas.js";
import { testGenerateSchema } from "./schemas/test_generate.schemas.js";
import dbConnector from "./database/database.js";

const fastify = Fastify({ logger: true });

fastify.addSchema(customerSchema);
fastify.addSchema(commentSchema);
fastify.addSchema(documentSchema);
fastify.addSchema(legacyOfferSchema);
fastify.addSchema(offerSchema);
fastify.addSchema(testGenerateSchema);

// Register the multipart plugin
fastify.register(multipart);

// CORS integration to improve security for Frontend
fastify.register(cors, {
    origin: (origin, cb) => {
        const allowedOrigins = ['http://localhost:5173'];
        if (!origin || allowedOrigins.includes(origin)) {
            cb(null, true);
        } else {
            cb(new Error('Not allowed by CORS'));
        }
    }
});

// // Add a hook to set the default Authorization header if not present
// fastify.addHook('onRequest', async (request, reply) => {
//     if (!request.headers['authorization']) {
//         request.headers['authorization'] = 'Basic User';
//     }
// });

// Add a preHandler hook to log handle authorization
fastify.addHook('preHandler', async (request, reply) => {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
        reply.code(401).send({ error: 'Authorization header is missing' });
        return;
    }

    const [scheme, role] = authHeader.split(' ');
    if (scheme !== 'Basic' || !['Account-Manager', 'Developer', 'User'].includes(role)) {
        reply.code(401).send({ error: 'Invalid authorization scheme or role' });
        return;
    }

    request.role = role;
});

fastify.register(dbConnector);
fastify.register(customerRoutes, { prefix: "/api" });
fastify.register(commentRoutes, { prefix: "/api" });
fastify.register(documentRoutes, { prefix: "/api" });
fastify.register(offerRoutes, { prefix: "/api" });
fastify.register(legacyRoutes, { prefix: "/api" });
fastify.register(testRoutes, { prefix: "/api" });

try {
    await fastify.listen({ port: 8080 });
    console.log(`Server is running at http://localhost:8080`);
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}