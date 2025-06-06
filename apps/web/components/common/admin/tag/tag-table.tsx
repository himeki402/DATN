"use client";

import { useState } from "react";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    type SortingState,
    getSortedRowModel,
    type ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table";
import {
    ChevronDownIcon,
    PenIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    ChevronUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tag } from "@/lib/types/tag";
import { formatDateToFullOptions } from "@/lib/utils";

interface TagsTableProps {
    tags: Tag[];
    isLoading?: boolean;
    onEdit: (tag: Tag) => void;
    onDelete: (tagId: string) => void;
}

export function TagsTable({
    tags,
    isLoading = false,
    onEdit,
    onDelete,
}: TagsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

    const handleDeleteClick = (tag: Tag) => {
        setTagToDelete(tag);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (tagToDelete) {
            onDelete(tagToDelete.id);
            setDeleteDialogOpen(false);
            setTagToDelete(null);
        }
    };

    const columns: ColumnDef<Tag>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="flex items-center gap-1 p-0 font-medium"
                >
                    Tên
                    {column.getIsSorted() === "asc" ? (
                        <ChevronUpIcon className="ml-1 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                    ) : null}
                </Button>
            ),
            cell: ({ row }) => <div>{row.original.name}</div>,
        },
        {
            accessorKey: "description",
            header: "Mô tả",
            cell: ({ row }) => (
                <div className="line-clamp-2 max-w-[350px]">
                    {row.original.description || "Không có mô tả"}
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="flex items-center gap-1 p-0 font-medium"
                >
                    Được tạo từ
                    {column.getIsSorted() === "asc" ? (
                        <ChevronUpIcon className="ml-1 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                    ) : null}
                </Button>
            ),
            cell: ({ row }) => (
                <div>
                    {formatDateToFullOptions(row.original.created_at || "")}
                </div>
            ),
            enableSorting: true,
        },
        {
            id: "actions",
            enableHiding: false,
            header: "Hành động",
            cell: ({ row }) => {
                const tag = row.original;

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => onEdit(tag)}
                        >
                            <span className="sr-only">Chỉnh sửa</span>
                            <PenIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClick(tag)}
                        >
                            <span className="sr-only">Xóa</span>
                            <TrashIcon className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: tags,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full max-w-sm" />
                <div className="rounded-md border">
                    <div className="h-[400px] w-full bg-muted/20 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="text-sm text-muted-foreground">
                                Loading tags...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Tìm kiếm tag..."
                    value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("name")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                        Export <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} tag(s) selected.
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Số hàng mỗi trang</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue
                                    placeholder={
                                        table.getState().pagination.pageSize
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem
                                        key={pageSize}
                                        value={`${pageSize}`}
                                    >
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Về trang đầu</span>
                            <ChevronsLeftIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Trang trước</span>
                            <ChevronLeftIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Trang tiếp theo</span>
                            <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() =>
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Tới trang cuối</span>
                            <ChevronsRightIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn chắc chứ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này sẽ xóa vĩnh viễn thẻ "
                            {tagToDelete?.name}". Hành động này không thể khôi
                            phục.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
