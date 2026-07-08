# 数据中心运行监控大屏

## 项目预览

![大屏预览](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20professional%20dark%20theme%20data%20center%20monitoring%20dashboard%20with%20multiple%20ECharts%20panels%20showing%20CPU%20bar%20charts%2C%20pie%20charts%20for%20server%20room%20distribution%2C%20stacked%20bar%20charts%20for%20memory%20usage%2C%20network%20traffic%20charts%2C%20disk%20IO%20gauges%2C%20and%20load%20average%20line%20charts%2C%20all%20in%20a%20sleek%20cyberpunk%20dark%20blue%20color%20scheme%20with%20neon%20cyan%20accents%2C%20KPI%20cards%20at%20the%20top&image_size=landscape_16_9)

> 直接双击 `index.html` 即可在浏览器中打开查看完整效果

## 功能面板

| 面板 | 类型 | 说明 |
|------|------|------|
| KPI 卡片 | 统计 | 20台主机 / 55个指标 / 7.92万条数据 / 42天 |
| CPU 概览 | 横向柱状图 | 全20台主机 CPU 综合使用率排名 |
| 机房分布 | 饼图 | 5个机房(A/B/C/D/E)设备分布 |
| 内存分布 | 堆叠柱状图 | 各主机 used/free/buff/cache/swap |
| 网络流量 | 柱状图 | net_in / net_out 对比 |
| 磁盘 IO | 柱状图 | sda 磁盘使用率(带颜色阈值) |
| 系统负载 | 折线图 | load1 / load5 / load15 |

## 技术栈

- **前端**：HTML5 + CSS3 Grid 响应式布局
- **图表**：ECharts 5.5 (CDN)
- **数据**：JSON 内嵌于 `js/dashboard.js`
- **主题**：深蓝暗色科技风

## 项目结构

```
作业2/
├── index.html              # 主页面
├── README.md               # 本文件
├── css/
│   └── dashboard.css       # 大屏样式
├── js/
│   └── dashboard.js        # 图表逻辑 + 内嵌数据
└── data/
    ├── host_list.json      # 20台主机明细
    ├── overview.json       # 概览统计
    ├── cpu_by_host.json    # CPU 指标汇总
    ├── mem_by_host.json    # 内存指标汇总
    ├── net_by_host.json    # 网络指标汇总
    └── disk_by_host.json   # 磁盘指标汇总
```

## 数据来源

基于 4 张原始监控表加工而成：
- `host_detail.dat` — 主机维表（20台）
- `mod_detail.dat` — 指标维表（55个）
- `pref_tsar.dat` — 性能时序数据（~67,200条）
- `disk_tsar.dat` — 磁盘时序数据（~12,000条）