import { describe, it, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import { signToken } from "./signToken.js";
import { config } from "../config/index.js";

describe("signToken", () => {
  it("should generate a valid JWT token with correct payload and expiration", () => {
    // 1. Arrange
    const fakeId = "user_123";
    const fakeToken = "header.payload.signature";

    const jwtSignSpy = vi.spyOn(jwt, "sign").mockReturnValue(fakeToken as any);

    const expectedExpiresIn = Number(config.jwtExpiresIn) * 60;

    // 2. Act
    const actual = signToken(fakeId);

    // 3. Assert
    expect(actual).toBe(fakeToken);
    expect(jwtSignSpy).toHaveBeenCalledWith({ id: fakeId }, config.jwtSecret, {
      expiresIn: expectedExpiresIn,
    });
  });
});
