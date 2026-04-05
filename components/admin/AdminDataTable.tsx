interface Column<T> {
  key: keyof T;
  label: string;
}

export function AdminDataTable<T extends Record<string, string | number>>({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: Column<T>[];
  rows: T[];
}) {
  return (
    <section className="surface rounded-premium p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">{title}</h2>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/50">
          {rows.length} {rows.length === 1 ? "record" : "records"}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/40">No records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-white/55">
              <tr>
                {columns.map((col) => (
                  <th className="pb-3 pr-4 font-medium" key={String(col.key)}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr className="border-t border-white/5" key={idx}>
                  {columns.map((col) => (
                    <td className="py-3 pr-4" key={String(col.key)}>
                      {String(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
