import { Field, InputType, Int } from "type-graphql";
import { HttpTaskMethod } from "../../db/enums/HttpTaskMethod";

@InputType()
export class CreateHttpTaskInput {
  @Field(() => String)
  path: string;

  @Field(() => HttpTaskMethod)
  method: HttpTaskMethod;

  @Field(() => String)
  data: string;

  @Field(() => Date)
  expires_at: Date;

  @Field(() => String, {
    description:
      "A stringified JSON object with (Key: String) and (Value: String). Ex: {'accepts': '*/*'}",
  })
  headers: string;

  @Field(() => Int)
  max_retries: number;

  @Field(() => [Int])
  success_status_codes: number[];
}
