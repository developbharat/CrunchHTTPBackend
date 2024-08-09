import { registerEnumType } from "type-graphql";

export enum HttpTaskMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

registerEnumType(HttpTaskMethod, { name: "HttpTaskMethod" });
