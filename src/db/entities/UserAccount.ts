import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  MoreThan,
  UpdateDateColumn,
} from "typeorm";
import { DateTime } from "../../common/DateTime";
import { ServiceException } from "../../common/exceptions";
import { Random } from "../../common/Random";
import { CustomIDColumn } from "../columns/CustomIDColumn";
import argon2 from "argon2";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
@Entity({ name: "user_accounts" })
export class UserAccount extends BaseEntity {
  @Field(() => ID)
  @CustomIDColumn()
  id: string;

  @Field(() => String)
  @Column({ name: "name", length: 50, nullable: false, default: "" })
  name: string;

  @Field(() => String)
  @Column({ name: "email", length: 50, nullable: false, unique: true })
  email: string;

  @Column({ name: "password", type: "text", nullable: false })
  password: string;

  @Field(() => String)
  @Column({ name: "auth_token", length: 10, nullable: false, unique: true })
  auth_token: string;

  @Column({
    name: "auth_token_expires_at",
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  auth_token_expires_at: Date;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  @BeforeInsert()
  setAuthToken() {
    this.auth_token = Random.authToken();
  }

  @BeforeInsert()
  async encodePassword() {
    this.password = await argon2.hash(this.password);
  }

  public static async isAuthTokenValid(auth_token: string): Promise<UserAccount> {
    const device = await this.findOne({
      where: { auth_token: auth_token, auth_token_expires_at: MoreThan(new DateTime()) },
    });

    if (!device) throw new ServiceException("Invalid Authorization token provided. ", 400);

    return device;
  }

  public static async signUp(
    data: Pick<UserAccount, "name" | "email" | "password">,
  ): Promise<UserAccount> {
    // check if account exists
    const exists = await this.findOne({ where: { email: data.email }, select: { id: true } });
    if (!!exists) throw new ServiceException("User acccount already exists.");

    // create new account
    const account = await this.create({
      name: data.name,
      email: data.email,
      password: data.password,
    }).save();
    return account;
  }

  private static async isPasswordValid(encoded: string, plain: string): Promise<Boolean> {
    return await argon2.verify(encoded, plain);
  }

  public static async signIn(data: Pick<UserAccount, "email" | "password">): Promise<UserAccount> {
    const old = await this.findOne({ where: { email: data.email } });
    if (!old || !this.isPasswordValid(old.password, data.password))
      throw new ServiceException("Invalid password provided.");

    // Return old account if auth token is still valid
    if (new DateTime().isLessThan(old.auth_token_expires_at)) return old;

    // Update auth token
    const updated = await this.save({
      id: old.id,
      auth_token: Random.authToken(),
      auth_token_expires_at: new DateTime().addHours(12),
    });

    // fetch updated data
    return updated;
  }
}
