import { Field, InputType } from "type-graphql";

// TODO: Add validation to all types
@InputType()
export class SigninInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

@InputType()
export class SignupInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
