// hooks/useUserColumns.tsx
import {useMemo} from 'react';
import {ColumnDef, createColumnHelper} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {UserDto} from '@/types/api/user';
import {PencilIcon} from 'lucide-react';

function useUserColumns(handleEdit: (user: UserDto) => void) {
    const columnHelper = createColumnHelper<UserDto>();

    const userColumns: ColumnDef<UserDto>[] = useMemo(
        () => [
            columnHelper.display({
                id: 'select',
                header: ({table}) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && 'indeterminate')
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({row}) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            }),
            columnHelper.accessor('username', {
                header: 'Nazwa użytkownika',
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor('email', {
                header: 'Email',
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor('roles', {
                header: 'Role',
                cell: (info) => info.getValue()?.join(', ') || '-',
            }),
            columnHelper.accessor('groupRoles', {
                header: 'Role w Grupach',
                cell: (info) =>
                    info.getValue()?.map((gr) => `${gr.group.name} (${gr.role})`).join(', ') || '-',
            }),
            {
                id: 'edit',
                header: 'Edytuj',
                cell: ({row}) => (
                    <Button onClick={() => handleEdit(row.original)}>
                        <PencilIcon className="w-4 h-4"/>
                    </Button>
                ),
                enableSorting: false,
            },
        ],
        [columnHelper, handleEdit]
    ) as ColumnDef<UserDto>[];

    return {userColumns};
}

export default useUserColumns;