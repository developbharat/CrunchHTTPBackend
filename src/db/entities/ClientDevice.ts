import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  IsNull,
  UpdateDateColumn,
} from "typeorm";
import { Random } from "../../common/Random";
import { CustomIDColumn } from "../columns/CustomIDColumn";
import { ServiceException } from "../../common/exceptions";

@Entity({ name: "clients" })
export class ClientDevice extends BaseEntity {
  @CustomIDColumn()
  id: string;

  @Column({ name: "description", type: "text", nullable: false })
  description: string;

  @Column({ name: "auth_token", length: 10, nullable: false, unique: true })
  auth_token: string;

  @Column({ name: "blocked_at", type: "timestamp", nullable: true })
  blocked_at: Date | null;

  @Column({ name: "blocked_status", type: "text", nullable: true })
  blocked_status: string | null;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  @BeforeInsert()
  setAuthToken() {
    this.auth_token = Random.authToken();
  }

  public clean(): ClientDevice {
    return {
      id: this.id,
      description: this.description,
      blocked_at: this.blocked_at,
      blocked_status: this.blocked_status,
      created_at: this.created_at,
    } as ClientDevice;
  }

  public static async isAuthTokenValid(auth_token: string, clean: boolean = true) {
    const device = await this.findOne({ where: { auth_token: auth_token, blocked_at: IsNull() } });

    if (!device) throw new ServiceException("Invalid Authorization token provided. ", 400);

    return clean ? device.clean() : device;
  }
}
