export default function LearnPage() {
    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-display font-bold mb-4">Learn</h1>
            <p className="text-lg text-muted-foreground mb-6">
                This is the Learn page. Here you can explore structured learning
                paths and courses.
            </p>
            <div className="space-y-4">
                <div className="p-6 border rounded-lg bg-surface-1">
                    <h2 className="text-xl font-semibold mb-2">
                        Course Example
                    </h2>
                    <p className="text-muted-foreground">
                        Start your learning journey with structured modules and
                        lessons.
                    </p>
                </div>
                <div className="p-6 border rounded-lg bg-surface-1">
                    <h2 className="text-xl font-semibold mb-2">
                        Learning Path
                    </h2>
                    <p className="text-muted-foreground">
                        Follow personalized pathways tailored to your goals.
                    </p>
                </div>
            </div>
        </div>
    );
}
