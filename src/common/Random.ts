import { customAlphabet, nanoid } from "nanoid";

const ALPHABETS = "ABCDEFGHIJLKMNOPQRSTUVWXYZ";
const DIGITS = "01234567890";

export const Random = {
  authToken(): string {
    return customAlphabet(ALPHABETS.toLowerCase() + ALPHABETS.toUpperCase() + DIGITS, 10)();
  },

  createText(count: number): string {
    return nanoid(count);
  },
};
