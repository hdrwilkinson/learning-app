"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/shadcn/switch";
import { Label } from "@/components/ui/shadcn/label";
import { updateCourseSettings } from "@/app/actions/courses";

interface NotificationsSectionProps {
    courseId: string;
    emailReminders: boolean;
    pushNotifications: boolean;
    weeklyProgressEmail: boolean;
}

export function NotificationsSection({
    courseId,
    emailReminders: initialEmailReminders,
    pushNotifications: initialPushNotifications,
    weeklyProgressEmail: initialWeeklyProgressEmail,
}: NotificationsSectionProps) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = (
        field: "emailReminders" | "pushNotifications" | "weeklyProgressEmail",
        value: boolean
    ) => {
        startTransition(async () => {
            await updateCourseSettings(courseId, { [field]: value });
        });
    };

    return (
        <section className="p-6 bg-muted/50 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="email-reminders">Email reminders</Label>
                        <p className="text-sm text-muted-foreground">
                            Get reminded to study via email
                        </p>
                    </div>
                    <Switch
                        id="email-reminders"
                        defaultChecked={initialEmailReminders}
                        disabled={isPending}
                        onCheckedChange={(checked: boolean) =>
                            handleToggle("emailReminders", checked)
                        }
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">
                            Push notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Receive push notifications for study reminders
                        </p>
                    </div>
                    <Switch
                        id="push-notifications"
                        defaultChecked={initialPushNotifications}
                        disabled={isPending}
                        onCheckedChange={(checked: boolean) =>
                            handleToggle("pushNotifications", checked)
                        }
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="weekly-progress">
                            Weekly progress summary
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Receive a weekly email with your progress report
                        </p>
                    </div>
                    <Switch
                        id="weekly-progress"
                        defaultChecked={initialWeeklyProgressEmail}
                        disabled={isPending}
                        onCheckedChange={(checked: boolean) =>
                            handleToggle("weeklyProgressEmail", checked)
                        }
                    />
                </div>
            </div>
        </section>
    );
}
