export default function ProfilePage() {
    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-8">
            <h1 className="text-4xl font-display font-bold mb-4">Profile</h1>
            <p className="text-lg text-muted-foreground mb-6">
                This is the Profile page. View your learning progress and manage
                your account settings.
            </p>
            <div className="space-y-4">
                <div className="p-6 border rounded-lg bg-surface-1">
                    <h2 className="text-xl font-semibold mb-2">
                        Learning Stats
                    </h2>
                    <p className="text-muted-foreground">
                        Track your progress, streaks, and achievements.
                    </p>
                </div>
                <div className="p-6 border rounded-lg bg-surface-1">
                    <h2 className="text-xl font-semibold mb-2">
                        Account Settings
                    </h2>
                    <p className="text-muted-foreground">
                        Manage your profile information and preferences.
                    </p>
                </div>
            </div>
        </div>
    );
}
