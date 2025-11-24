"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/shadcn/table";
import { Button } from "@/components/ui/shadcn/button";
import { formatDistanceToNow, format } from "date-fns";

type LoginHistoryEntry = {
    id: string;
    deviceName: string | null;
    location: string | null;
    ipAddress: string | null;
    loginAt: Date;
};

interface LoginHistoryTableProps {
    history: LoginHistoryEntry[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
}

export function LoginHistoryTable({
    history,
    pagination,
    onPageChange,
}: LoginHistoryTableProps) {
    if (history.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No login history
            </div>
        );
    }

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Device</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Date & Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>
                                    {entry.deviceName || "Unknown Device"}
                                </TableCell>
                                <TableCell>
                                    {entry.location ||
                                        entry.ipAddress ||
                                        "Unknown"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>
                                            {formatDistanceToNow(
                                                entry.loginAt,
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {format(entry.loginAt, "PPp")}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {(pagination.page - 1) * pagination.limit + 1}{" "}
                        to{" "}
                        {Math.min(
                            pagination.page * pagination.limit,
                            pagination.total
                        )}{" "}
                        of {pagination.total} entries
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
