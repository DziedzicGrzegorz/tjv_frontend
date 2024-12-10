// src/hooks/useUserColumn.tsx
import {ColumnDef} from '@tanstack/react-table';
import {UserDto} from '@/types/api/user';
import {Button} from '@/components/ui/button';

interface UseUserColumnsProps {
    isAdminOrFounder: boolean;
    handleRemove: (user: UserDto) => void;
}

const useUserColumns = ({isAdminOrFounder, handleRemove}: UseUserColumnsProps) => {
    const columns: ColumnDef<UserDto>[] = [
        {
            accessorKey: 'username',
            header: 'Username',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: info => info.getValue(),
        },
        // Add more columns if needed
    ];

    if (isAdminOrFounder) {
        columns.push({
            id: 'actions',
            header: 'Actions',
            cell: ({row}) => (
                <div className="flex space-x-2">
                    {/* Edit functionality can be added here if needed */}
                    {/* <Button variant="outline" size="sm" onClick={() => handleEdit(row.original)}>
                        Edit
                    </Button> */}
                    <Button variant="destructive" size="sm" onClick={() => handleRemove(row.original)}>
                        Delete
                    </Button>
                </div>
            ),
        });
    }

    return {userColumns: columns};
};

export default useUserColumns;