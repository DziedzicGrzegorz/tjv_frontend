"use client";

import {DataTablePagination} from '@/components/DataTable/DataTablePagination';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {Input} from '@/components/ui/input';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    Table as TableType,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table';
import {ArrowDown, ArrowUp} from 'lucide-react';
import * as React from 'react';
import DataTableContextProvider from "@/components/DataTable/dataTableContextProvider";
import {Checkbox} from '@/components/ui/checkbox';

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    deleteButton?: React.ReactNode;
    createButton?: React.ReactNode;
    defaultSorting?: SortingState;
}

export function DataTable<T>({
                                 data,
                                 columns,
                                 deleteButton,
                                 createButton,
                                 defaultSorting
                             }: DataTableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>(defaultSorting || []);
    const [globalFilter, setGlobalFilter] = React.useState<string>('');
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter
        }
    });

    return (
        <DataTableContextProvider table={table as TableType<unknown>}>
            <div className="w-full h-full p-10">
                <div className="flex items-center py-4 space-x-4">
                    <Input
                        placeholder="Search values..."
                        value={globalFilter}
                        onChange={event => setGlobalFilter(event.target.value)}
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter(column => column.getCanHide())
                                .map(column => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={value => column.toggleVisibility(value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {deleteButton && <div className="ml-3">{deleteButton}</div>}
                    {createButton && <div className="ml-3">{createButton}</div>}
                </div>
                <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <Table className="min-w-full divide-y divide-gray-200 dark:divide-ping">
                        <TableHeader className="dark:bg-deepBlue">
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    <TableHead
                                        className="py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        <Checkbox
                                            checked={table.getIsAllRowsSelected()}
                                            onCheckedChange={value => table.toggleAllRowsSelected(!!value)}
                                        />
                                    </TableHead>
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id}
                                                   className="py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            <div
                                                className={`flex items-center ${header.column.columns.length > 0 ? 'justify-center' : 'justify-start'} ${
                                                    header.column.getCanSort() ? 'cursor-pointer' : 'cursor-default'
                                                }`}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                {header.column.getIsSorted() ? (
                                                    header.column.getIsSorted() === 'asc' ? (
                                                        <ArrowUp
                                                            className="ml-2 h-4 w-4 text-pink-600 dark:text-white"/>
                                                    ) : (
                                                        <ArrowDown
                                                            className="ml-2 h-4 w-4 text-pink-600 dark:text-white"/>
                                                    )
                                                ) : null}
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className="bg-white dark:bg-blue-900">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                    >
                                        <TableCell className="py-2">
                                            <Checkbox
                                                checked={row.getIsSelected()}
                                                onCheckedChange={value => row.toggleSelected(!!value)}
                                            />
                                        </TableCell>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}
                                                       className="px-6 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + 1} // +1 for the checkbox column
                                        className="h-24 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="w-full pt-3">
                    <DataTablePagination table={table}/>
                </div>
            </div>
        </DataTableContextProvider>
    );
}