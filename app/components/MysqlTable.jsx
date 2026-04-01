export default function MysqlTable({ data }) {
  if (!data || data.length === 0) return null;

  // 获取所有列名，排除内部字段_tableName
  const columns = [...new Set(data.flatMap(item => Object.keys(item).filter(key => key !== "_tableName" && key !== "_id")))];

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                key={column}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map(column => (
                <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row[column]?.toString() || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
