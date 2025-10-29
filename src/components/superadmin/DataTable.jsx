export default function DataTable({ columns, data }) {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full border-collapse">
        <thead className="bg-blue-100 text-blue-900">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="text-left px-6 py-3 text-sm font-semibold border-b border-blue-200"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={`hover:bg-blue-50 transition ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {row.map((cell, j) => (
                <td key={j} className="px-6 py-3 border-b border-gray-200">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
