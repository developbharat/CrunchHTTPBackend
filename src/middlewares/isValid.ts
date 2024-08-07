import { NextFunction, Request, Response } from "express";
import { ServiceException } from "../common/exceptions";
import Validator from "fastest-validator";

type IAliases = "id" | "mobile" | "email";

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
    email: {
      type: "string",
      min: 10,
      max: 50,
      pattern:
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      messages: {
        stringPattern: "Invalid email provided. It must be valid email",
      },
    },
  },
});

export const isValid = (
  schema: Record<string, IAliases> | Record<string, string>,
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
