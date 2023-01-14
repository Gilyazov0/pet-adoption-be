import {
  PrismaClientRustPanicError,
  PrismaClientValidationError,
} from "@prisma/client/runtime";
import { Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { MulterError } from "multer";
import { AppError, HttpCode } from "./AppError";
import handleExit from "./exitHandler";

export default class ErrorHandler {
  public static handleError(
    error: Error | AppError,
    response?: Response
  ): void {
    error = this.handlePrismaError(error);
    error = this.handleJsonWebTokenError(error);
    error = this.handleMulterError(error);
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as AppError, response);
    } else {
      this.handleCriticalError(error, response);
    }
  }

  private static handleTrustedError(error: AppError, response: Response): void {
    response.status(error.httpCode).json({ message: error.message });
  }

  private static handleCriticalError(
    error: Error | AppError,
    response?: Response
  ): void {
    if (response) {
      response
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }

    console.log("Application encountered a critical error. Exiting");
    handleExit(1);
  }

  private static isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }

  private static handlePrismaError(err: Error) {
    switch (err.constructor) {
      case PrismaClientRustPanicError:
        return new AppError({
          description: err.message,
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
          isOperational: false,
        });
      case PrismaClientValidationError:
        return new AppError({
          description: "Invalid request data",
          httpCode: HttpCode.BAD_REQUEST,
        });
      default:
        return err;
    }
  }

  private static handleJsonWebTokenError(err: any) {
    if (err instanceof TokenExpiredError) {
      return new AppError({
        description: "Token expired",
        httpCode: HttpCode.BAD_REQUEST,
      });
    }
    if (err instanceof JsonWebTokenError) {
      return new AppError({
        description: "JWT: Bad token",
        httpCode: HttpCode.BAD_REQUEST,
      });
    }
    return err;
  }

  private static handleMulterError(err: any) {
    if (err instanceof MulterError && err.code === "LIMIT_UNEXPECTED_FILE") {
      return new AppError({
        description: "Bad file",
        httpCode: HttpCode.BAD_REQUEST,
      });
    }
    return err;
  }
}
