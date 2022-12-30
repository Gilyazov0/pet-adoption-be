import { ErrorRequestHandler } from "express";
import { errorHandler } from "../exceptions/ErrorHandler";

const handleError: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);

  errorHandler.handleError(err, res);
};

export default handleError;
