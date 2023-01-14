import { ErrorRequestHandler } from "express";
import ErrorHandler from "../exceptions/test";

const handleError: ErrorRequestHandler = (err, _, res, __) => {
  console.log(err);

  ErrorHandler.handleError(err, res);
};

export default handleError;
