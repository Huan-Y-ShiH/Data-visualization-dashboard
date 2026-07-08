# 数据中心运行监控大屏

## 项目预览

![大屏预览](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20professional%20dark%20theme%20data%20center%20monitoring%20dashboard%20with%20multiple%20ECharts%20panels%20showing%20CPU%20bar%20charts%2C%20pie%20charts%20for%20server%20room%20distribution%2C%20stacked%20bar%20charts%20for%20memory%20usage%2C%20network%20traffic%20charts%2C%20disk%20IO%20gauges%2C%20and%20load%20average%20line%20charts%2C%20all%20in%20a%20sleek%20cyberpunk%20dark%20blue%20color%20scheme%20with%20neon%20cyan%20accents%2C%20KPI%20cards%20at%20the%20top&image_size=landscape_16_9)

## 两种运行方式

### 方式一：直接打开（无需数据库）

双击 `index.html` 即可在浏览器中查看大屏，使用内嵌静态数据。

### 方式二：MySQL + API 服务（完整方案）

```bash
# 1. 导入 MySQL Schema
mysql -u root -p < sql/schema.sql

# 2. 安装依赖
cd server && npm install

# 3. 导入数据（从源.dat文件加工后写入MySQL）
cd scripts && node import_data.js

# 4. 启动 API 服务
cd server && npm start

# 5. 打开 index.html
# 大屏将自动连接 http://localhost:3000 读取 MySQL 实时数据
```

## 数据库设计

| 表名 | 说明 | 行数 |
|------|------|------|
| `hosts` | 主机维表（20台） | 20 |
| `metrics` | 指标维表（55个） | 55 |
| `disk_records` | 磁盘监控明细 | ~12,000 |
| `pref_records` | 性能监控明细 | ~67,200 |
| `host_metrics_hourly` | 小时汇总视图 | VIEW |
| `host_metrics_daily` | 天汇总视图 | VIEW |

**ER 关系**：星型模型 — `disk_records` / `pref_records` 通过 `host_id` → `hosts`、`mod_code` → `metrics`

## 功能面板

| 面板 | 类型 | 说明 |
|------|------|------|
| KPI 卡片 | 统计 | 20台主机 / 55个指标 / 7.92万条数据 / 42天 |
| CPU 概览 | 横向柱状图 | 全20台主机 CPU 综合使用率排名 |
| 机房分布 | 饼图 | 5个机房(A/B/C/D/E)设备分布 |
| 内存分布 | 堆叠柱状图 | 各主机 used/free/buff/cache/swap |
| 网络流量 | 柱状图 | net_in / net_out 对比 |
| 磁盘 IO | 柱状图 | sda 磁盘使用率（颜色阈值：绿<40<黄<60<橙<80<红） |
| 系统负载 | 折线图 | load1 / load5 / load15 |

## 技术栈

- **前端**：HTML5 + CSS3 Grid + ECharts 5.5
- **后端**：Node.js + Express
- **数据库**：MySQL 8.0
- **数据模式**：API优先（localhost:3000），失败自动降级为内嵌数据

## 项目结构

```
作业2/
├── index.html              # 大屏主页
├── README.md               # 本文件
├── css/
│   └── dashboard.css       # 暗色主题样式
├── js/
│   └── dashboard.js        # 图表逻辑 + API对接 + 内嵌数据
├── data/                   # JSON数据（API不可用时的备选）
│   ├── host_list.json
│   ├── overview.json
│   ├── cpu_by_host.json
│   ├── mem_by_host.json
│   ├── net_by_host.json
│   └── disk_by_host.json
├── sql/
│   └── schema.sql          # MySQL建库建表脚本
├── scripts/
│   └── import_data.js      # 数据导入脚本
└── server/
    ├── package.json        # Node.js依赖
    └── app.js              # Express API服务（7个端点）
```

## API 端点

| 端点 | 说明 |
|------|------|
| `GET /api/overview` | KPI概览（主机数/指标数/数据量/日期范围） |
| `GET /api/hosts` | 主机列表 |
| `GET /api/cpu` | CPU指标按主机汇总 |
| `GET /api/memory` | 内存指标按主机汇总 |
| `GET /api/network` | 网络指标按主机汇总 |
| `GET /api/disk` | 磁盘指标按主机汇总 |
| `GET /api/load` | 系统负载按主机汇总 |
| `GET /api/host/:id/trend/:mod` | 指定主机+指标的时序趋势 |

## 数据来源

基于 4 张原始监控表加工而成：
- `host_detail.dat` — 主机维表（20台）
- `mod_detail.dat` — 指标维表（55个）
- `pref_tsar.dat` — 性能时序数据（~67,200条）
- `disk_tsar.dat` — 磁盘时序数据（~12,000条）