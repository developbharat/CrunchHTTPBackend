import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { UserAccount } from "../../db/entities/UserAccount";
import { isUserAuthenticated } from "../../middlewares/isUserAuthenticated";
import { SigninInput, SignupInput } from "./dto";

@Resolver()
export class UserAccountResolver {
  @UseMiddleware(isUserAuthenticated())
  @Query(() => UserAccount, { name: "whoami", nullable: true })
  async whoami(@Ctx() { user_account }: IRootContext): Promise<UserAccount> {
    return user_account!!;
  }

  @Mutation(() => UserAccount)
  async createUserAccount(@Arg("data") data: SignupInput): Promise<UserAccount> {
    return await UserAccount.signUp({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  }

  @Mutation(() => UserAccount)
  async signIn(@Arg("data") data: SigninInput): Promise<UserAccount> {
    return await UserAccount.signIn({
      email: data.email,
      password: data.password,
    });
  }
}
