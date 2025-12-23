/**
 * StudyModesGrid
 *
 * Grid layout for the 6 secondary study mode cards.
 * Layout: 2 rows × 3 columns on larger screens, 3 rows × 2 columns on mobile.
 */

import {
    HiLightningBolt,
    HiRefresh,
    HiClock,
    HiBookOpen,
    HiVolumeUp,
    HiSparkles,
} from "react-icons/hi";
import { StudyModeCard } from "./StudyModeCard";

interface StudyModesGridProps {
    courseId: string;
}

const STUDY_MODES = [
    {
        id: "weaknesses",
        title: "Weaknesses",
        description: "Focus on low-mastery concepts",
        icon: HiLightningBolt,
        iconColor: "text-amber-600",
        iconBgColor: "bg-amber-500/10",
    },
    {
        id: "mistakes",
        title: "Mistakes",
        description: "Redo recently wrong answers",
        icon: HiRefresh,
        iconColor: "text-rose-600",
        iconBgColor: "bg-rose-500/10",
    },
    {
        id: "timed",
        title: "Timed",
        description: "Speed-based challenge",
        icon: HiClock,
        iconColor: "text-blue-600",
        iconBgColor: "bg-blue-500/10",
    },
    {
        id: "stories",
        title: "Stories",
        description: "Contextual scenarios",
        icon: HiBookOpen,
        iconColor: "text-emerald-600",
        iconBgColor: "bg-emerald-500/10",
    },
    {
        id: "listening",
        title: "Listening",
        description: "Audio-based practice",
        icon: HiVolumeUp,
        iconColor: "text-violet-600",
        iconBgColor: "bg-violet-500/10",
    },
    {
        id: "lucky-dip",
        title: "Lucky Dip",
        description: "Random mix of content",
        icon: HiSparkles,
        iconColor: "text-pink-600",
        iconBgColor: "bg-pink-500/10",
    },
] as const;

export function StudyModesGrid({ courseId }: StudyModesGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STUDY_MODES.map((mode) => (
                <StudyModeCard
                    key={mode.id}
                    href={`/courses/${courseId}/study/${mode.id}`}
                    icon={mode.icon}
                    title={mode.title}
                    description={mode.description}
                    iconColor={mode.iconColor}
                    iconBgColor={mode.iconBgColor}
                />
            ))}
        </div>
    );
}
