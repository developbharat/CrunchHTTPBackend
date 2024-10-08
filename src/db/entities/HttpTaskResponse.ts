import { BaseEntity, Column, CreateDateColumn, Entity, In, UpdateDateColumn } from "typeorm";
import { CustomIDColumn } from "../columns/CustomIDColumn";
import { CustomRelIDColumn } from "../columns/CustomRelIDColumn";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { HttpTaskStatus } from "../enums/HttpTaskStatus";
import { HttpTask } from "./HttpTask";
import { parseJson } from "../../common/utils";

@ObjectType()
@Entity({ name: "http_task_responses" })
export class HttpTaskResponse extends BaseEntity {
  @Field(() => ID)
  @CustomIDColumn()
  id: string;

  @Field(() => String)
  @Column({
    name: "headers",
    type: "jsonb",
    default: {},
    nullable: false,
    transformer: {
      from: (data: Record<string, string>) => JSON.stringify(data),
      to: (value: string | Record<string, string>) =>
        typeof value === "string" ? parseJson(value, {}) : value,
    },
  })
  headers: string;

  @Field(() => String, { nullable: true })
  @Column({ name: "data", type: "text", nullable: true })
  data: string | null;

  @Field(() => String)
  @Column({ name: "status", type: "text", default: "", nullable: false })
  status: string;

  @Field(() => Int)
  @Column({ name: "status_code", type: "integer", nullable: false })
  status_code: number;

  @Field(() => Boolean)
  @Column({ name: "is_success", type: "boolean", nullable: false })
  is_success: boolean;

  @CustomRelIDColumn({ name: "task_id", unique: true })
  task_id: string;

  @CustomRelIDColumn({ name: "device_id" })
  device_id: string;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  public static async submit(
    data: Pick<
      HttpTaskResponse,
      "headers" | "data" | "status" | "status_code" | "is_success" | "task_id" | "device_id"
    >[],
  ): Promise<string[]> {
    if (data.length === 0) return [];

    const inserts = await this.createQueryBuilder()
      .useTransaction(true)
      .insert()
      .orIgnore()
      .values(data)
      .returning("id")
      .execute();
    await HttpTask.update(
      data.map((item) => item.task_id),
      { status: HttpTaskStatus.COMPLETED },
    );

    return inserts.identifiers.filter(Boolean).map((item) => item.id);
  }
}
