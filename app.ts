import express, { Express } from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { logger } from "./src/utils/logger";
import { xss } from "express-xss-sanitizer";

const app: Express = express();

// 1) Set security HTTP headers
app.use(helmet());

// 2) Trust proxy for production environment
app.set("trust proxy", 1);

app.use(pinoHttp({ logger }));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against XSS
app.use(xss());
