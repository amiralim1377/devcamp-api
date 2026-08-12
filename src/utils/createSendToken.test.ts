import { afterEach, describe, expect, it, vi } from "vitest";
import { Session } from "../models/session.model.js";
import { ApiResponse } from "./ApiResponse.js";
import * as signTokenModule from "./signToken.js";
import { createSendToken } from "./createSendToken.js";
import { config } from "../config/index.js";

describe("createSendToken", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create tokens, save session and send response with cookies", async () => {
    const mockReq = {
      ip: "127.0.0.1",
      headers: {
        "user-agent": "Vitest Test Runner",
      },
    };
    const mockstatusCode = 200;

    const mockUser = {
      _id: "fake_user_id",
    };

    const mockRes = {
      cookie: vi.fn(),
    };

    const sessionCreateSpy = vi
      .spyOn(Session, "create")
      .mockResolvedValue({} as any);

    const apiResponseSpy = vi
      .spyOn(ApiResponse, "send")
      .mockResolvedValue({} as any);

    const signTokenSpy = vi
      .spyOn(signTokenModule, "signToken")
      .mockReturnValue("fake_access_token");

    const fakeNow = new Date("2026-01-01T00:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(fakeNow);

    const expectedAccessTokenExpires = new Date(
      fakeNow.getTime() + Number(config.jwtExpiresIn) * 60 * 1000,
    );

    const expectedRefreshTokenExpires = new Date(
      fakeNow.getTime() +
        Number(config.jwtRefreshExpiresIn) * 24 * 60 * 60 * 1000,
    );

    //   act
    await createSendToken(
      mockUser as any,
      mockstatusCode as any,
      mockReq as any,
      mockRes as any,
    );

    // assert

    expect(sessionCreateSpy).toHaveBeenLastCalledWith({
      user: mockUser._id,
      tokenHash: expect.any(String),
      ipAddress: mockReq.ip,
      userAgent: mockReq.headers["user-agent"],
      expiresAt: expectedRefreshTokenExpires,
    });

    // (Access Token)
    expect(mockRes.cookie).toHaveBeenNthCalledWith(
      1,
      "access_token",
      "fake_access_token",
      {
        httpOnly: true,
        secure: config.nodeEnv === "production",
        sameSite: config.nodeEnv === "production" ? "none" : "lax",
        expires: expectedAccessTokenExpires,
      },
    );

    // (Refresh Token)
    expect(mockRes.cookie).toHaveBeenNthCalledWith(
      2,
      "refresh_token",
      expect.any(String),
      {
        httpOnly: true,
        secure: config.nodeEnv === "production",
        sameSite: config.nodeEnv === "production" ? "none" : "lax",
        expires: expectedRefreshTokenExpires,
      },
    );

    expect(apiResponseSpy).toHaveBeenCalledTimes(1);
    expect(apiResponseSpy).toHaveBeenCalledWith(
      mockRes,
      mockstatusCode,
      "عملیات با موفقیت انجام شد",
      { user: mockUser },
    );

    vi.useRealTimers();
  });
});
