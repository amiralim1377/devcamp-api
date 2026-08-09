export enum AppCodes {
  // موفقیت‌آمیز
  SUCCESS = "SUCCESS",

  // خطاهای عمومی
  INVALID_INPUT = "ERR_GEN_001",
  ROUTE_NOT_FOUND = "ERR_GEN_002",
  INTERNAL_SERVER_ERROR = "ERR_GEN_500",

  // (Auth) خطاهای احراز هویت و دسترسی
  UNAUTHORIZED_ACCESS = "ERR_AUTH_001",
  INVALID_CREDENTIALS = "ERR_AUTH_002",
  TOKEN_EXPIRED = "ERR_AUTH_003",
  USER_NOT_FOUND = "ERR_AUTH_004",
  FORBIDDEN_ACCESS = "ERR_AUTH_005",

  // خطاهای بوت‌کمپ و دوره‌ها
  BOOTCAMP_NOT_FOUND = "ERR_BOOTCAMP_001",
  COURSE_NOT_FOUND = "ERR_COURSE_001",

  // خطاهای نظرات (Reviews)
  REVIEW_NOT_FOUND = "ERR_REVIEW_001",
}
