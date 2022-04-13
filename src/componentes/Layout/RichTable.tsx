type Dict = Record<string, JSX.Element | string>;

export interface RichTableProps<T extends Dict[]> {
  children: T;
  header: { [K in keyof T[number]]: JSX.Element | string };
}

export function RichTable<T extends Dict[]>({ children, header }: RichTableProps<T>) {
  const entries = Object.entries(header);
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
            <th key={key} className="p-2 pl-6 pr-6 bg-climate-action-light text-climate-gray">
              {value}
            </th>
          ))}
          <th className="p-2 pl-6 pr-6 bg-climate-action-light text-climate-gray rounded-r-xl">
            {last}
          </th>
        </tr>
      </thead>
      <tbody>
        {children.map((child) => (
          <tr key={`${JSON.stringify(child)}`}>
            {Object.entries(child).map(([key, value]) => (
              <td key={`${JSON.stringify(child)}/${key}`} className="p-2 pl-6 pr-6">
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
