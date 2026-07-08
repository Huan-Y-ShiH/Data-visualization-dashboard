/**
 * 数据导入脚本：将 disk_tsar.dat / pref_tsar.dat / host_detail.dat / mod_detail.dat
 * 加工处理后导入 MySQL 数据库
 *
 * 使用方法：
 *   1. 确保 MySQL 已启动
 *   2. 先执行 sql/schema.sql 建库建表
 *   3. node scripts/import_data.js
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// ========== 配置 ==========
const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'datacenter_monitor',
  charset: 'utf8mb4',
};

const DATA_DIR = path.resolve(__dirname, '..', '..', '..');

// ========== 工具函数 ==========
function parseTs(ms) {
  return new Date(ms).toISOString().slice(0, 19).replace('T', ' ');
}

function readDat(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.trim().split(/\r?\n/);
  return lines.slice(1).map(line => line.split('\t'));
}

// ========== 主流程 ==========
async function main() {
  console.log('=== 数据中心监控数据导入 MySQL ===\n');

  // 连接数据库
  const conn = await mysql.createConnection(DB_CONFIG);
  console.log('[OK] MySQL 已连接\n');

  // 1. 导入维表
  console.log('[1/4] 导入主机维表...');

  const hostFile = path.join(DATA_DIR, 'host_detail.dat');
  const hosts = readDat(hostFile);
  let hostCount = 0;
  for (const row of hosts) {
    if (row.length < 6) continue;
    await conn.execute(
      'INSERT INTO hosts (host_id, hostname, owner, model, location1, location2) VALUES (?,?,?,?,?,?)',
      [row[0], row[1], row[2], row[3], row[4], row[5]]
    );
    hostCount++;
  }
  console.log(`  导入 ${hostCount} 台主机`);

  const modFile = path.join(DATA_DIR, 'mod_detail.dat');
  const mods = readDat(modFile);
  let modCount = 0;
  for (const row of mods) {
    if (row.length < 5) continue;
    await conn.execute(
      'INSERT INTO metrics (mod_code, mod_type, description, unit, tag) VALUES (?,?,?,?,?)',
      [row[0], row[1], row[2], row[3], row[4]]
    );
    modCount++;
  }
  console.log(`  导入 ${modCount} 个指标\n`);

  // 2. 导入 disk_tsar (使用批量插入提升性能)
  console.log('[2/4] 导入磁盘监控记录...');
  const diskFile = path.join(DATA_DIR, 'disk_tsar.dat');
  const diskRows = readDat(diskFile);
  let diskCount = 0;
  const batchSize = 500;
  let diskBatch = [];

  for (const row of diskRows) {
    if (row.length < 6) continue;
    const ts = parseInt(row[0]);
    diskBatch.push([
      ts,
      parseTs(ts),
      row[1], row[3],
      parseFloat(row[4]),
      row[5]
    ]);
    if (diskBatch.length >= batchSize) {
      await conn.query(
        'INSERT INTO disk_records (ts, event_time, host_id, mod_code, value, tag) VALUES ?',
        [diskBatch]
      );
      diskCount += diskBatch.length;
      diskBatch = [];
      process.stdout.write(`\r  已导入 ${diskCount} 条...`);
    }
  }
  if (diskBatch.length > 0) {
    await conn.query(
      'INSERT INTO disk_records (ts, event_time, host_id, mod_code, value, tag) VALUES ?',
      [diskBatch]
    );
    diskCount += diskBatch.length;
  }
  console.log(`\n  导入 ${diskCount} 条磁盘记录\n`);

  // 3. 导入 pref_tsar
  console.log('[3/4] 导入性能监控记录...');
  const prefFile = path.join(DATA_DIR, 'pref_tsar.dat');
  const prefRows = readDat(prefFile);
  let prefCount = 0;
  let prefBatch = [];

  for (const row of prefRows) {
    if (row.length < 6) continue;
    const ts = parseInt(row[0]);
    prefBatch.push([
      ts,
      parseTs(ts),
      row[1], row[3],
      parseFloat(row[4]),
      row[5]
    ]);
    if (prefBatch.length >= batchSize) {
      await conn.query(
        'INSERT INTO pref_records (ts, event_time, host_id, mod_code, value, tag) VALUES ?',
        [prefBatch]
      );
      prefCount += prefBatch.length;
      prefBatch = [];
      process.stdout.write(`\r  已导入 ${prefCount} 条...`);
    }
  }
  if (prefBatch.length > 0) {
    await conn.query(
      'INSERT INTO pref_records (ts, event_time, host_id, mod_code, value, tag) VALUES ?',
      [prefBatch]
    );
    prefCount += prefBatch.length;
  }
  console.log(`\n  导入 ${prefCount} 条性能记录\n`);

  // 4. 验证
  console.log('[4/4] 验证数据...');
  const [diskTotal] = await conn.query('SELECT COUNT(*) AS cnt FROM disk_records');
  const [prefTotal] = await conn.query('SELECT COUNT(*) AS cnt FROM pref_records');
  const [hostTotal] = await conn.query('SELECT COUNT(*) AS cnt FROM hosts');
  const [metricTotal] = await conn.query('SELECT COUNT(*) AS cnt FROM metrics');

  console.log(`  hosts:   ${hostTotal[0].cnt} 台`);
  console.log(`  metrics: ${metricTotal[0].cnt} 个`);
  console.log(`  disk_records: ${diskTotal[0].cnt} 条`);
  console.log(`  pref_records: ${prefTotal[0].cnt} 条`);

  await conn.end();
  console.log('\n=== 导入完成 ===');
}

main().catch(err => {
  console.error('导入失败:', err.message);
  process.exit(1);
});