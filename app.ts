import express, { Express } from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { logger } from "./src/utils/logger";
import qs from "qs";
import { xss } from "express-xss-sanitizer";
import { AppError } from "./src/utils/AppError";
import { globalErrorHandler } from "./src/middlewares/errorHandler";
import userRouter from "./src/routes/user-routes";
import authRouter from "./src/routes/auth-routes";
import bootcampsRouter from "./src/routes/bootcamp-routes";
import courseRouter from "./src/routes/course-routes";
import reviewRouter from "./src/routes/review-routes";
import cors from "cors";
import { config } from "./src/config";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

const app: Express = express();

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);

// Parse Cookie header and populate req.cookies
// Essential for reading JWT tokens or session data sent by the client
app.use(cookieParser());

// Override Express default query parser with 'qs'
// Ensures complex/nested query strings (e.g., ?price[lte]=100) are correctly parsed into objects.
app.set("query parser", (str: string) => qs.parse(str));

// 1) Set security HTTP headers
app.use(helmet());

// 2) Trust proxy for production environment
app.set("trust proxy", 1);

app.use(pinoHttp({ logger }));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against XSS
app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی بعد تلاش کنید.",
});
app.use("/api", limiter);

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "averageRating",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  }),
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/bootcamps", bootcampsRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("/*splat", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// 11) Global Error Handler
app.use(globalErrorHandler);

export default app;
