import { PrimaryGeneratedColumn } from 'typeorm'
import { encode_decode_id_col } from '../transforms/encode_decode_id_col'

export const CustomIDColumn = (): PropertyDecorator => {
  return PrimaryGeneratedColumn("identity", { name: "id", type: "bigint", transformer: encode_decode_id_col } as any)
}

