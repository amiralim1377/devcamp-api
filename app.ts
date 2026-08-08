import express, { Express } from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import qs from "qs";
import { xss } from "express-xss-sanitizer";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import { pinoLogger } from "./src/utils/logger.js";
import { AppError } from "./src/utils/AppError.js";
import { globalErrorHandler } from "./src/middlewares/errorHandler.js";
import userRouter from "./src/routes/user-routes.js";
import authRouter from "./src/routes/auth-routes.js";
import bootcampsRouter from "./src/routes/bootcamp-routes.js";
import courseRouter from "./src/routes/course-routes.js";
import reviewRouter from "./src/routes/review-routes.js";
import { config } from "./src/config/index.js";
import { setupSwagger } from "./src/utils/swagger.js";
import { requestIdMiddleware } from "./src/middlewares/requestId.middleware.js";
import { HttpCodes } from "./src/utils/HttpCodes.js";
import { AppCodes } from "./src/utils/AppCodes.js";

const app: Express = express();

app.use(requestIdMiddleware);

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);

// Parse Cookie header and populate req.cookies
app.use(cookieParser());

// Override Express default query parser with 'qs'
app.set("query parser", (str: string) => qs.parse(str));

// 1) Set security HTTP headers
app.use(helmet());

// 2) Trust proxy for production environment
app.set("trust proxy", 1);

// 👈 اتصال pino-http به لاگر
app.use(pinoHttp({ logger: pinoLogger }));

setupSwagger(app);

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
  next(
    AppError.create(
      HttpCodes.NOT_FOUND,
      AppCodes.ROUTE_NOT_FOUND,
      `Cannot find ${req.originalUrl} on this server!`,
    ),
  );
});

//  Global Error Handler
app.use(globalErrorHandler);

export default app;
