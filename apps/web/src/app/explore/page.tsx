/**
 * Explore Page
 *
 * A focused chat experience for exploring any topic freely.
 * Uses FocusLayout with left sidebar, no right accessory panel.
 * Access at: http://localhost:3002/explore
 */

"use client";

import { Chat } from "@/components/ui/organisms/Chat";
import { FocusLayout } from "@/components/ui/layout";
import { Button } from "@/components/ui/shadcn/button";
import { HiPlus, HiBookmark } from "react-icons/hi";

export default function ExplorePage() {
    const handleNewChat = () => {
        // TODO: Implement new chat functionality
        console.log("New chat requested");
    };

    const handleSave = () => {
        // TODO: Implement save functionality
        alert("Save Discovery feature coming soon!");
    };

    return (
        <FocusLayout
            title="Explore"
            icon="🔮"
            backHref="/"
            actions={
                <>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNewChat}
                        className="gap-1.5"
                    >
                        <HiPlus className="h-4 w-4" />
                        <span className="hidden sm:inline">New</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSave}
                        className="gap-1.5"
                    >
                        <HiBookmark className="h-4 w-4" />
                        <span className="hidden sm:inline">Save</span>
                    </Button>
                </>
            }
        >
            <Chat
                mode="curiosity"
                options={{
                    courseId: undefined,
                    courseTitle: undefined,
                    courseDescription: undefined,
                    completedTopics: [],
                    progress: undefined,
                }}
                onAction={(action) => {
                    console.log("Action triggered:", action);
                    if (action === "save") {
                        handleSave();
                    }
                    if (action === "new-topic") {
                        handleNewChat();
                    }
                }}
            />
        </FocusLayout>
    );
}
