import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { CustomIDColumn } from "../columns/CustomIDColumn";
import { CustomRelIDColumn } from "../columns/CustomRelIDColumn";

@Entity({ name: "http_responses" })
export class HttpResponse extends BaseEntity {
  @CustomIDColumn()
  id: string;

  @Column({ name: "headers", type: "jsonb", default: {}, nullable: false })
  headers: string;

  @Column({ name: "data", type: "bytea", nullable: true })
  data: Buffer;

  @Column({ name: "status", type: "text", default: "", nullable: false })
  status: string;

  @Column({ name: "status_code", type: "integer", nullable: false })
  status_code: number;

  @Column({ name: "is_success", type: "boolean", nullable: false })
  is_success: number;

  @CustomRelIDColumn({ name: "http_request_id" })
  http_request_id: string;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  public clean(): HttpResponse {
    return {
      id: this.id,
      headers: this.headers,
      data: this.data,
      status: this.status,
      status_code: this.status_code,
      is_success: this.is_success,
      created_at: this.created_at,
      updated_at: this.updated_at,
    } as HttpResponse;
  }
}
