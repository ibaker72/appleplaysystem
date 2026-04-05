interface Column<T> {
  key: keyof T;
  label: string;
}

export function AdminDataTable<T extends Record<string, string | number>>({ title, columns, rows }: { title: string; columns: Column<T>[]; rows: T[] }) {
  return (
    <section className="surface rounded-premium p-5">
      <h2 className="mb-4 text-lg font-medium">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-white/55">
            <tr>{columns.map((col) => <th className="pb-3" key={String(col.key)}>{col.label}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr className="border-t border-white/5" key={idx}>
                {columns.map((col) => <td className="py-3" key={String(col.key)}>{String(row[col.key])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
