# 文物修复档案协作平台

面向博物馆修复团队的文物病害记录、修复方案、**影像对照档案**和审批归档平台。

## 影像对照档案（/images）

评审最关心“同一部位是否配齐”，影像页按「文物 · 修复方案 · 部位」把照片聚成对照组：

- 上传时选择**文物、方案、部位**，并记录**阶段（术前 PRE_OP / 术后 POST_OP）、拍摄时间、说明**和影像文件。
- **同一部位可保留多版**：补传只追加新版本（版次自动 +1），旧照片不删除、可随时回看。
- **只有术前、术后都有影像的部位才能归档**；缺一侧的部位停留在「待配区」，并在缺口清单中列出“缺术前影像 / 缺术后影像”。
- 已归档组若补传新版本，会自动退回待配区重新评审；归档时旧版本一并保留。
- 记录与上传文件写入后端持久化目录（Docker 下为命名卷 `backend_data` 挂载到 `/app/data`），**服务重启后记录和照片都能读回**。
- 写操作（首次上传、补传、归档、滞留待配）会落 `data/audit.log` 审计日志。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20110>

后端健康检查：<http://localhost:21110/health>


## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Ant Design + Zustand |
| 后端 | NestJS + TypeScript + Prisma |
| 数据库 | PostgreSQL 15 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `relic-restore`
- `FRONTEND_PORT`: 前端端口，默认 `20110`
- `BACKEND_PORT`: 后端端口，默认 `21110`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据
- `UPLOAD_MAX_BYTES`: 单张上传影像大小上限（字节），默认 10MB
- `DATA_DIR`: 后端运行时持久化目录（store.json / uploads / audit.log），容器内固定 `/app/data`，由命名卷 `backend_data` 承载

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: relic-restore`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-relic-restore}` 前缀。
- 数据库使用命名卷 `db_data`，避免绑定中文路径。
- 影像记录与上传文件使用命名卷 `backend_data`（挂载到后端 `/app/data`），`docker compose restart`、`docker compose down && up -d` 后影像档案均不丢失；如需清空档案需显式 `docker compose down -v`。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- RelicCondition: constants/RelicCondition、types/RelicCondition、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- PlanApprovalStatus: constants/PlanApprovalStatus、types/PlanApprovalStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- DamageSeverity: constants/DamageSeverity、types/DamageSeverity、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- ImageStage（PRE_OP 术前 / POST_OP 术后）：
  - 后端：`src/constants/ImageStage.ts`（枚举+类型守卫）、`src/models/ImageVersion.ts`、`src/types/ImageVersionPayload.ts`、`src/repositories/ImageVersionRepository.ts`、`src/utils/ImageVersionGrouper.ts`（缺口判断）、`src/services/ImageVersionService.ts`、`src/constructors/ImageVersionDtoFactory.ts`、`src/seed.ts`、`database/init.sql`（CHECK 约束）。
  - 前端：`src/constants/ImageStage.ts`（枚举+文案+缺口文案）、`src/types/ImageStage.ts`、`src/types/ImageVersion.ts`、`src/constructors/ImageVersionConstructor.ts`、`src/components/common/StageBadge.tsx`、`src/components/common/ImageCompare.tsx`、`src/components/image/UploadImagePanel.tsx`、`src/components/image/ImageGroupCard.tsx`、`src/hooks/useImageVersionCompare.ts`、`src/utils/imageGrouper.ts`、`src/utils/formatters.ts`（formatImageStage）、`src/mocks/seedData.ts`。
- ArchiveStatus（PENDING 待配 / ARCHIVED 已归档；分组另有 READY 可归档）：
  - 后端：`src/constants/ArchiveStatus.ts`、`src/models/ImageVersion.ts`、`src/repositories/ImageVersionRepository.ts`、`src/utils/ImageVersionGrouper.ts`、`src/services/ImageVersionService.ts`、`src/seed.ts`、`database/init.sql`。
  - 前端：`src/constants/ArchiveStatus.ts`、`src/types/ImageVersion.ts`、`src/stores/ImageVersionStore.ts`、`src/pages/ImagesPage.tsx`、`src/components/image/ImageGroupCard.tsx`、`src/utils/formatters.ts`（formatArchiveStatus）、`src/components/common/StatusBadge.tsx`（READY_TO_ARCHIVE / WAIT_MATCH / ARCHIVED 展示）。
- 影像相关错误码（前后端各一份）：`IMAGE_FILE_REQUIRED`、`IMAGE_SIDE_MISSING`、`IMAGE_GROUP_NOT_FOUND`、`IMAGE_GROUP_ALREADY_ARCHIVED`，分别位于两侧 `constants/errorCodes.ts` 与 `constants/errorMessages.ts`，由 `utils/AppError`（后端）和 API 读响应（前端）消费。
- 影像日志模板：`ImageVersion.upload / versionAdd / archive / export / gapPending`（后端 `constants/logTemplates.ts`）与“首次上传/补传/归档/导出/滞留待配”（前端同名文件）。

## 影像对照档案接口

| 方法与路径 | 说明 |
|---|---|
| `GET /api/image-version` | 全部影像版本（含部位、阶段、版次、归档状态） |
| `GET /api/image-version/groups` | 按部位分组：`archived` 已归档、`ready` 可归档、`pending` 待配、`gap_list` 缺口清单 |
| `GET /api/image-version/stages` | 阶段枚举 PRE_OP / POST_OP |
| `POST /api/image-version` | `multipart/form-data` 上传/补传：relic_id、plan_id、position、stage、capture_at、note、file；自动编版次，旧版保留 |
| `POST /api/image-version/archive` | 按 relic_id + plan_id + position 归档；缺术前或术后返回 `400 IMAGE_SIDE_MISSING` 并在消息中列出缺口 |
| `GET /uploads/<file>` | 上传影像静态访问，随持久化卷保存 |

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
