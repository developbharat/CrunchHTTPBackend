import { Column, ColumnOptions } from 'typeorm'
import { encode_decode_id_col } from '../transforms/encode_decode_id_col'

export const CustomRelIDColumn = (options: Omit<ColumnOptions, "type" | "transformer">): PropertyDecorator => {
  return Column({ ...options, type: 'bigint', transformer: encode_decode_id_col })
}
