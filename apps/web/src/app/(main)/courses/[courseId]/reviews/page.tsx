/**
 * Course Reviews Page
 *
 * Displays paginated reviews for a course with average rating summary.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../../../../../services/db/db-client";
import { getCourseReviews } from "@/app/actions/courses";
import { ReviewCard } from "@/features/courses";
import { Button } from "@/components/ui/shadcn/button";
import {
    HiStar,
    HiChevronLeft,
    HiChevronRight,
    HiArrowLeft,
} from "react-icons/hi";

interface PageProps {
    params: Promise<{ courseId: string }>;
    searchParams: Promise<{ page?: string }>;
}

async function getCourseBasicInfo(courseId: string) {
    const course = await prisma.course.findFirst({
        where: {
            id: courseId,
            visibility: "PUBLIC",
            generationStatus: "COMPLETED",
        },
        select: {
            id: true,
            title: true,
            averageRating: true,
            ratingCount: true,
        },
    });

    return course;
}

export default async function CourseReviewsPage({
    params,
    searchParams,
}: PageProps) {
    const { courseId } = await params;
    const { page: pageParam } = await searchParams;

    const course = await getCourseBasicInfo(courseId);

    if (!course) {
        notFound();
    }

    const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
    const pageSize = 20;

    const reviewsResult = await getCourseReviews(courseId, page, pageSize);

    if ("error" in reviewsResult) {
        return (
            <div className="w-full py-8">
                <p className="text-destructive">{reviewsResult.error}</p>
            </div>
        );
    }

    const { reviews, totalCount, totalPages, currentPage, hasMore } =
        reviewsResult.data;

    return (
        <div className="w-full pb-8 space-y-6">
            {/* Section header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-display font-semibold">
                        Reviews
                    </h2>
                    {course.averageRating && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <HiStar className="h-5 w-5 text-amber-500 fill-amber-500" />
                            <span className="font-medium text-foreground">
                                {course.averageRating.toFixed(1)}
                            </span>
                            <span className="text-sm">
                                ({totalCount}{" "}
                                {totalCount === 1 ? "review" : "reviews"})
                            </span>
                        </div>
                    )}
                </div>
                <Link
                    href={`/courses/${courseId}`}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <HiArrowLeft className="h-4 w-4" />
                    Back to course
                </Link>
            </div>

            {/* Reviews list */}
            {reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            {...review}
                            truncate={false}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg mb-2">No reviews yet</p>
                    <p className="text-sm">
                        Be the first to share your experience with this course!
                    </p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <nav
                    className="flex items-center justify-center gap-2"
                    aria-label="Reviews pagination"
                >
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        disabled={currentPage <= 1}
                    >
                        <Link
                            href={`/courses/${courseId}/reviews?page=${currentPage - 1}`}
                            aria-disabled={currentPage <= 1}
                            className={
                                currentPage <= 1
                                    ? "pointer-events-none opacity-50"
                                    : ""
                            }
                        >
                            <HiChevronLeft className="h-4 w-4" />
                            Previous
                        </Link>
                    </Button>

                    <span className="text-sm text-muted-foreground px-4">
                        Page {currentPage} of {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        disabled={!hasMore}
                    >
                        <Link
                            href={`/courses/${courseId}/reviews?page=${currentPage + 1}`}
                            aria-disabled={!hasMore}
                            className={
                                !hasMore ? "pointer-events-none opacity-50" : ""
                            }
                        >
                            Next
                            <HiChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </nav>
            )}
        </div>
    );
}
