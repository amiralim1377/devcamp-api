import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`❌ Missing mandatory environment variable: ${key}`);
  }

  return value;
};

const config = {
  port: parseInt(getEnvVar("PORT", "3000")),
  nodeEnv: getEnvVar("NODE_ENV", "development"),
  jwtSecret: getEnvVar("JWT_SECRET"),
  jwtExpiresIn: getEnvVar("JWT_EXPIRES_IN"),
  jwtCookieExpiresIn: getEnvVar("JWT_COOKIE_EXPIRES_IN"),
  databaseLocal: getEnvVar("DATABASE_LOCAL"),
  clientUrl: getEnvVar("CLIENT_URL"),
  jwtAccessExpiresIn: getEnvVar("JWT_ACCESS_EXPIRES_IN"),
  jwtRefreshExpiresIn: getEnvVar("JWT_REFRESH_EXPIRES_IN"),
  emailHost: getEnvVar("EMAIL_HOST"),
  emailPort: parseInt(getEnvVar("EMAIL_PORT", "587")),
  emailUsername: getEnvVar("EMAIL_USERNAME"),
  emailPassword: getEnvVar("EMAIL_PASSWORD"),
};

export { config };
