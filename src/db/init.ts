import { MainDataSource } from "./data-source";

export const connect_db = async (): Promise<void> => {
  await MainDataSource.initialize();
  console.log("Database connected successfully.");
};

export const disconnect_db = async (): Promise<void> => {
  await MainDataSource.destroy();
  console.log("Database disconnected successfully.");
};
