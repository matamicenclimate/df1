interface Meta {
  $id: string;
  $class?: string;
}
type Dict = Record<string, JSX.Element | string> & Meta;
export interface RichTableProps<T extends Dict[]> {
  rows: T;
  order: (keyof Omit<{ [K in keyof T[number]]: JSX.Element | string }, keyof Meta>)[];
  header: Omit<{ [K in keyof T[number]]: JSX.Element | string }, keyof Meta>;
}

export function RichTable<T extends Dict[]>({ rows, header, order }: RichTableProps<T>) {
  const entries = order.map((k) => [k, header[k]]);
  const [[, first], ...center] = entries;
  const [, last] = center.pop() as [string, JSX.Element | string];
  return (
    <table className="mt-3 table-auto w-full text-sm">
      <thead className="text-left text-climate-light-gray font-normal">
        <tr className="mb-2 font-inter font-normal text-[13px]">
          <th className="p-2 pl-6 pr-6 text-[13px] text-climate-light-gray">{first}</th>
          {center.map(([key, value]) => (
            <th key={`${String(key)}`} className="p-2 pl-6 pr-6">
              <p>{value}</p>
            </th>
          ))}
          <th className="p-2 pl-6 pr-6">{last}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((child) => (
          <tr key={child.$id} className={child.$class}>
            {order.map((k) => (
              <td key={`${child.$id}/${String(k)}`} className="p-2 pl-6 pr-6">
                {child[k]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
