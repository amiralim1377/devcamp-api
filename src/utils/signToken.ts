import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

const signToken = (id: string): string => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as any,
  });
};

export { signToken };
