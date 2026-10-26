import React from "react";

export const TableWrapper = ({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`w-full overflow-x-auto bg-card border border-muted rounded-md shadow-sm ${className}`}
    {...props}
  >
    <table className="w-full text-left font-mono text-xs border-collapse">
      {children}
    </table>
  </div>
);

export const TableHeader = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    className={`bg-muted/10 border-b border-muted ${className}`}
    {...props}
  />
);

export const TableBody = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={`divide-y divide-muted/50 ${className}`} {...props} />
);

export const TableRow = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={`hover:bg-muted/10 transition-colors group ${className}`}
    {...props}
  />
);

export const TableHead = ({
  className = "",
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={`p-4 align-middle text-gray-400 uppercase tracking-wider font-normal ${className}`}
    {...props}
  >
    {children}
  </th>
);

export const TableCell = ({
  className = "",
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={`p-4 align-middle ${className}`} {...props}>
    {children}
  </td>
);
