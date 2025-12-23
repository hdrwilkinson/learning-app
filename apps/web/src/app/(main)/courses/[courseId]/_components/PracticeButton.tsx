/**
 * PracticeButton
 *
 * Prominent CTA for starting a curated study session.
 */

import Link from "next/link";
import { HiPlay } from "react-icons/hi";

interface PracticeButtonProps {
    courseId: string;
}

export function PracticeButton({ courseId }: PracticeButtonProps) {
    return (
        <Link
            href={`/courses/${courseId}/practice`}
            className="block w-full group"
        >
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20" />
                    <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-white/10" />
                </div>

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:scale-110">
                            <HiPlay className="h-8 w-8 text-white ml-1" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                Practice Now
                            </h3>
                            <p className="text-sm text-white/80">
                                Continue your learning journey
                            </p>
                        </div>
                    </div>

                    <div className="hidden sm:block">
                        <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white">
                            <span>Start Session</span>
                            <span className="transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
