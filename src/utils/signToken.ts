import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

const signToken = (id: string): string => {
  const expiresInSeconds = Number(config.jwtExpiresIn) * 60;

  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: expiresInSeconds,
  });
};

export { signToken };
