import Fastify from "fastify";
import { planRoutes } from "./routes/plan.js";

const app = Fastify({
    logger: true,
});


app.get("/", async (request, reply) => {
    return { message: "Hello, World!" };
});

app.register(planRoutes);

app.listen({ port: Number(process.env.PORT) || 3333, host: "0.0.0.0" })
    .then(() => {
        console.log(`Server is running on port ${process.env.PORT || 3333}`);
    })

    .catch((err) => {
        console.error("Error starting server:", err);
        process.exit(1);
    });