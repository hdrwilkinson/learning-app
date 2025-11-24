"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { LoginHistoryTable } from "./LoginHistoryTable";
import { getLoginHistory } from "@/app/actions/sessions";
import { toast } from "sonner";

type LoginHistoryEntry = {
    id: string;
    deviceName: string | null;
    location: string | null;
    ipAddress: string | null;
    loginAt: Date;
};

export function SessionManager() {
    const { data: session } = useSession();
    const [history, setHistory] = useState<LoginHistoryEntry[]>([]);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyPagination, setHistoryPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const loadHistory = useCallback(
        async (page: number) => {
            if (!session?.user?.id) return;

            setIsLoading(true);
            try {
                const result = await getLoginHistory(page, 20);
                if (result.error) {
                    toast.error(result.error);
                } else if (
                    result.success &&
                    result.history &&
                    result.pagination
                ) {
                    setHistory(result.history);
                    setHistoryPagination(result.pagination);
                }
            } catch (error) {
                console.error("Failed to load login history:", error);
                toast.error("Failed to load login history");
            } finally {
                setIsLoading(false);
            }
        },
        [session?.user?.id]
    );

    useEffect(() => {
        if (session?.user?.id) {
            loadHistory(historyPage);
        }
    }, [session?.user?.id, historyPage, loadHistory]);

    function handleHistoryPageChange(page: number) {
        setHistoryPage(page);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-display-grounded text-2xl font-bold">
                    Login History
                </CardTitle>
                <CardDescription>
                    View your recent login activity to monitor account security
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : (
                    <LoginHistoryTable
                        history={history}
                        pagination={historyPagination}
                        onPageChange={handleHistoryPageChange}
                    />
                )}
            </CardContent>
        </Card>
    );
}
