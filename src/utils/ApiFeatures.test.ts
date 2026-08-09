import { describe, it, expect, Mock, vi, beforeEach, afterEach } from "vitest";
import { ApiFeatures } from "./ApiFeatures.js";

describe("ApiFeatures class", () => {
  let mockQuery: any;

  beforeEach(() => {
    mockQuery = {
      find: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    };
  });
  const makeSut = (queryString: any = {}) => {
    return new ApiFeatures(mockQuery, queryString);
  };

  describe("filter method", () => {
    it("should call find with empty object if queryString is empty", () => {
      const queryString = {};
      const features = makeSut(queryString);
      //   act
      features.filter();

      expect(mockQuery.find).toHaveBeenCalledWith({});
    });
    it("should remove excluded fields and format advanced filters (gt, gte, etc.)", () => {
      // arrange
      const queryString = {
        name: "bootcamp",
        page: "2",
        sort: "-price",
        price: { gte: "1000", lte: "5000" },
      };

      const features = makeSut(queryString);

      //   act
      features.filter();

      //   asert
      expect(mockQuery.find).toHaveBeenCalledWith({
        name: "bootcamp",
        price: { $gte: "1000", $lte: "5000" },
      });
    });
    it("should handle simple equality filters without advanced operators", () => {
      const queryString = { role: "admin", isActive: "true" };

      const features = makeSut(queryString);

      features.filter();

      expect(mockQuery.find).toHaveBeenCalledWith({
        role: "admin",
        isActive: "true",
      });
    });
    it("should return the ApiFeatures instance to allow method chaining", () => {
      // Arrange
      const queryString = { name: "bootcamp" };
      const features = makeSut(queryString);
      // Act
      const result = features.filter();
      // Assert
      expect(result).toStrictEqual(features);
    });
  });

  describe("select method", () => {
    it("should select specific fields if 'select' is provided in queryString", () => {
      // 1. Arrange
      const queryString = { select: "name,price" };
      const features = makeSut(queryString);
      // 2. Act
      features.select();
      // 3. Assert
      expect(mockQuery.select).toHaveBeenCalledWith("name price");
    });

    it("should exclude '__v' by default if no 'select' is provided", () => {
      // 1. Arrange
      // راهنمایی: اینجا SUT رو با یک آبجکت خالی {} بساز
      const queryString = {};
      const features = makeSut(queryString);
      // 2. Act
      features.select();
      // 3. Assert
      expect(mockQuery.select).toHaveBeenCalledWith("-__v");
    });
  });
  describe("sort method", () => {
    it("should sort specific fields if 'sort' is provided in queryString", () => {
      // 1. Arrange
      const queryString = { sort: "price" };
      const features = makeSut(queryString);
      // 2. Act
      features.sort();
      // 3. Assert
      expect(mockQuery.sort).toHaveBeenCalledWith("price");
    });

    it("should replace commas with spaces if multiple 'sort' fields are provided", () => {
      const queryString = { sort: "price,ratingsAverage" };
      const features = makeSut(queryString);
      // 2. Act
      features.sort();
      // 3. Assert
      expect(mockQuery.sort).toHaveBeenCalledWith("price ratingsAverage");
    });

    it("should exclude '-createdAt' by default if no 'sort' is provided", () => {
      // 1. Arrange
      const queryString = {};
      const features = makeSut(queryString);
      // 2. Act
      features.sort();
      // 3. Assert
      expect(mockQuery.sort).toHaveBeenCalledWith("-createdAt");
    });
  });

  describe("paginate method", () => {
    it("should paginate with default values if page and limit are not provided", () => {
      // 1. Arrange
      // راهنمایی: queryString رو خالی بذار
      // 2. Act
      // راهنمایی: متد paginate رو صدا بزن
      // 3. Assert
      // راهنمایی: اینجا دو تا expect نیاز داریم
      // اولی چک کنه mockQuery.skip با عدد 0 صدا زده شده
      // دومی چک کنه mockQuery.limit با عدد 100 صدا زده شده
    });

    it("should calculate skip correctly based on provided page and limit", () => {
      // 1. Arrange
      // راهنمایی: queryString باید page: "3" و limit: "10" داشته باشه (دقت کن از URL رشته میان)
      // 2. Act
      // 3. Assert
      // اولی چک کنه mockQuery.skip با عدد 20 صدا زده شده
      // دومی چک کنه mockQuery.limit با عدد 10 صدا زده شده
    });
  });
});
