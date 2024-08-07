import crypto from "crypto";

export const EncodeDecode = {
  encode(content: string, secret: string, iv: string): string {
    if (iv.length !== 16) {
      throw new Error("IV length must be 16 characters");
    }

    const key = crypto.createHash("sha256").update(secret).digest();
    const ivBuffer = Buffer.from(iv, "utf8");
    const cipher = crypto.createCipheriv("aes-256-gcm", key, ivBuffer);
    let encrypted = cipher.update(content, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return encrypted + authTag;
  },

  decode(content: string, secret: string, iv: string): string {
    if (iv.length !== 16) {
      throw new Error("IV length must be 16 characters");
    }

    const key = crypto.createHash("sha256").update(secret).digest();
    const ivBuffer = Buffer.from(iv, "utf8");

    // Extract encrypted text and auth tag
    const encryptedText = content.slice(0, -32); // The last 32 characters are the auth tag
    const authTag = content.slice(-32);

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, ivBuffer);
    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  },
};
