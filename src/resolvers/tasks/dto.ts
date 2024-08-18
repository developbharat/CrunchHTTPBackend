import { Field, ID, InputType, Int } from "type-graphql";
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

@InputType()
export class ListUserAccountTasksInput {
  @Field(() => ID, { nullable: true })
  latest_task_id: string | null;

  // TODO: limit this field to max value of 1000
  @Field(() => Int, { defaultValue: 1000 })
  limit: number;
}

@InputType()
export class SubmitHttpTaskResultInput {
  @Field(() => ID)
  task_id: string;

  @Field(() => String)
  data: string;

  @Field(() => String, {
    description:
      "A stringified JSON object with (Key: String) and (Value: String). Ex: {'accepts': 'application/json'}",
  })
  headers: string;

  @Field(() => Boolean)
  is_success: boolean;

  @Field(() => String)
  status: string;

  @Field(() => Int)
  status_code: number;
}
