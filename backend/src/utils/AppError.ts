import { ERROR_CODES, type ErrorCode } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

/** Service 层抛出的业务异常，由 errorHandlerMiddleware 统一转成响应。 */
export class AppError extends Error {
  status: number;
  code: ErrorCode;

  constructor(code: ErrorCode, status = 400, message?: string) {
    super(message ?? ERROR_MESSAGES[code]);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

export const badRequest = (code: ErrorCode, message?: string) => new AppError(code, 400, message);
export const notFound = (code: ErrorCode, message?: string) => new AppError(code, 404, message);
export { ERROR_CODES };
