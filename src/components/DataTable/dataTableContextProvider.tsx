import { Table } from '@tanstack/react-table';

import dataTableContext from './dataTableContext';

const DataTableContextProvider = ({
  table,
  children
}: {
  table: Table<unknown>;
  children: React.ReactNode;
}) => {
  return (
    <dataTableContext.Provider value={{ table }}>
      {children}
    </dataTableContext.Provider>
  );
};

export default DataTableContextProvider;
