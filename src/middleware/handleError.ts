import { ErrorRequestHandler } from "express";
import { errorHandler } from "../exceptions/ErrorHandler";

const handleError: ErrorRequestHandler = (err, _, res, __) => {
  console.log(err);

  errorHandler.handleError(err, res);
};

export default handleError;
