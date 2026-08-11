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
      const mockReq = {
        query: {},
        params: {
          id: "12",
        },
      };
      const mockRes = {};
      const fakeBootcamp = { id: "12", name: "Test Bootcamp" };

      const bootcampServiceSpy = vi
        .spyOn(bootcampService, "getBootcamp")
        .mockResolvedValue(fakeBootcamp as any);

      const ApiResponseSendSpy = vi
        .spyOn(ApiResponse, "send")
        .mockReturnValue({} as any);

      // Act
      await bootcampController.getSingleBootcamp(
        mockReq as any,
        mockRes as any,
      );

      // Assert
      expect(bootcampServiceSpy).toHaveBeenCalledTimes(1);
      expect(bootcampServiceSpy).toHaveBeenCalledWith(mockReq.params.id);
      expect(ApiResponseSendSpy).toHaveBeenCalledWith(
        mockRes,
        HttpCodes.OK,
        "Bootcamp retrieved successfully",
        { bootcamp: fakeBootcamp },
      );
    });
  });

  describe("createBootcamp", () => {
    it("should create a bootcamp successfully", async () => {
      // Arrange
      const fakeUserId = "user_123";

      const mockReq = {
        body: { name: "Test Bootcamp" },
        user: { _id: fakeUserId },
      };
      const mockRes = {};

      const fakeCreatedBootcamp = {
        id: "new_123",
        name: "Test Bootcamp",
        instructor: fakeUserId,
      };

      const createBootcampServiceSpy = vi
        .spyOn(bootcampService, "createBootcamp")
        .mockResolvedValue(fakeCreatedBootcamp as any);

      const ApiResponseSendSpy = vi
        .spyOn(ApiResponse, "send")
        .mockReturnValue({} as any);

      // Act
      const actual = await bootcampController.createBootcamp(
        mockReq as any,
        mockRes as any,
      );

      // Assert
      expect(createBootcampServiceSpy).toHaveBeenCalledTimes(1);
      expect(createBootcampServiceSpy).toHaveBeenCalledTimes(1);
      expect(createBootcampServiceSpy).toHaveBeenCalledWith({
        name: "Test Bootcamp",
        instructor: fakeUserId,
      });
      expect(ApiResponseSendSpy).toHaveBeenCalledWith(
        mockRes,
        HttpCodes.CREATED,
        "Bootcamp created successfully",
        { bootcamp: fakeCreatedBootcamp },
      );
    });
  });

  describe("deleteBootcamp", () => {
    it("should delete a bootcamp successfully", async () => {
      // Arrange
      const mockReq = {
        params: {
          id: "12",
        },
        user: {
          _id: "user_123",
          role: "admin",
        },
      };

      const mockRes = {};

      const deleteBootcampServiceSpy = vi
        .spyOn(bootcampService, "deleteBootcamp")
        .mockResolvedValue(undefined as any);

      const ApiResponseSendSpy = vi
        .spyOn(ApiResponse, "send")
        .mockReturnValue({} as any);

      // Act
      await bootcampController.deleteBootcamp(mockReq as any, mockRes as any);

      // Assert

      expect(deleteBootcampServiceSpy).toHaveBeenCalledTimes(1);
      expect(deleteBootcampServiceSpy).toHaveBeenCalledWith(
        "12",
        "user_123",
        "admin",
      );

      expect(ApiResponseSendSpy).toHaveBeenCalledWith(
        mockRes,
        HttpCodes.NO_CONTENT,
        "Bootcamp deleted successfully",
      );
    });
  });

  describe("updateBootcamp", () => {
    it("should upload a bootcamp successfully", async () => {
      const fakeUpdatedBody = { name: "updated-name-bootcamp" };
      // Arrange
      const mockReq = {
        params: {
          id: "12",
        },
        user: {
          _id: "user_123",
          role: "admin",
        },
        body: fakeUpdatedBody,
      };
      const mockRes = {};

      const fakeUpdatedBootcamp = {
        name: "updated-name-bootcamp",
        _id: "12",
      };

      const updateBootcampServiceSpy = vi
        .spyOn(bootcampService, "updateBootcamp")
        .mockResolvedValue(fakeUpdatedBootcamp as any);

      const ApiResponseSendSpy = vi
        .spyOn(ApiResponse, "send")
        .mockReturnValue({} as any);

      // Act
      await bootcampController.updateBootcamp(mockReq as any, mockRes as any);

      // Assert

      expect(updateBootcampServiceSpy).toHaveBeenCalledTimes(1);
      expect(updateBootcampServiceSpy).toHaveBeenCalledWith(
        "12",
        fakeUpdatedBody,
        "user_123",
        "admin",
      );

      expect(ApiResponseSendSpy).toHaveBeenCalledWith(
        mockRes,
        HttpCodes.OK,
        "Bootcamp updated successfully",
        {
          bootcamp: fakeUpdatedBootcamp,
        },
      );
    });
  });
  describe("uploadBootcampPhoto", () => {
    it("should throw an error if no file is uploaded", async () => {
      const fakeUpdatedBody = { name: "updated-name-bootcamp" };
      // Arrange
      const mockReq = {
        params: {
          id: "12",
        },
        user: {
          _id: "user_123",
          role: "admin",
        },
        body: fakeUpdatedBody,
      };
      const mockRes = {};

      const updateBootcampServiceSpy = vi
        .spyOn(bootcampService, "uploadBootcampImage")
        .mockResolvedValue({} as any);

      const ApiResponseSendSpy = vi
        .spyOn(ApiResponse, "send")
        .mockReturnValue({} as any);

      // Act
      await expect(
        bootcampController.uploadBootcampPhoto(mockReq as any, mockRes as any),
      ).rejects.toThrow("Please upload a file");

      // Assert
      expect(updateBootcampServiceSpy).toHaveBeenCalledTimes(0);
      expect(ApiResponseSendSpy).toHaveBeenCalledTimes(0);
    });

    it("should upload a bootcamp photo successfully", async () => {
      const fakeUpdatedBody = { name: "updated-name-bootcamp" };
      const fakeBootcampFileName = "image-bootcamp";
      // Arrange
      const mockReq = {
        params: {
          id: "12",
        },
        user: {
          _id: "user_123",
          role: "admin",
        },
        body: fakeUpdatedBody,
        file: {
          filename: fakeBootcampFileName,
        },
      };
      const mockRes = {};

      const fakeUpdatedBootcamp = {
        name: "updated-name-bootcamp",
        _id: "12",
        image: fakeBootcampFileName,
      };

      const updateBootcampServiceSpy = vi
        .spyOn(bootcampService, "uploadBootcampImage")
        .mockResolvedValue(fakeUpdatedBootcamp as any);

      const ApiResponseSendSpy = vi
        .spyOn(ApiResponse, "send")
        .mockReturnValue({} as any);

      // Act
      await bootcampController.uploadBootcampPhoto(
        mockReq as any,
        mockRes as any,
      );

      // Assert

      expect(updateBootcampServiceSpy).toHaveBeenCalledTimes(1);
      expect(updateBootcampServiceSpy).toHaveBeenCalledWith(
        "12",
        fakeBootcampFileName,
        "user_123",
        "admin",
      );

      expect(ApiResponseSendSpy).toHaveBeenCalledWith(
        mockRes,
        HttpCodes.OK,
        "Bootcamp photo uploaded successfully",
        {
          photo: fakeBootcampFileName,
          bootcamp: fakeUpdatedBootcamp,
        },
      );
    });
  });
});
