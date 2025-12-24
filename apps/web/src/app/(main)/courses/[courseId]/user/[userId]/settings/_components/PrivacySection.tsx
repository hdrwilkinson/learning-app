"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/shadcn/switch";
import { Label } from "@/components/ui/shadcn/label";
import { updateCourseSettings } from "@/app/actions/courses";

interface PrivacySectionProps {
    courseId: string;
    showProgressToGroup: boolean;
    appearInLeaderboards: boolean;
}

export function PrivacySection({
    courseId,
    showProgressToGroup: initialShowProgress,
    appearInLeaderboards: initialAppearInLeaderboards,
}: PrivacySectionProps) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = (
        field: "showProgressToGroup" | "appearInLeaderboards",
        value: boolean
    ) => {
        startTransition(async () => {
            await updateCourseSettings(courseId, { [field]: value });
        });
    };

    return (
        <section className="p-6 bg-muted/50 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Privacy</h2>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="show-progress">
                            Show progress to group members
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Let others in your study group see your progress
                        </p>
                    </div>
                    <Switch
                        id="show-progress"
                        defaultChecked={initialShowProgress}
                        disabled={isPending}
                        onCheckedChange={(checked: boolean) =>
                            handleToggle("showProgressToGroup", checked)
                        }
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="leaderboards">
                            Appear in leaderboards
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Show your name and ranking on course leaderboards
                        </p>
                    </div>
                    <Switch
                        id="leaderboards"
                        defaultChecked={initialAppearInLeaderboards}
                        disabled={isPending}
                        onCheckedChange={(checked: boolean) =>
                            handleToggle("appearInLeaderboards", checked)
                        }
                    />
                </div>
            </div>
        </section>
    );
}
