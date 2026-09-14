import express from "express";
import cors from "cors";
import helmet from "helmet";

import routes from "./routes/index.js";
import { notFound } from "./middleware/notFoundMiddleware.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());

// origin is read lazily (per-request) rather than captured once at import
// time, because app.js is evaluated as an ES module dependency before
// server.js's own dotenv.config() call runs - capturing
// process.env.CLIENT_URL directly here would permanently bake in
// `undefined`.
app.use(
  cors({
    origin: (origin, callback) => callback(null, process.env.CLIENT_URL),
    credentials: true,
  })
);
// Raised from Express's 100kb default so a base64 profile-photo data URI
// (capped at ~700KB server-side in userService) can actually be saved.
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
