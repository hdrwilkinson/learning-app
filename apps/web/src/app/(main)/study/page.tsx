export default function StudyPage() {
    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-display font-bold mb-4">Study</h1>
            <p className="text-lg text-muted-foreground mb-6">
                This is the Study page. Review your materials and practice what
                you&apos;ve learned.
            </p>
            <div className="space-y-4">
                <div className="p-6 border rounded-lg bg-surface-1">
                    <h2 className="text-xl font-semibold mb-2">
                        Practice Sessions
                    </h2>
                    <p className="text-muted-foreground">
                        Test your knowledge with interactive quizzes and
                        exercises.
                    </p>
                </div>
                <div className="p-6 border rounded-lg bg-surface-1">
                    <h2 className="text-xl font-semibold mb-2">
                        Review Materials
                    </h2>
                    <p className="text-muted-foreground">
                        Revisit key concepts and information points.
                    </p>
                </div>
            </div>
        </div>
    );
}
