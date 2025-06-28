import { ZodType, z } from "zod/v4";
import { RequestHandler } from "express";

const validate = (
  schema: ZodType,
  source: "body" | "params" | "query"
): RequestHandler => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req[source]);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: `Invalid ${source} schema`,
          errors: err,
        });
      } else {
        next(err);
      }
    }
  };
};

const validateRequestBody = (schema: ZodType): RequestHandler => {
  return validate(schema, "body");
};

const validateRequestParams = (schema: ZodType): RequestHandler => {
  return validate(schema, "params");
};

const validateRequestQuery = (schema: ZodType): RequestHandler => {
  return validate(schema, "query");
};

export { validateRequestBody, validateRequestParams, validateRequestQuery };
