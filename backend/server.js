import Fastify from "fastify";
import cors from "@fastify/cors";
import { buildingRoutes } from "./routes/buildings.routes.js";
import { actorRoutes } from "./routes/actors.routes.js";
import { hallRoutes } from "./routes/halls.routes.js";
import { movieActorRoutes } from "./routes/movieActor.routes.js";
import { movieRoutes } from "./routes/movies.routes.js";
import { revenueRoutes } from "./routes/revenues.routes.js";
import { screeningRoutes } from "./routes/screenings.routes.js";
import { buildingSchema } from "./schemas/buildings.schemas.js";
import { actorSchema } from "./schemas/actors.schemas.js";
import { hallSchema } from "./schemas/halls.schemas.js";
import { movieActorSchema } from "./schemas/movieActor.schemas.js";
import { movieSchema } from "./schemas/movies.schemas.js";
import { revenueSchema } from "./schemas/revenues.schemas.js";
import { screeningSchema } from "./schemas/screenings.schemas.js";
import dbConnector from "./database/database.js";

const fastify = Fastify({ logger: true });

fastify.addSchema(buildingSchema);
fastify.addSchema(actorSchema);
fastify.addSchema(hallSchema);
fastify.addSchema(movieActorSchema);
fastify.addSchema(movieSchema);
fastify.addSchema(revenueSchema);
fastify.addSchema(screeningSchema);

// CORS integration to improve security for Frontend
fastify.register(cors, {
    origin: (origin, cb) => {
        const allowedOrigins = ['http://localhost:3000'];
        if (!origin || allowedOrigins.includes(origin)) {
            cb(null, true);
        } else {
            cb(new Error('Not allowed by CORS'));
        }
    }
});

fastify.register(dbConnector);
fastify.register(buildingRoutes, { prefix: "/api" });
fastify.register(actorRoutes, { prefix: "/api" });
fastify.register(hallRoutes, { prefix: "/api" });
fastify.register(movieActorRoutes, { prefix: "/api" });
fastify.register(movieRoutes, { prefix: "/api" });
fastify.register(revenueRoutes, { prefix: "/api" });
fastify.register(screeningRoutes, { prefix: "/api" });

try {
    await fastify.listen({ port: 8080 });
    console.log(`Server is running at http://localhost:8080`);
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}