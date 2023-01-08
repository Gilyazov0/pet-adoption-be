import Ajv from "ajv";
import addFormats from "ajv-formats";
import { RequestHandler } from "express";
import { AppError, HttpCode } from "../exceptions/AppError";

const ajv = new Ajv();
addFormats(ajv);

export default function validateBody(schema: object): RequestHandler {
  return (req, _, next) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);
    if (valid) return next();
    else {
      console.log(JSON.stringify(validate.errors, null, 2));
      throw new AppError({
        description: `Not valid request body`,
        httpCode: HttpCode.BAD_REQUEST,
      });
    }
  };
}
