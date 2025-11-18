"use client";

import {
    HiAcademicCap,
    HiCheckCircle,
    HiExclamationCircle,
    HiXCircle,
    HiSparkles,
    HiLightningBolt,
    HiChartBar,
    HiStar,
    HiCube,
} from "react-icons/hi";
import { Button } from "@/components/ui/shadcn/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import { Badge } from "@/components/ui/shadcn/badge";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/shadcn/alert";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 lg:py-24">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-display-fun font-bold tracking-tight text-foreground">
                            Cognia
                        </h1>
                        <p className="text-2xl md:text-3xl font-display font-semibold text-primary tracking-tight">
                            Master anything, on schedule.
                        </p>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
                        Turn consistent effort into lasting understanding. Your
                        personal path to mastery, backed by science.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button
                            size="lg"
                            className="font-semibold text-lg px-8 shadow-lg shadow-primary/20"
                        >
                            Start Learning{" "}
                            <HiLightningBolt className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="font-semibold text-lg"
                        >
                            Explore Methodology
                        </Button>
                    </div>
                </div>
            </section>

            {/* Typography System */}
            <section className="container mx-auto px-4 py-16 border-t">
                <div className="flex items-center gap-2 mb-8">
                    <span className="text-4xl">Aa</span>
                    <h2 className="text-3xl font-display font-bold">
                        Typography System
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <h3 className="text-xl font-semibold border-b pb-2">
                            Font Families
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Display Fun (Space Grotesk)
                                </p>
                                <p className="font-display-fun text-4xl font-bold">
                                    The quick brown fox
                                </p>
                                <p className="font-display-fun text-xl mt-2">
                                    Used for expressive headlines and numbers.
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Display Grounded (Inter Tight)
                                </p>
                                <p className="font-display text-4xl font-bold">
                                    The quick brown fox
                                </p>
                                <p className="font-display text-xl mt-2">
                                    Used for clear, confident titling.
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Body / UI (Inter)
                                </p>
                                <p className="font-sans text-4xl font-bold">
                                    The quick brown fox
                                </p>
                                <p className="font-sans text-base mt-2">
                                    Standard for paragraphs, inputs, and
                                    buttons.
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Mono (Fira Code)
                                </p>
                                <p className="font-mono text-2xl">
                                    const learn = true;
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-xl font-semibold border-b pb-2">
                            Scale & Hierarchy
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-baseline gap-4">
                                <span className="text-xs text-muted-foreground w-12">
                                    H1
                                </span>
                                <h1 className="text-5xl md:text-6xl font-display-fun font-bold">
                                    Heading 1
                                </h1>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <span className="text-xs text-muted-foreground w-12">
                                    H2
                                </span>
                                <h2 className="text-4xl font-display font-semibold">
                                    Heading 2
                                </h2>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <span className="text-xs text-muted-foreground w-12">
                                    H3
                                </span>
                                <h3 className="text-2xl font-display font-semibold">
                                    Heading 3
                                </h3>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <span className="text-xs text-muted-foreground w-12">
                                    H4
                                </span>
                                <h4 className="text-xl font-display font-semibold">
                                    Heading 4
                                </h4>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <span className="text-xs text-muted-foreground w-12">
                                    H5
                                </span>
                                <h5 className="text-lg font-display font-semibold">
                                    Heading 5
                                </h5>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <span className="text-xs text-muted-foreground w-12">
                                    H6
                                </span>
                                <h6 className="text-base font-display font-semibold">
                                    Heading 6
                                </h6>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <span className="text-xs text-muted-foreground w-12">
                                    Body L
                                </span>
                                <p className="text-lg">
                                    Large body text for introductions.
                                </p>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <span className="text-xs text-muted-foreground w-12">
                                    Body
                                </span>
                                <p className="text-base">
                                    Default body text for standard content.
                                </p>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <span className="text-xs text-muted-foreground w-12">
                                    Small
                                </span>
                                <p className="text-sm text-muted-foreground">
                                    Small text for secondary information.
                                </p>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <span className="text-xs text-muted-foreground w-12">
                                    XS
                                </span>
                                <p className="text-xs text-muted-foreground">
                                    Extra small text for fine print.
                                </p>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold border-b pb-2 pt-4">
                            Typography Details
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Tabular Numbers (tnum)
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Essential for data tables and timers to
                                    prevent layout jitter.
                                </p>
                                <div className="grid grid-cols-2 gap-8 bg-surface-1 p-6 rounded-lg border">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                                            Default
                                        </p>
                                        <div className="font-sans text-lg space-y-1">
                                            <div className="flex justify-between">
                                                <span>Item A</span>
                                                <span>1,234.50</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Item B</span>
                                                <span>111.11</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Item C</span>
                                                <span>9,876.00</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                                            Tabular (tnum)
                                        </p>
                                        <div className="font-sans text-lg space-y-1 tnum">
                                            <div className="flex justify-between">
                                                <span>Item A</span>
                                                <span>1,234.50</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Item B</span>
                                                <span>111.11</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Item C</span>
                                                <span>9,876.00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Color System */}
            <section className="container mx-auto px-4 py-16 border-t">
                <div className="flex items-center gap-2 mb-8">
                    <HiSparkles className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-display font-bold">
                        Color System
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Primary - Purple */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-primary"></div>
                                Primary (Purple)
                            </CardTitle>
                            <CardDescription>
                                Brand identity, primary actions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div
                                    className="h-10 rounded bg-[#F3E8FF]"
                                    title="100"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#D8B4FE]"
                                    title="300"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#A855F7]"
                                    title="500"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#7C3AED]"
                                    title="600 (Brand)"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#5B21B6]"
                                    title="800"
                                ></div>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-md text-sm text-primary font-medium">
                                bg-primary/10 text-primary
                            </div>
                            <Button className="w-full">Primary Action</Button>
                        </CardContent>
                    </Card>

                    {/* Secondary - Blue */}
                    <Card className="border-secondary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-secondary"></div>
                                Secondary (Blue)
                            </CardTitle>
                            <CardDescription>
                                Supportive actions, backgrounds
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div
                                    className="h-10 rounded bg-[#DBEAFE]"
                                    title="100"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#93C5FD]"
                                    title="300"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#3B82F6]"
                                    title="500"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#2563EB]"
                                    title="600"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#1E40AF]"
                                    title="800"
                                ></div>
                            </div>
                            <div className="p-3 bg-secondary/10 rounded-md text-sm text-secondary font-medium">
                                bg-secondary/10 text-secondary
                            </div>
                            <Button variant="secondary" className="w-full">
                                Secondary Action
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Accent - Cyan */}
                    <Card className="border-accent/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-accent"></div>
                                Accent (Cyan)
                            </CardTitle>
                            <CardDescription>
                                Highlights, data viz, pills
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div
                                    className="h-10 rounded bg-[#CFFAFE]"
                                    title="100"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#67E8F9]"
                                    title="300"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#06B6D4]"
                                    title="500"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#0891B2]"
                                    title="600"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#155E75]"
                                    title="800"
                                ></div>
                            </div>
                            <div className="p-3 bg-accent/10 rounded-md text-sm text-accent font-medium">
                                bg-accent/10 text-accent
                            </div>
                            <div className="flex gap-2">
                                <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">
                                    New
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="border-accent text-accent"
                                >
                                    Tag
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gold - Reward */}
                    <Card className="border-accent-gold/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-accent-gold"></div>
                                Gold (Reward)
                            </CardTitle>
                            <CardDescription>
                                Streaks, warmth, premium
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-5 gap-2">
                                <div
                                    className="h-10 rounded bg-[#FEF3C7]"
                                    title="100"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#FDE68A]"
                                    title="200"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#FBBF24]"
                                    title="400"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#F59E0B]"
                                    title="500 (Brand)"
                                ></div>
                                <div
                                    className="h-10 rounded bg-[#D97706]"
                                    title="600"
                                ></div>
                            </div>
                            <div className="p-3 bg-accent-gold/10 rounded-md text-sm text-accent-gold font-medium">
                                bg-accent-gold/10 text-accent-gold
                            </div>
                            <div className="flex gap-2">
                                <Badge className="bg-accent-gold text-accent-gold-foreground hover:bg-accent-gold/90">
                                    <HiStar className="mr-1 h-3 w-3" /> Premium
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-lg border bg-background">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <HiCheckCircle className="text-green-600" /> Success
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Use for completion, positive feedback.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border bg-background">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <HiExclamationCircle className="text-accent-gold" />{" "}
                            Warning
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Use for caution, non-blocking issues.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border bg-background">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <HiXCircle className="text-destructive" /> Error
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Use for critical errors, destructive actions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Depth & Surfaces */}
            <section className="container mx-auto px-4 py-16 border-t">
                <div className="flex items-center gap-2 mb-8">
                    <HiCube className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-display font-bold">
                        Depth & Surfaces
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-background p-8 rounded-lg border flex flex-col items-center justify-center text-center">
                        <p className="font-bold mb-2">Base Background</p>
                        <p className="text-sm text-muted-foreground">
                            Level 0 - Pure White
                        </p>
                    </div>
                    <div className="bg-surface-1 p-8 rounded-lg border shadow-sm flex flex-col items-center justify-center text-center">
                        <p className="font-bold mb-2">Surface 1</p>
                        <p className="text-sm text-muted-foreground">
                            Raised - Cards, Sidebars
                        </p>
                    </div>
                    <div className="bg-surface-2 p-8 rounded-lg border shadow-md flex flex-col items-center justify-center text-center">
                        <p className="font-bold mb-2">Surface 2</p>
                        <p className="text-sm text-muted-foreground">
                            Overlay - Dropdowns
                        </p>
                    </div>
                </div>
            </section>

            {/* Data Visualization */}
            <section className="container mx-auto px-4 py-16 border-t">
                <div className="flex items-center gap-2 mb-8">
                    <HiChartBar className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-display font-bold">
                        Data Visualization
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="space-y-2">
                        <div className="h-24 rounded-lg bg-chart-1 w-full"></div>
                        <p className="text-sm font-medium text-center">
                            Chart 1 (Teal)
                        </p>
                        <p className="text-xs text-center text-muted-foreground">
                            Mastery
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 rounded-lg bg-chart-2 w-full"></div>
                        <p className="text-sm font-medium text-center">
                            Chart 2 (Coral)
                        </p>
                        <p className="text-xs text-center text-muted-foreground">
                            Struggle
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 rounded-lg bg-chart-3 w-full"></div>
                        <p className="text-sm font-medium text-center">
                            Chart 3 (Slate)
                        </p>
                        <p className="text-xs text-center text-muted-foreground">
                            Neutral
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 rounded-lg bg-chart-4 w-full"></div>
                        <p className="text-sm font-medium text-center">
                            Chart 4 (Yellow)
                        </p>
                        <p className="text-xs text-center text-muted-foreground">
                            Progress
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 rounded-lg bg-chart-5 w-full"></div>
                        <p className="text-sm font-medium text-center">
                            Chart 5 (Orange)
                        </p>
                        <p className="text-xs text-center text-muted-foreground">
                            Warning
                        </p>
                    </div>
                </div>
            </section>

            {/* Component Showcase */}
            <section className="container mx-auto px-4 py-16 border-t">
                <h2 className="text-3xl font-display font-bold mb-8">
                    Component Design
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Buttons */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold">
                            Buttons & Actions
                        </h3>
                        <div className="flex flex-wrap gap-4 p-6 border rounded-xl bg-surface-1">
                            <Button>Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="link">Link</Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 p-6 border rounded-xl bg-surface-1">
                            <Button size="lg">Large Button</Button>
                            <Button>Default</Button>
                            <Button size="sm">Small</Button>
                            <Button size="icon">
                                <HiLightningBolt />
                            </Button>
                        </div>
                    </div>

                    {/* Forms */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold">
                            Inputs & Forms
                        </h3>
                        <div className="space-y-4 p-6 border rounded-xl bg-surface-1 max-w-md">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Email Address
                                </label>
                                <Input placeholder="student@cognia.app" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-destructive">
                                    Error State
                                </label>
                                <Input
                                    defaultValue="invalid-email"
                                    className="border-destructive text-destructive"
                                />
                                <p className="text-xs text-destructive">
                                    Please enter a valid email address.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cards & Content */}
                    <div className="space-y-6 lg:col-span-2">
                        <h3 className="text-xl font-semibold">
                            Cards & Feedback
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="shadow-md hover:shadow-lg transition-all">
                                <CardHeader>
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 text-primary">
                                        <HiAcademicCap className="h-6 w-6" />
                                    </div>
                                    <CardTitle>Learning Path</CardTitle>
                                    <CardDescription>
                                        Structured modules for mastery
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Cards use a rounded-lg radius and
                                        consistent padding. Icons are often
                                        paired with a soft background.
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Start Module
                                    </Button>
                                </CardFooter>
                            </Card>

                            <div className="space-y-4">
                                <Alert>
                                    <HiSparkles className="h-4 w-4 text-primary" />
                                    <AlertTitle>New Feature</AlertTitle>
                                    <AlertDescription>
                                        Cognia now supports dark mode!
                                    </AlertDescription>
                                </Alert>
                                <Alert variant="destructive">
                                    <HiXCircle className="h-4 w-4" />
                                    <AlertTitle>
                                        Authentication Error
                                    </AlertTitle>
                                    <AlertDescription>
                                        Please sign in again to continue.
                                    </AlertDescription>
                                </Alert>
                            </div>

                            <div className="space-y-4 p-6 border rounded-lg bg-surface-1">
                                <h4 className="font-medium mb-2">
                                    Loading States
                                </h4>
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[200px]" />
                                        <Skeleton className="h-4 w-[150px]" />
                                    </div>
                                </div>
                                <Skeleton className="h-[100px] w-full rounded-xl mt-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shape & Spacing */}
            <section className="container mx-auto px-4 py-16 border-t pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-display font-bold mb-6">
                            Shape Language
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="aspect-square bg-primary rounded-sm flex items-center justify-center text-primary-foreground text-xs">
                                sm (4)
                            </div>
                            <div className="aspect-square bg-primary rounded-md flex items-center justify-center text-primary-foreground text-xs">
                                md (8)
                            </div>
                            <div className="aspect-square bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xs">
                                lg (16)
                            </div>
                            <div className="aspect-square bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs">
                                full
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-bold mb-6">
                            Spacing System
                        </h2>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-secondary rounded"></div>
                                <span className="text-xs text-muted-foreground">
                                    xs (4px)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-4 bg-secondary rounded"></div>
                                <span className="text-xs text-muted-foreground">
                                    sm (8px)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-4 bg-secondary rounded"></div>
                                <span className="text-xs text-muted-foreground">
                                    md (16px)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-4 bg-secondary rounded"></div>
                                <span className="text-xs text-muted-foreground">
                                    lg (24px)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
