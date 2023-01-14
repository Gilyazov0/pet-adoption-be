import { ErrorRequestHandler } from "express";
import { ErrorHandler } from "../exceptions/errorhandler";

const handleError: ErrorRequestHandler = (err, _, res, __) => {
  console.log(err);

  ErrorHandler.handleError(err, res);
};

export default handleError;
