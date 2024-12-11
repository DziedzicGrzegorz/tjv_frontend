import {Table} from '@tanstack/react-table';
import {createContext} from 'react';

type DataTableContextType = {
    table: Table<unknown> | null;
};

const dataTableContext = createContext<DataTableContextType>({
    table: null
});

export default dataTableContext;
