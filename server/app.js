/**
 * 数据中心监控大屏 API 服务
 *
 * 启动方式：
 *   cd server && npm install && npm start
 *   服务运行在 http://localhost:3000
 *
 * API 端点：
 *   GET /api/overview        - KPI 概览
 *   GET /api/hosts           - 主机列表
 *   GET /api/cpu             - CPU 指标汇总
 *   GET /api/memory          - 内存指标汇总
 *   GET /api/network         - 网络指标汇总
 *   GET /api/disk            - 磁盘指标汇总
 *   GET /api/load            - 系统负载汇总
 *   GET /api/host/:id/trend/:mod  - 指定主机+指标的时序数据
 */

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'datacenter_monitor',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
});

// ---- API 路由 ----

// KPI 概览
app.get('/api/overview', async (req, res) => {
  try {
    const [hosts] = await pool.query('SELECT COUNT(*) cnt FROM hosts');
    const [metrics] = await pool.query('SELECT COUNT(*) cnt FROM metrics');
    const [diskCnt] = await pool.query('SELECT COUNT(*) cnt FROM disk_records');
    const [prefCnt] = await pool.query('SELECT COUNT(*) cnt FROM pref_records');
    const [dateRange] = await pool.query(
      'SELECT MIN(event_time) d1, MAX(event_time) d2 FROM pref_records'
    );
    res.json({
      hosts: hosts[0].cnt,
      metrics: metrics[0].cnt,
      totalRecords: diskCnt[0].cnt + prefCnt[0].cnt,
      dateRange: dateRange[0].d1 ? dateRange[0].d1.toISOString().slice(0, 10) + ' ~ ' + dateRange[0].d2.toISOString().slice(0, 10) : 'N/A',
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 主机列表
app.get('/api/hosts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hosts ORDER BY host_id');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CPU 按主机汇总
app.get('/api/cpu', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT host_id, mod_code, ROUND(AVG(value), 2) avg_value
      FROM pref_records
      WHERE mod_code LIKE 'cpu_%'
      GROUP BY host_id, mod_code
      ORDER BY host_id, mod_code
    `);
    // 转成 { host001: { cpu_usage: xx, ... }, ... } 格式
    const result = {};
    rows.forEach(r => {
      if (!result[r.host_id]) result[r.host_id] = {};
      result[r.host_id][r.mod_code] = r.avg_value;
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 内存按主机汇总
app.get('/api/memory', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT host_id, mod_code, ROUND(AVG(value), 2) avg_value
      FROM pref_records
      WHERE mod_code LIKE 'mem_%'
      GROUP BY host_id, mod_code
      ORDER BY host_id, mod_code
    `);
    const result = {};
    rows.forEach(r => {
      if (!result[r.host_id]) result[r.host_id] = {};
      result[r.host_id][r.mod_code] = r.avg_value;
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 网络按主机汇总
app.get('/api/network', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT host_id, mod_code, ROUND(AVG(value), 2) avg_value
      FROM pref_records
      WHERE mod_code LIKE 'net_%'
      GROUP BY host_id, mod_code
      ORDER BY host_id, mod_code
    `);
    const result = {};
    rows.forEach(r => {
      if (!result[r.host_id]) result[r.host_id] = {};
      result[r.host_id][r.mod_code] = r.avg_value;
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 磁盘按主机汇总
app.get('/api/disk', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT host_id, mod_code, ROUND(AVG(value), 2) avg_value
      FROM disk_records
      GROUP BY host_id, mod_code
      ORDER BY host_id, mod_code
    `);
    const result = {};
    rows.forEach(r => {
      if (!result[r.host_id]) result[r.host_id] = {};
      result[r.host_id][r.mod_code] = r.avg_value;
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 系统负载
app.get('/api/load', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT host_id, mod_code, ROUND(AVG(value), 2) avg_value
      FROM pref_records
      WHERE mod_code LIKE 'load%'
      GROUP BY host_id, mod_code
      ORDER BY host_id, mod_code
    `);
    const result = {};
    rows.forEach(r => {
      if (!result[r.host_id]) result[r.host_id] = {};
      result[r.host_id][r.mod_code] = r.avg_value;
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 单主机时序数据（按小时聚合）
app.get('/api/host/:id/trend/:mod', async (req, res) => {
  try {
    const { id, mod } = req.params;
    const [rows] = await pool.query(`
      SELECT DATE_FORMAT(event_time, '%Y-%m-%d') dt,
             HOUR(event_time) hour,
             ROUND(AVG(value), 2) avg_value,
             MAX(value) max_value
      FROM pref_records
      WHERE host_id = ? AND mod_code = ?
      GROUP BY dt, hour
      ORDER BY dt, hour
    `, [id, mod]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`数据中心监控 API 已启动: http://localhost:${PORT}`);
  console.log('端点: /api/overview /api/hosts /api/cpu /api/memory /api/network /api/disk /api/load');
});