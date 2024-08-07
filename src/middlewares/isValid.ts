import { NextFunction, Request, Response } from "express";
import Validator, { ValidationRule } from "fastest-validator";
import { ServiceException } from "../common/exceptions";

type IAliases = "id" | "mobile";

const v = new Validator({
  haltOnFirstError: true,
  aliases: {
    id: {
      type: "string",
      min: 10,
      max: 10,
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z0-9]{10}$/,
      messages: {
        stringPattern: "Invalid id provided.",
        stringMin: "Invalid id provided.",
        stringMax: "Invalid id provided.",
      },
    },
    mobile: {
      type: "string",
      min: 10,
      max: 10,
      pattern: /^[6-9]\d{9}$/,
      messages: {
        stringPattern: "Invalid mobile provided. It must be valid indian mobile no with 10 digits",
      },
    },
  },
});

export const isValid = (
  schema: Record<string, IAliases> | Record<string, string> | Record<string, ValidationRule>,
  prop: "params" | "body" | "query",
) => {
  const check = v.compile(schema);
  return (req: Request, _res: Response, next: NextFunction) => {
    const isValid: any = check(req[prop]);

    if (typeof isValid === "boolean" && isValid === true) return next();
    const exception = isValid.shift()!;
    return next(new ServiceException(`Invalid ${prop} Provided: ${exception.message}`, 400));
  };
};
