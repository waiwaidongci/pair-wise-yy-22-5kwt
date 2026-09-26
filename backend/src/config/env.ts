import path from "node:path";

export const config = {
  port: Number(process.env.PORT ?? 3000),
  dbHost: process.env.DB_HOST ?? "localhost",
  dataDir: process.env.DATA_DIR ?? path.join(process.cwd(), "data")
};
