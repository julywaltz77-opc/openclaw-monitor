"use client";
export const dynamic = 'force-dynamic';
import { useMysqlSnapshots, useAutoRefresh } from "../lib/convex";
import MysqlTable from "../components/MysqlTable";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import { formatDistanceToNow } from "date-fns";
import zhCN from "date-fns/locale/zh-CN";
import { useState } from "react";

export default function MysqlPage() {
  useAutoRefresh();
  const [tableFilter, setTableFilter] = useState("");

  const mysqlSnapshots = useMysqlSnapshots(tableFilter ? { tableName: tableFilter } : {});

  if (!mysqlSnapshots) return <Loading />;

  const latestUpdate = mysqlSnapshots[0]?.updatedAt;
  // 获取所有表名用于筛选
  const tableNames = [...new Set(mysqlSnapshots.map(s => s.tableName))];

  // 合并所有表的数据用于展示
  const allData = mysqlSnapshots.flatMap(snapshot => 
    snapshot.data.map(row => ({ ...row, _tableName: snapshot.tableName }))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gradient-text">MySQL 数据快照</h1>
        <div className="flex items-center space-x-4">
          {tableNames.length > 0 && (
            <select 
              className="select-input"
              value={tableFilter}
              onChange={e => setTableFilter(e.target.value)}
            >
              <option value="">全部表</option>
              {tableNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          )}
          {latestUpdate && (
            <span className="text-sm text-slate-400">
              最后更新：{formatDistanceToNow(new Date(latestUpdate), { addSuffix: true, locale: zhCN })}
            </span>
          )}
        </div>
      </div>

      <div className="dashboard-card">
        {mysqlSnapshots.length === 0 ? (
          <EmptyState message="暂无 MySQL 数据" />
        ) : (
          <MysqlTable data={allData} />
        )}
      </div>
    </div>
  );
}
