"use client";

/**
 * UserReviewSection Component
 *
 * Shows the user's existing review with edit/delete buttons,
 * or the review form if they haven't reviewed yet or are editing.
 */

import { useState, useTransition } from "react";
import {
    HiStar,
    HiBookOpen,
    HiAcademicCap,
    HiPencil,
    HiTrash,
} from "react-icons/hi";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/shadcn/avatar";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { ReviewForm } from "@/features/courses";
import { deleteCourseReview } from "@/app/actions/courses";
import { cn } from "@/lib/utils";

interface UserReviewSectionProps {
    courseId: string;
    completionPercent: number;
    masteryPercent: number;
    existingReview: {
        id: string;
        rating: number;
        review: string | null;
        completionPercent: number;
        masteryPercent: number;
        createdAt: string;
        user: {
            id: string;
            name: string | null;
            image: string | null;
        };
    } | null;
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div
            className="flex items-center gap-0.5"
            aria-label={`${rating} out of 5 stars`}
        >
            {Array.from({ length: 5 }).map((_, i) => (
                <HiStar
                    key={i}
                    className={cn(
                        "h-4 w-4",
                        i < rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted-foreground/30"
                    )}
                />
            ))}
        </div>
    );
}

function getInitials(name: string | null): string {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function UserReviewSection({
    courseId,
    completionPercent,
    masteryPercent,
    existingReview,
}: UserReviewSectionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete your review?")) {
            return;
        }

        startTransition(async () => {
            const result = await deleteCourseReview(courseId);
            if ("success" in result) {
                setIsDeleted(true);
            }
        });
    };

    // If no review or deleted, show the form
    if (!existingReview || isDeleted) {
        return (
            <ReviewForm
                courseId={courseId}
                completionPercent={completionPercent}
                masteryPercent={masteryPercent}
                existingReview={null}
            />
        );
    }

    // If editing, show the form with existing data
    if (isEditing) {
        return (
            <div className="space-y-3">
                <ReviewForm
                    courseId={courseId}
                    completionPercent={completionPercent}
                    masteryPercent={masteryPercent}
                    existingReview={{
                        rating: existingReview.rating,
                        review: existingReview.review,
                    }}
                />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                >
                    Cancel
                </Button>
            </div>
        );
    }

    // Show the user's review with edit/delete buttons
    const review = existingReview;

    return (
        <Card className="overflow-hidden border-primary/20 bg-primary/5">
            <CardContent className="p-4 sm:p-5">
                {/* Header with "Your Review" label */}
                <div className="text-xs font-medium text-primary mb-3">
                    Your Review
                </div>

                {/* User info and rating */}
                <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage
                            src={review.user.image ?? undefined}
                            alt={review.user.name ?? "User"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {getInitials(review.user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-sm truncate">
                                {review.user.name ?? "Anonymous"}
                            </span>
                            <StarRating rating={review.rating} />
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <time dateTime={review.createdAt}>
                                {formatDate(review.createdAt)}
                            </time>
                        </div>
                    </div>
                </div>

                {/* Review text */}
                {review.review && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {review.review}
                    </p>
                )}
                {!review.review && (
                    <p className="text-sm text-muted-foreground/60 italic mb-3">
                        No written review
                    </p>
                )}

                {/* Bottom row: Progress badges on left, action buttons on right */}
                <div className="flex items-center justify-between gap-4">
                    {/* Progress badges */}
                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant="secondary"
                            className="text-xs font-normal gap-1"
                        >
                            <HiBookOpen className="h-3 w-3" />
                            {review.completionPercent}% completed
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="text-xs font-normal gap-1"
                        >
                            <HiAcademicCap className="h-3 w-3" />
                            {review.masteryPercent}% mastery
                        </Badge>
                    </div>

                    {/* Edit/Delete buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="h-8 px-2"
                        >
                            <HiPencil className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="h-8 px-2 text-destructive hover:text-destructive"
                        >
                            <HiTrash className="h-4 w-4 mr-1" />
                            {isPending ? "..." : "Delete"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
