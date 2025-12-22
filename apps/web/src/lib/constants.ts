import { HiAcademicCap, HiBookOpen, HiSparkles, HiUser } from "react-icons/hi";
import { IconType } from "react-icons";

export const APP_TITLE = "Cognia";

export interface NavigationItem {
    label: string;
    href: string;
    icon: IconType;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        label: "Courses",
        href: "/courses",
        icon: HiAcademicCap,
    },
    {
        label: "Study",
        href: "/study",
        icon: HiBookOpen,
    },
    {
        label: "Explore",
        href: "/explore",
        icon: HiSparkles,
    },
    {
        label: "Profile",
        href: "/profile",
        icon: HiUser,
    },
];
