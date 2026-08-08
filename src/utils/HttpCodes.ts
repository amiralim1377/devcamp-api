export enum HttpCodes {
  // === Success Responses (2xx) ===
  OK = 200, // The request succeeded (GET, PUT, PATCH)
  CREATED = 201, // A new resource was successfully created (POST - e.g., user signup or course creation)
  NO_CONTENT = 204, // The request succeeded, but there is no content to return (e.g., DELETE operations)

  // === Client Errors (4xx) ===
  BAD_REQUEST = 400, // Bad request syntax or invalid input (e.g., Zod validation errors)
  UNAUTHORIZED = 401, // User is not authenticated or token is missing/invalid
  PAYMENT_REQUIRED = 402, // (Optional - for future payment gateway integration)
  FORBIDDEN = 403, // User is authenticated but lacks necessary permissions (e.g., not an admin)
  NOT_FOUND = 404, // The requested resource could not be found (e.g., bootcamp ID not found)
  METHOD_NOT_ALLOWED = 405, // The HTTP method is not allowed for this route (e.g., using GET instead of POST)
  CONFLICT = 409, // Data conflict (e.g., duplicate email during registration)
  TOO_MANY_REQUESTS = 429, // Rate limit exceeded (user has sent too many requests)

  // === Server Errors (5xx) ===
  INTERNAL_SERVER_ERROR = 500, // Unexpected server error (e.g., database connection failure, code bug)
  NOT_IMPLEMENTED = 501, // The requested endpoint has not been implemented yet
  BAD_GATEWAY = 502, // Issue communicating with an external upstream service or proxy
  SERVICE_UNAVAILABLE = 503, // Server is temporarily down for maintenance or overloaded
}
