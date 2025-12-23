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
    HiArrowLeft,
    HiStar,
    HiChevronLeft,
    HiChevronRight,
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
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <p className="text-destructive">{reviewsResult.error}</p>
            </div>
        );
    }

    const { reviews, totalCount, totalPages, currentPage, hasMore } =
        reviewsResult.data;

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-8 lg:-mt-2">
            {/* Back link */}
            <Link
                href={`/courses/${courseId}`}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <HiArrowLeft className="h-4 w-4" />
                Back to course
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold mb-2">
                    Reviews for {course.title}
                </h1>

                {/* Rating summary */}
                <div className="flex items-center gap-4 text-muted-foreground">
                    {course.averageRating ? (
                        <>
                            <div className="flex items-center gap-1">
                                <HiStar className="h-5 w-5 text-amber-500 fill-amber-500" />
                                <span className="text-xl font-bold text-foreground">
                                    {course.averageRating.toFixed(1)}
                                </span>
                            </div>
                            <span>•</span>
                            <span>
                                {totalCount}{" "}
                                {totalCount === 1 ? "review" : "reviews"}
                            </span>
                        </>
                    ) : (
                        <span>No reviews yet</span>
                    )}
                </div>
            </div>

            {/* Reviews list */}
            {reviews.length > 0 ? (
                <div className="space-y-4 mb-8">
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
