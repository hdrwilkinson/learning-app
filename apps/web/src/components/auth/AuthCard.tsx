import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card";

interface AuthCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export function AuthCard({
    title,
    description,
    children,
    footer,
}: AuthCardProps) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
            {footer && (
                <CardFooter className="flex justify-center">
                    {footer}
                </CardFooter>
            )}
        </Card>
    );
}
