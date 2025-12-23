/**
 * UnenrolledCourseView
 *
 * Displays course content for users who are not enrolled.
 * Shows course content accordion and reviews section.
 */

import { Accordion } from "@/components/ui/shadcn/accordion";
import { ModuleAccordion } from "@/features/courses";
import type { CourseDetail } from "@/features/courses";
import { ReviewsPreview } from "./ReviewsPreview";

interface UnenrolledCourseViewProps {
    course: CourseDetail;
    currentUserId: string | null;
}

export function UnenrolledCourseView({
    course,
    currentUserId,
}: UnenrolledCourseViewProps) {
    return (
        <div className="w-full pb-8">
            {/* Modules accordion */}
            <div className="space-y-4">
                <h2 className="text-2xl font-display font-semibold">
                    Course Content
                </h2>
                <Accordion
                    type="multiple"
                    defaultValue={[`module-${course.modules[0]?.id}`]}
                    className="space-y-4"
                >
                    {course.modules.map((module) => (
                        <ModuleAccordion key={module.id} module={module} />
                    ))}
                </Accordion>
            </div>

            {/* Reviews section */}
            <div className="mt-12">
                <ReviewsPreview
                    courseId={course.id}
                    averageRating={course.averageRating}
                    isEnrolled={false}
                    currentUserId={currentUserId}
                />
            </div>
        </div>
    );
}
