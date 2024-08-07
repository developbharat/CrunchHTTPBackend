export const env = {
  host: process.env.HOST || "127.0.0.1",
  port: Number(process.env.PORT) || 3000,
  isProduction: process.env.NODE_ENV === "production",
  dbUrl: process.env.DB_URL || "",
};
