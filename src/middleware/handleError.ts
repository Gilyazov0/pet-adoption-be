import { ErrorRequestHandler } from "express";
import { errorHandler } from "../exceptions/ErrorHandler";

const handleError: ErrorRequestHandler = (err, req, res, next) => {
  errorHandler.handleError(err, res);
};

export default handleError;
