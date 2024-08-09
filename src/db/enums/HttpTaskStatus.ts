import { registerEnumType } from "type-graphql";

export enum HttpTaskStatus {
  CREATED = "CREATED",
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
}

registerEnumType(HttpTaskStatus, { name: "HttpTaskStatus" });
