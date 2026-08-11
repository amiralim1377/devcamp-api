import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiResponse } from "../utils/ApiResponse.js";
import bootcampController from "./bootcampController.js";
import bootcampService from "../services/bootcamp.service.js";
import { HttpCodes } from "../utils/HttpCodes.js";

describe("BootcampController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllBootcamps", () => {
    it("should return all bootcamps successfully", async () => {
      // Arrange
      const mockReq = { query: {} };
      const mockRes = {};
      const fakeBootcamps = [{ id: "1" }];

      const bootcampServiceSpy = vi
        .spyOn(bootcampService, "getAllBootcamps")
        .mockResolvedValue(fakeBootcamps);

      const ApiResponseSendSpy = vi
        .spyOn(ApiResponse, "send")
        .mockReturnValue({} as any);

      // Act
      await bootcampController.getAllBootcamps(mockReq as any, mockRes as any);

      // Assert
      expect(bootcampServiceSpy).toHaveBeenCalledWith(mockReq.query);
      expect(ApiResponseSendSpy).toHaveBeenCalledWith(
        mockRes,
        HttpCodes.OK,
        "Bootcamps retrieved successfully.",
        { bootcamps: fakeBootcamps },
        { results: fakeBootcamps.length },
      );
    });
  });

  describe("getSingleBootcamp", () => {
    it("should return single bootcamps successfully", async () => {
      // Arrange
      const mockReq = { query: {} };
      const mockRes = {};
      const fakeBootcamps = [{ id: "1" }];

      const bootcampServiceSpy = vi
        .spyOn(bootcampService, "getAllBootcamps")
        .mockResolvedValue(fakeBootcamps);

      const ApiResponseSendSpy = vi
        .spyOn(ApiResponse, "send")
        .mockReturnValue({} as any);

      // Act
      await bootcampController.getAllBootcamps(mockReq as any, mockRes as any);

      // Assert
      expect(bootcampServiceSpy).toHaveBeenCalledWith(mockReq.query);
      expect(ApiResponseSendSpy).toHaveBeenCalledWith(
        mockRes,
        HttpCodes.OK,
        "Bootcamps retrieved successfully.",
        { bootcamps: fakeBootcamps },
        { results: fakeBootcamps.length },
      );
    });
  });
});
