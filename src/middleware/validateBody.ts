import Ajv from "ajv";
import addFormats from "ajv-formats";
import { RequestHandler } from "express";

const ajv = new Ajv();
addFormats(ajv);

export default function validateBody(schema: object): RequestHandler {
  return (req, res, next) => {
    const validate = ajv.validate(schema, req.body);
    if (validate) return next();
    console.log("Not valid request body", req.body);
    res.status(400).send(JSON.stringify("Not valid request body", req.body));
  };
}
