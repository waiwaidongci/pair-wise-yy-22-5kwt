# 文物修复档案协作平台

面向博物馆修复团队的文物病害记录、修复方案、影像版本和审批归档平台。

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
- `DATA_DIR`: 后端影像档案落盘目录，容器内默认 `/app/data`

## 影像对照档案（/images）

- 上传影像时需选择文物、修复方案和部位，并记录阶段（术前/术后）、拍摄时间和说明；同一部位可多次上传，每次生成新版本（如 `PRE-V2`），旧照片保留不删。
- 只有术前和术后都配齐的部位才能归档；缺一侧的部位留在“待配区”，并列出缺口（缺术前/缺术后）。
- 影像记录由后端写入 `DATA_DIR/image-versions.json`（Compose 下为命名卷 `backend_data`），服务重启后记录仍可读回。
- 相关接口：`GET /api/image-version`、`GET /api/image-version/pairs`、`POST /api/image-version`、`POST /api/image-version/archive`（未配齐时返回 `IMAGE_PAIR_INCOMPLETE`）。

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: relic-restore`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-relic-restore}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 后端影像档案记录使用命名卷 `backend_data`（挂载到 `/app/data`），重启不丢。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- RelicCondition: constants/RelicCondition、types/RelicCondition、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- PlanApprovalStatus: constants/PlanApprovalStatus、types/PlanApprovalStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- DamageSeverity: constants/DamageSeverity、types/DamageSeverity、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- ImageStage: constants/ImageStage（前后端）、types/ImageVersion、constructors/ImageVersion*、logTemplates、errorMessages（IMAGE_PAIR_INCOMPLETE）、utils/formatters（formatStage/formatGap）、statusText、影像页筛选与 ImageCompare 展示组件均有引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
