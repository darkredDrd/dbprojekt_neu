import Fastify from "fastify";
import cors from "@fastify/cors";
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