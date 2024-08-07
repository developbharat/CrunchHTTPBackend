import { ValueTransformer } from "typeorm";
import Sqids from 'sqids';

const sqids = new Sqids({ minLength: 10, alphabet: "6cq7UNpuZlYvVatsFyhMm9DL08b1WSOE5o4XA2JrHgeGRCK3IPBznkdiTQwjfx" });

export const encode_decode_id_col: ValueTransformer = {
  from: (dbval?: string) => !!dbval ? sqids.encode(dbval.split('').map(i => parseInt(i))) : dbval,
  to: (val?: string) => !!val ? BigInt(sqids.decode(val).join("")) : val
}
