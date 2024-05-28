import express from "express";
const app = express();
import { openDB } from "./utils/db.js";
import * as globalError from "./utils/globalError.js";
import { routes } from "./routers/index.js";
import { limiter } from "./utils/rateLimit.js";
import cors from "cors";

app.use(express.json({ limit: "50mb" }));
app.use(limiter);
app.use(cors());

// database
(async () => await openDB())();

// routers
routes(app);

// globalError
app.use(globalError.errorHandler);

export { app };
