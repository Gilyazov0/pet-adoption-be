import { ErrorRequestHandler } from "express";
import test from "../exceptions/test";

const handleError: ErrorRequestHandler = (err, _, res, __) => {
  console.log(err);

  test.test(err, res);
};

export default handleError;
