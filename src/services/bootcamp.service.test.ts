import { describe, it, expect, vi, beforeEach } from "vitest";
import bootcampService from "./bootcamp.service.js";
import { Bootcamp } from "../models/bootcamp.model.js";

vi.mock("fs/promises");

describe("Bootcamp Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBootcamp", () => {
    it("should return a bootcamp if ID is valid", async () => {
      // 1. Arrange
      const fakeBootcampId = "bootcamp123";
      const fakeBootcampData = { _id: fakeBootcampId, name: "Node.js Mastery" };

      const findByIdSpy = vi.spyOn(Bootcamp, "findById").mockReturnValue({
        populate: vi.fn().mockResolvedValue(fakeBootcampData),
      } as any);

      // 2. Act
      const actual = await bootcampService.getBootcamp(fakeBootcampId);

      // 3. Assert
      expect(findByIdSpy).toHaveBeenCalledWith("bootcamp123");
      expect(actual).toEqual({ _id: fakeBootcampId, name: "Node.js Mastery" });
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });

    it("should throw an AppError if bootcamp is not found", async () => {
      // 1. Arrange
      const fakeBootcampId = "invalid_id";
      const findByIdSpy = vi.spyOn(Bootcamp, "findById").mockReturnValue({
        populate: vi.fn().mockResolvedValue(null),
      } as any);

      // 2. Act & 3. Assert
      await expect(bootcampService.getBootcamp(fakeBootcampId)).rejects.toThrow(
        "Bootcamp not found",
      );

      // ("When you want to test if an async function throws an error, never await it outside the expect statement. You need to pass the raw method call directly inside expect. This way, Vitest can run it and safely catch the thrown error using .rejects, rather than letting the whole program crash.");
    });
  });

  describe("createBootcamp", () => {
    it("should create and return a new bootcamp", async () => {
      const fakeBootcampData = {
        name: "Next.js Bootcamp",
        description: "Master SSR",
      };
      const fakeCreatedBootcamp = { _id: "new_id_123", ...fakeBootcampData };
      const createSpy = vi
        .spyOn(Bootcamp, "create")
        .mockResolvedValue(fakeCreatedBootcamp as any);

      // 2-act
      const actual = await bootcampService.createBootcamp(fakeBootcampData);

      // 3-assert
      expect(createSpy).toHaveBeenCalledWith({
        name: "Next.js Bootcamp",
        description: "Master SSR",
      });
      expect(actual).toEqual({ _id: "new_id_123", ...fakeBootcampData });
    });
  });

  describe("deleteBootcamp", () => {
    it("should throw an AppError if bootcamp is not found-status 404", async () => {
      const fakeBootcampId = "invalid_bootcamp_id";
      const fakeUserId = "user123";
      const fakeUserRole = "user";
      const findByIdSpy = vi
        .spyOn(Bootcamp, "findById")
        .mockResolvedValue(null);

      await expect(
        bootcampService.deleteBootcamp(
          fakeBootcampId,
          fakeUserId,
          fakeUserRole,
        ),
      ).rejects.toThrow("Bootcamp not found");
      expect(findByIdSpy).toHaveBeenCalledWith("invalid_bootcamp_id");
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });
    it("should throw an AppError if user is not authorized to delete-status 403", async () => {
      // 1. Arrange
      const fakeBootcampId = "bootcamp123";
      const fakeUserId = "hacker_user_id";
      const fakeUserRole = "user";
      const fakeBootcampData = {
        _id: fakeBootcampId,
        instructor: "real_owner_id",
      };
      const findByIdSpy = vi
        .spyOn(Bootcamp, "findById")
        .mockResolvedValue(fakeBootcampData);

      // 2. Act & 3. Assert
      await expect(
        bootcampService.deleteBootcamp(
          fakeBootcampId,
          fakeUserId,
          fakeUserRole,
        ),
      ).rejects.toThrow("User not authorized to delete this bootcamp");

      expect(findByIdSpy).toHaveBeenCalledTimes(1);
      expect(findByIdSpy).toHaveBeenCalledWith(fakeBootcampId);
    });

    it("should delete the bootcamp if user is authorized-status 200", async () => {
      // 1. Arrange
      const fakeBootcampId = "bootcamp123";
      const fakeUserId = "real_owner_id";
      const fakeUserRole = "user";

      const deleteOneSpy = vi.fn().mockResolvedValue(true);

      const fakeBootcampData = {
        _id: fakeBootcampId,
        instructor: fakeUserId,
        deleteOne: deleteOneSpy,
      };
      const findByIdSpy = vi
        .spyOn(Bootcamp, "findById")
        .mockResolvedValue(fakeBootcampData as any);
      // act
      const actual = await bootcampService.deleteBootcamp(
        fakeBootcampId,
        fakeUserId,
        fakeUserRole,
      );

      expect(findByIdSpy).toHaveBeenCalledWith(fakeBootcampId);
      expect(deleteOneSpy).toHaveBeenCalledTimes(1);
      expect(actual).toEqual(fakeBootcampData);
    });
  });

  describe("updateBootcamp", () => {
    it("should throw an AppError if bootcamp is not found-404", async () => {
      // 1. Arrange
      const fakeBootcampId = "invalid_bootcamp_id";
      const fakeUserId = "user123";
      const fakeUserRole = "user";
      const fakeUpdateData = { title: "updated-bootcamp" };
      const findByIdSpy = vi
        .spyOn(Bootcamp, "findById")
        .mockResolvedValue(null);
      // 2. Act & 3. Assert
      await expect(
        bootcampService.updateBootcamp(
          fakeBootcampId,
          fakeUpdateData,
          fakeUserId,
          fakeUserRole,
        ),
      ).rejects.toThrow(`Bootcamp not found with id of ${fakeBootcampId}`);

      expect(findByIdSpy).toHaveBeenCalledWith(fakeBootcampId);
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });

    it("should throw an AppError if user is not authorized to update-403 Forbidden", async () => {
      // 1. Arrange
      const fakeBootcampId = "bootcampId-123";
      const fakeUserId = "user123";
      const fakeUserRole = "user";
      const fakeUpdateData = { title: "updated-bootcamp" };
      const fakeExistingBootcamp = {
        _id: fakeBootcampId,
        instructor: "real_owner_id",
      };

      const findByIdSpy = vi
        .spyOn(Bootcamp, "findById")
        .mockResolvedValue(fakeExistingBootcamp);
      // 2. Act & 3. Assert

      await expect(
        bootcampService.updateBootcamp(
          fakeBootcampId,
          fakeUpdateData,
          fakeUserId,
          fakeUserRole,
        ),
      ).rejects.toThrow("User not authorized to update this bootcamp");

      expect(findByIdSpy).toHaveBeenCalledWith(fakeBootcampId);
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });

    it("should update and return the bootcamp if user is authorized", async () => {
      // 1. Arrange
      const fakeBootcampId = "bootcamp123";
      const fakeUserId = "real_owner_id";
      const fakeUserRole = "user";
      const fakeUpdateData = { title: "New Awesome Title" };

      const fakeExistingBootcamp = {
        _id: fakeBootcampId,
        instructor: fakeUserId,
      };
      const fakeUpdatedBootcamp = {
        ...fakeExistingBootcamp,
        ...fakeUpdateData,
      };

      const findByIdSpy = vi
        .spyOn(Bootcamp, "findById")
        .mockResolvedValue(fakeExistingBootcamp);

      const findByIdAndUpdateSpy = vi
        .spyOn(Bootcamp, "findByIdAndUpdate")
        .mockResolvedValue(fakeUpdatedBootcamp);

      // 2. Act
      const actual = await bootcampService.updateBootcamp(
        fakeBootcampId,
        fakeUpdateData,
        fakeUserId,
        fakeUserRole,
      );

      // 3. Assert
      expect(actual).toEqual(fakeUpdatedBootcamp);
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
      expect(findByIdSpy).toHaveBeenCalledWith(fakeBootcampId);
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(
        fakeBootcampId,
        fakeUpdateData,
        {
          new: true,
          runValidators: true,
        },
      );
    });
  });

  describe("uploadBootcampImage", () => {
    it("should throw an AppError if bootcamp is not found", async () => {
      // 1. Arrange
      const fakeBootcampId = "invalid_bootcamp_id";
      const fakeUserId = "user123";
      const fakeUserRole = "user";
      const fakeUpdateData = { title: "updated-bootcamp" };
      const findByIdSpy = vi
        .spyOn(Bootcamp, "findById")
        .mockResolvedValue(null);
      // 2. Act & 3. Assert
      await expect(
        bootcampService.updateBootcamp(
          fakeBootcampId,
          fakeUpdateData,
          fakeUserId,
          fakeUserRole,
        ),
      ).rejects.toThrow(`Bootcamp not found with id of ${fakeBootcampId}`);

      expect(findByIdSpy).toHaveBeenCalledWith(fakeBootcampId);
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });

    it("should throw an AppError if user is not authorized", async () => {
      // 1. Arrange
      const fakeBootcampId = "bootcampId-123";
      const fakeUserId = "user123";
      const fakeUserRole = "user";
      const fakeUpdateData = { title: "updated-bootcamp" };
      const fakeExistingBootcamp = {
        _id: fakeBootcampId,
        instructor: "real_owner_id",
      };

      const findByIdSpy = vi
        .spyOn(Bootcamp, "findById")
        .mockResolvedValue(fakeExistingBootcamp);
      // 2. Act & 3. Assert

      await expect(
        bootcampService.updateBootcamp(
          fakeBootcampId,
          fakeUpdateData,
          fakeUserId,
          fakeUserRole,
        ),
      ).rejects.toThrow("User not authorized to update this bootcamp");

      expect(findByIdSpy).toHaveBeenCalledWith(fakeBootcampId);
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });

    it("should upload image and save, without deleting old photo if it's no-photo.jpg", async () => {
      // این رو تو قدم بعدی با هم می‌نویسیم!
    });

    it("should delete old photo and save new image if old photo exists", async () => {
      // این غولِ آخر رو هم با هم می‌نویسیم!
    });
  });
});
