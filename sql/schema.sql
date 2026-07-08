-- ============================================================
-- 数据中心监控系统 MySQL 数据库 Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS datacenter_monitor
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE datacenter_monitor;

-- 主机维表
DROP TABLE IF EXISTS hosts;
CREATE TABLE hosts (
  host_id     VARCHAR(10)   PRIMARY KEY COMMENT '主机ID',
  hostname    VARCHAR(100)  NOT NULL COMMENT '主机名',
  owner       VARCHAR(20)   NOT NULL COMMENT '负责人',
  model       VARCHAR(50)   NOT NULL COMMENT '服务器型号',
  location1   VARCHAR(20)   NOT NULL COMMENT '机房位置',
  location2   VARCHAR(20)   NOT NULL COMMENT '机柜位置',
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 指标维表
DROP TABLE IF EXISTS metrics;
CREATE TABLE metrics (
  mod_code    VARCHAR(20)   PRIMARY KEY COMMENT '指标编码',
  mod_type    VARCHAR(10)   NOT NULL COMMENT '类型: disk/pref',
  description VARCHAR(100)  NOT NULL COMMENT '指标中文描述',
  unit        VARCHAR(20)   NOT NULL COMMENT '单位',
  tag         VARCHAR(30)   NOT NULL COMMENT '分类标签',
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 磁盘监控记录表（原始明细）
DROP TABLE IF EXISTS disk_records;
CREATE TABLE disk_records (
  id          BIGINT        AUTO_INCREMENT PRIMARY KEY,
  ts          BIGINT        NOT NULL COMMENT '时间戳(毫秒)',
  event_time  DATETIME      NOT NULL COMMENT '事件时间',
  host_id     VARCHAR(10)   NOT NULL COMMENT '主机ID',
  mod_code    VARCHAR(20)   NOT NULL COMMENT '指标编码',
  value       DOUBLE        NOT NULL COMMENT '指标值',
  tag         VARCHAR(30)   NOT NULL COMMENT '分类标签',
  INDEX idx_host_ts (host_id, event_time),
  INDEX idx_mod_ts (mod_code, event_time),
  INDEX idx_event (event_time),
  FOREIGN KEY (host_id)  REFERENCES hosts(host_id),
  FOREIGN KEY (mod_code) REFERENCES metrics(mod_code)
) ENGINE=InnoDB;

-- 性能监控记录表（原始明细）
DROP TABLE IF EXISTS pref_records;
CREATE TABLE pref_records (
  id          BIGINT        AUTO_INCREMENT PRIMARY KEY,
  ts          BIGINT        NOT NULL COMMENT '时间戳(毫秒)',
  event_time  DATETIME      NOT NULL COMMENT '事件时间',
  host_id     VARCHAR(10)   NOT NULL COMMENT '主机ID',
  mod_code    VARCHAR(20)   NOT NULL COMMENT '指标编码',
  value       DOUBLE        NOT NULL COMMENT '指标值',
  tag         VARCHAR(30)   NOT NULL COMMENT '分类标签',
  INDEX idx_host_ts (host_id, event_time),
  INDEX idx_mod_ts (mod_code, event_time),
  INDEX idx_event (event_time),
  FOREIGN KEY (host_id)  REFERENCES hosts(host_id),
  FOREIGN KEY (mod_code) REFERENCES metrics(mod_code)
) ENGINE=InnoDB;

-- 小时汇总视图（快速查询仪表盘数据）
CREATE OR REPLACE VIEW host_metrics_hourly AS
SELECT
  DATE_FORMAT(event_time, '%Y-%m-%d') AS dt,
  HOUR(event_time) AS hour,
  host_id,
  mod_code,
  ROUND(AVG(value), 2) AS avg_value,
  MAX(value)           AS max_value,
  MIN(value)           AS min_value,
  COUNT(*)             AS sample_count
FROM pref_records
GROUP BY dt, hour, host_id, mod_code;

-- 天汇总视图
CREATE OR REPLACE VIEW host_metrics_daily AS
SELECT
  DATE_FORMAT(event_time, '%Y-%m-%d') AS dt,
  host_id,
  mod_code,
  ROUND(AVG(value), 2) AS avg_value,
  MAX(value)           AS max_value,
  MIN(value)           AS min_value,
  COUNT(*)             AS sample_count
FROM pref_records
GROUP BY dt, host_id, mod_code;