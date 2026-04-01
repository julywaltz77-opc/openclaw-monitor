export default function MysqlTable({ data }) {
  if (!data || data.length === 0) return null;

  // 获取列名
  const columns = [...new Set(data.flatMap(row => Object.keys(row)))];

  return (
    <div className="overflow-x-auto">
      <table className="dashboard-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map(col => (
                <td key={col}>{row[col]?.toString() || '-'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
