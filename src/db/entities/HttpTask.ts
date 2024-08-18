import { Field, ID, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, LessThan, UpdateDateColumn } from "typeorm";
import { DateTime } from "../../common/DateTime";
import { CustomIDColumn } from "../columns/CustomIDColumn";
import { CustomRelIDColumn } from "../columns/CustomRelIDColumn";
import { HttpTaskMethod } from "../enums/HttpTaskMethod";
import { HttpTaskStatus } from "../enums/HttpTaskStatus";

@ObjectType()
@Entity({ name: "http_tasks" })
export class HttpTask extends BaseEntity {
  @Field(() => ID)
  @CustomIDColumn()
  id: string;

  @Field(() => HttpTaskMethod)
  @Column({ name: "method", type: "enum", enum: HttpTaskMethod, nullable: false })
  method: HttpTaskMethod;

  @Field(() => String)
  @Column({ name: "path", length: 1000, nullable: false })
  path: string;

  @Field(() => String)
  @Column({
    name: "headers",
    type: "jsonb",
    default: {},
    nullable: false,
    transformer: {
      from: (data: Record<string, string>) => JSON.stringify(data),
      to: (value: string | Record<string, string>) =>
        typeof value === "string" ? JSON.parse(value) : value,
    },
  })
  headers: string;

  @Field(() => String, { nullable: true })
  @Column({ name: "data", type: "text", nullable: true })
  data: string | null;

  /**
   * Data to check http request state: (Success, Failed, Should Retry)
   */
  @Field(() => [Int])
  @Column("integer", {
    name: "success_status_codes",
    array: true,
    default: [200],
    nullable: false,
  })
  success_status_codes: number[];

  @Field(() => Int)
  @Column({ name: "max_retries", type: "integer", default: 5, nullable: false })
  max_retries: number;

  @Field(() => Date, { nullable: true })
  @Column({ name: "expires_at", type: "timestamp", nullable: true })
  expires_at: Date | null;

  @Field(() => HttpTaskStatus)
  @Column({
    name: "status",
    type: "enum",
    enum: HttpTaskStatus,
    default: HttpTaskStatus.CREATED,
  })
  status: HttpTaskStatus;

  @CustomRelIDColumn({ name: "user_account_id" })
  user_account_id: string;

  @CustomRelIDColumn({ name: "device_id", nullable: true })
  device_id: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  public static async createNewRequest(
    data: Pick<
      HttpTask,
      | "method"
      | "path"
      | "headers"
      | "data"
      | "success_status_codes"
      | "max_retries"
      | "expires_at"
      | "user_account_id"
    >,
  ): Promise<HttpTask> {
    const request = await this.create({
      method: data.method,
      path: data.path,
      headers: data.headers,
      data: data.data,
      success_status_codes: data.success_status_codes,
      max_retries: data.max_retries,
      expires_at: data.expires_at,
      user_account_id: data.user_account_id,
    }).save();

    return request;
  }

  public static async resetFrozenTasksFromMinutes(minutes: number): Promise<void> {
    await this.update(
      {
        status: HttpTaskStatus.IN_PROGRESS,
        updated_at: LessThan(new DateTime().subtractMinutes(minutes)),
      },
      { device_id: null, status: HttpTaskStatus.CREATED },
    );
  }
}
