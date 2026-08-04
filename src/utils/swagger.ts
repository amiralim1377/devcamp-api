import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { authDocs } from "../docs/swagger/auth.swagger.js";
import { bootcampDocs } from "../docs/swagger/bootcamp.swagger.js";
import { courseDocs } from "../docs/swagger/course.swagger.js";
import { reviewDocs } from "../docs/swagger/review.swagger.js";
import { userDocs } from "../docs/swagger/user.swagger.js";

const port = process.env.PORT || 5000;

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "DevCamp API 🚀",
    version: "1.0.0",
    description:
      "مستندات کامل API برای پلتفرم مدیریت بوت‌کمپ‌ها و دوره‌های آموزشی",
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    ...authDocs,
    ...bootcampDocs,
    ...courseDocs,
    ...reviewDocs,
    ...userDocs,
  },
};

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`📄 Swagger Docs available at http://localhost:${port}/api-docs`);
};
