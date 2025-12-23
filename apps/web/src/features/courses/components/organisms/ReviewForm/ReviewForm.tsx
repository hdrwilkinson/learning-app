"use client";

/**
 * ReviewForm Component
 *
 * Allows enrolled users to submit or update their course review.
 * Shows their current progress that will be attached to the review.
 */

import { useState, useTransition } from "react";
import { HiStar, HiBookOpen, HiAcademicCap } from "react-icons/hi";
import { Button } from "@/components/ui/shadcn/button";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { Badge } from "@/components/ui/shadcn/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card";
import { cn } from "@/lib/utils";
import { submitCourseReview, deleteCourseReview } from "@/app/actions/courses";

interface ReviewFormProps {
    courseId: string;
    /** User's current progress in the course */
    completionPercent: number;
    masteryPercent: number;
    /** Existing review data (if user has already reviewed) */
    existingReview?: {
        rating: number;
        review: string | null;
    } | null;
}

export function ReviewForm({
    courseId,
    completionPercent,
    masteryPercent,
    existingReview,
}: ReviewFormProps) {
    const [rating, setRating] = useState<number>(existingReview?.rating ?? 0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [review, setReview] = useState<string>(existingReview?.review ?? "");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const isEditing = !!existingReview;
    const displayRating = hoverRating || rating;

    // Check if anything has changed from the original review
    const hasChanges = isEditing
        ? rating !== existingReview.rating ||
          (review.trim() || null) !== (existingReview.review || null)
        : true; // For new reviews, always allow submit

    const handleSubmit = () => {
        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setError(null);
        setSuccess(null);

        startTransition(async () => {
            const result = await submitCourseReview(
                courseId,
                rating,
                review.trim() || undefined
            );

            if ("error" in result) {
                setError(result.error);
            } else {
                setSuccess(result.message);
            }
        });
    };

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete your review?")) {
            return;
        }

        setError(null);
        setSuccess(null);

        startTransition(async () => {
            const result = await deleteCourseReview(courseId);

            if ("error" in result) {
                setError(result.error);
            } else {
                setSuccess(result.message);
                setRating(0);
                setReview("");
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">
                    {isEditing ? "Update Your Review" : "Write a Review"}
                </CardTitle>
                <CardDescription>
                    Share your experience to help other learners
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Progress badges - what will be attached */}
                <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">
                        Your current progress:
                    </span>
                    <Badge
                        variant="secondary"
                        className="text-xs font-normal gap-1"
                    >
                        <HiBookOpen className="h-3 w-3" />
                        {completionPercent}% completed
                    </Badge>
                    <Badge
                        variant="secondary"
                        className="text-xs font-normal gap-1"
                    >
                        <HiAcademicCap className="h-3 w-3" />
                        {masteryPercent}% mastery
                    </Badge>
                </div>

                {/* Star rating selector */}
                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Rating <span className="text-destructive">*</span>
                    </label>
                    <div
                        className="flex items-center gap-1"
                        role="radiogroup"
                        aria-label="Rating"
                    >
                        {Array.from({ length: 5 }).map((_, i) => {
                            const starValue = i + 1;
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    className={cn(
                                        "p-1 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                        "hover:scale-110 transition-transform"
                                    )}
                                    onClick={() => setRating(starValue)}
                                    onMouseEnter={() =>
                                        setHoverRating(starValue)
                                    }
                                    onMouseLeave={() => setHoverRating(0)}
                                    aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
                                    aria-pressed={rating === starValue}
                                    disabled={isPending}
                                >
                                    <HiStar
                                        className={cn(
                                            "h-8 w-8 transition-colors",
                                            starValue <= displayRating
                                                ? "text-amber-500 fill-amber-500"
                                                : "text-muted-foreground/30"
                                        )}
                                    />
                                </button>
                            );
                        })}
                        {displayRating > 0 && (
                            <span className="ml-2 text-sm text-muted-foreground">
                                {displayRating === 1 && "Poor"}
                                {displayRating === 2 && "Fair"}
                                {displayRating === 3 && "Good"}
                                {displayRating === 4 && "Very Good"}
                                {displayRating === 5 && "Excellent"}
                            </span>
                        )}
                    </div>
                </div>

                {/* Review text */}
                <div>
                    <label
                        htmlFor="review-text"
                        className="text-sm font-medium mb-2 block"
                    >
                        Review{" "}
                        <span className="text-muted-foreground font-normal">
                            (optional)
                        </span>
                    </label>
                    <Textarea
                        id="review-text"
                        placeholder="What did you think about this course? Share your experience..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="min-h-[100px] resize-none"
                        disabled={isPending}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        {review.length}/1000 characters
                    </p>
                </div>

                {/* Error/success messages */}
                {error && (
                    <p className="text-sm text-destructive" role="alert">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-sm text-green-600" role="status">
                        {success}
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
                {isEditing && (
                    <Button
                        variant="outline"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="text-destructive hover:text-destructive"
                    >
                        Delete Review
                    </Button>
                )}
                <Button
                    onClick={handleSubmit}
                    disabled={
                        isPending || rating === 0 || (isEditing && !hasChanges)
                    }
                    className={cn(!isEditing && "ml-auto")}
                >
                    {isPending
                        ? "Submitting..."
                        : isEditing
                          ? "Update Review"
                          : "Submit Review"}
                </Button>
            </CardFooter>
        </Card>
    );
}
