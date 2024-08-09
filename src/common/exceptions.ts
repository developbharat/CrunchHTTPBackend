import { GraphQLError } from "graphql";

export class ServiceException extends GraphQLError {
  constructor(public content: string, public code: number = 500) {
    super(content);
  }
}
