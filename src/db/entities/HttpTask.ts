import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { CustomIDColumn } from "../columns/CustomIDColumn";
import { CustomRelIDColumn } from "../columns/CustomRelIDColumn";
import { HttpTaskMethod } from "../enums/HttpTaskMethod";
import { HttpTaskStatus } from "../enums/HttpTaskStatus";
import { Field, ID, Int, ObjectType } from "type-graphql";

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
  @Column({ name: "headers", type: "jsonb", default: {}, nullable: false })
  headers: Record<string, string>;

  @Field(() => String)
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

  @Field(() => Date)
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

  @Field(() => ID)
  @CustomRelIDColumn({ name: "device_id" })
  device_id: string;

  @Field(() => Date)
  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  public clean(): HttpTask {
    return {
      id: this.id,
      method: this.method,
      path: this.path,
      headers: this.headers,
      data: this.data,
    } as HttpTask;
  }

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
      | "device_id"
    >,
  ): Promise<HttpTask> {
    const request = await this.create({
      method: data.method,
      path: data.path,
      headers: data.headers,
      success_status_codes: data.success_status_codes,
      max_retries: data.max_retries,
      expires_at: data.expires_at,
      device_id: data.device_id,
    }).save();

    return request.clean();
  }
}
