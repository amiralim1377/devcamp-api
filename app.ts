import express, { Express } from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { logger } from "./src/utils/logger";
import { xss } from "express-xss-sanitizer";
import { AppError } from "./src/utils/AppError";
import { globalErrorHandler } from "./src/middlewares/errorHandler";
import userRouter from "./src/routes/user-routes";
import cors from "cors";
import { config } from "./src/config";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);

app.use(cookieParser());

// 1) Set security HTTP headers
app.use(helmet());

// 2) Trust proxy for production environment
app.set("trust proxy", 1);

app.use(pinoHttp({ logger }));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against XSS
app.use(xss());

app.use("/api/v1/users", userRouter);

app.all("/{*splat}", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// 11) Global Error Handler
app.use(globalErrorHandler);

export default app;
