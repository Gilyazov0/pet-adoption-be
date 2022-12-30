import Ajv from "ajv";
import addFormats from "ajv-formats";
import { RequestHandler } from "express";
import { AppError, HttpCode } from "../exceptions/AppError";

const ajv = new Ajv();
addFormats(ajv);

export default function validateBody(schema: object): RequestHandler {
  return (req, _, next) => {
    const validate = ajv.validate(schema, req.body);
    if (validate) return next();

    throw new AppError({
      description: JSON.stringify("Not valid request body", req.body),
      httpCode: HttpCode.BAD_REQUEST,
    });
  };
}
