type Dict = Record<string, JSX.Element | string> & { $id: string };

export interface RichTableProps<T extends Dict[]> {
  rows: T;
  order: (keyof Omit<{ [K in keyof T[number]]: JSX.Element | string }, '$id'>)[];
  header: Omit<{ [K in keyof T[number]]: JSX.Element | string }, '$id'>;
}

export function RichTable<T extends Dict[]>({ rows, header, order }: RichTableProps<T>) {
  const entries = order.map((k) => [k, header[k]]);
  const [[, first], ...center] = entries;
  const [, last] = center.pop() as [string, JSX.Element | string];
  return (
    <table className="mt-8 border-collapse table-auto w-full text-sm">
      <thead className="text-left">
        <tr>
          <th className="p-2 pl-6 pr-6 bg-climate-action-light text-climate-gray rounded-l-xl">
            {first}
          </th>
          {center.map(([key, value]) => (
            <th key={`${key}`} className="p-2 pl-6 pr-6 bg-climate-action-light text-climate-gray">
              {value}
            </th>
          ))}
          <th className="p-2 pl-6 pr-6 bg-climate-action-light text-climate-gray rounded-r-xl">
            {last}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((child) => (
          <tr key={child.$id}>
            {order.map((k) => (
              <td key={`${child.$id}/${k}`} className="p-2 pl-6 pr-6">
                {child[k]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
