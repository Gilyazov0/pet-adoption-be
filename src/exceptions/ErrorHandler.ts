import {
  PrismaClientRustPanicError,
  PrismaClientValidationError,
} from "@prisma/client/runtime";
import { Response } from "express";
import { AppError, HttpCode } from "./AppError";

class ErrorHandler {
  public handleError(error: Error | AppError, response?: Response): void {
    error = this.handlePrismaError(error);
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as AppError, response);
    } else {
      this.handleCriticalError(error, response);
    }
  }

  private handleTrustedError(error: AppError, response: Response): void {
    response.status(error.httpCode).json({ message: error.message });
  }

  private handleCriticalError(
    error: Error | AppError,
    response?: Response
  ): void {
    if (response) {
      response
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }

    console.log("Application encountered a critical error. Exiting");
    process.exit(1);
  }

  private isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }

  private handlePrismaError(err: Error) {
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
}

export const errorHandler = new ErrorHandler();
