import path from "path";

export const config = {
  port: Number(process.env.PORT ?? 3000),
  dbHost: process.env.DB_HOST ?? "localhost",
  /** 影像/实体记录与上传文件的持久化目录，Docker 下由命名卷挂载，重启不丢。 */
  dataDir: process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.resolve(process.cwd(), "data"),
  /** 单张上传影像大小上限（字节），默认 10MB。 */
  uploadMaxBytes: Number(process.env.UPLOAD_MAX_BYTES ?? 10 * 1024 * 1024)
};
