const mysql = require('mysql2/promise');
const crypto = require('crypto');
const config = require('./config');
const { format } = require('date-fns');

// 生成表名的哈希值作为ID
function generateTableHash(tableName) {
  return crypto.createHash('md5').update(tableName).digest('hex');
}

// 格式化数据，处理日期和大数字
function formatData(rows) {
  return rows.map(row => {
    const formatted = {};
    for (const [key, value] of Object.entries(row)) {
      if (value instanceof Date) {
        formatted[key] = format(value, 'yyyy-MM-dd HH:mm:ss');
      } else if (typeof value === 'bigint' || (typeof value === 'number' && !Number.isSafeInteger(value))) {
        formatted[key] = value.toString();
      } else {
        formatted[key] = value;
      }
    }
    return formatted;
  });
}

// 采集MySQL数据
async function fetchMysqlData() {
  if (!config.mysqlConfig.database || config.mysqlConfig.tables.length === 0) {
    console.log('MySQL未配置，跳过采集');
    return [];
  }
  
  let connection;
  try {
    connection = await mysql.createConnection({
      host: config.mysqlConfig.host,
      user: config.mysqlConfig.user,
      password: config.mysqlConfig.password,
      database: config.mysqlConfig.database,
      connectTimeout: 5000
    });
    
    const snapshots = [];
    
    for (const tableName of config.mysqlConfig.tables) {
      try {
        console.log(`采集MySQL表: ${tableName}`);
        const [rows] = await connection.execute(`SELECT * FROM \`${tableName}\` LIMIT 1000`);
        const formattedRows = formatData(rows);
        
        snapshots.push({
          id: generateTableHash(tableName),
          tableName,
          data: formattedRows,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.error(`采集表${tableName}失败:`, e.message);
      }
    }
    
    return snapshots;
  } catch (e) {
    console.error('MySQL连接失败:', e.message);
    return [];
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { fetchMysqlData };
