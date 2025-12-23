/**
 * ReviewsPreview Component
 *
 * Displays a preview of course reviews with a link to see all reviews.
 * Shows user's review at top with edit/delete, or form if no review yet.
 */

import Link from "next/link";
import {
    getCourseReviewsPreview,
    getUserCourseProgress,
    getUserCourseReview,
    type CourseReviewData,
} from "@/app/actions/courses";
import { ReviewCard } from "@/features/courses";
import { Button } from "@/components/ui/shadcn/button";
import { HiArrowRight, HiStar } from "react-icons/hi";
import { UserReviewSection } from "./UserReviewSection";

interface ReviewsPreviewProps {
    courseId: string;
    averageRating: number | null;
    isEnrolled: boolean;
    currentUserId: string | null;
}

export async function ReviewsPreview({
    courseId,
    averageRating,
    isEnrolled,
    currentUserId,
}: ReviewsPreviewProps) {
    // Fetch reviews preview
    const reviewsResult = await getCourseReviewsPreview(courseId, 3);

    if ("error" in reviewsResult) {
        return null;
    }

    const { reviews, totalCount } = reviewsResult;

    // Fetch user's progress and existing review if enrolled
    let userProgress = { completionPercent: 0, masteryPercent: 0 };
    let userReview: CourseReviewData | null = null;

    if (isEnrolled) {
        const [progressResult, reviewResult] = await Promise.all([
            getUserCourseProgress(courseId),
            getUserCourseReview(courseId),
        ]);

        if ("success" in progressResult) {
            userProgress = {
                completionPercent: progressResult.progress.completionPercent,
                masteryPercent: progressResult.progress.masteryPercent,
            };
        }

        if ("success" in reviewResult && reviewResult.review) {
            userReview = reviewResult.review;
        }
    }

    // Filter out user's review from the list (it will be shown separately at top)
    const otherReviews = currentUserId
        ? reviews.filter((r) => r.user.id !== currentUserId)
        : reviews;

    return (
        <section className="space-y-6">
            {/* Section header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-display font-semibold">
                        Reviews
                    </h2>
                    {averageRating && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <HiStar className="h-5 w-5 text-amber-500 fill-amber-500" />
                            <span className="font-medium text-foreground">
                                {averageRating.toFixed(1)}
                            </span>
                            <span className="text-sm">
                                ({totalCount}{" "}
                                {totalCount === 1 ? "review" : "reviews"})
                            </span>
                        </div>
                    )}
                </div>
                {totalCount > 0 && (
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/courses/${courseId}/reviews`}>
                            See all reviews
                            <HiArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                    </Button>
                )}
            </div>

            {/* User's review section (form or their review with edit/delete) */}
            {isEnrolled && (
                <UserReviewSection
                    courseId={courseId}
                    completionPercent={userProgress.completionPercent}
                    masteryPercent={userProgress.masteryPercent}
                    existingReview={userReview}
                />
            )}

            {/* Other reviews list */}
            {otherReviews.length > 0 && (
                <div className="space-y-4">
                    {otherReviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            {...review}
                            truncate={false}
                        />
                    ))}
                </div>
            )}

            {/* Empty state when no reviews at all */}
            {reviews.length === 0 && !isEnrolled && (
                <div className="p-8 bg-muted/50 rounded-lg border text-center">
                    <p className="text-muted-foreground mb-2">No reviews yet</p>
                    <p className="text-sm text-muted-foreground">
                        Enroll in this course to leave a review.
                    </p>
                </div>
            )}

            {/* Link to all reviews if more than 3 */}
            {totalCount > 3 && (
                <div className="text-center pt-2">
                    <Button variant="outline" asChild>
                        <Link href={`/courses/${courseId}/reviews`}>
                            View all {totalCount} reviews
                            <HiArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                    </Button>
                </div>
            )}
        </section>
    );
}
