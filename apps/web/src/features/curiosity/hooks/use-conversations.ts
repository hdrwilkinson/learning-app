/**
 * useConversations Hook
 *
 * Manages the list of conversations for the current user.
 * Uses Zustand for shared state across components.
 * Provides CRUD operations with optimistic updates and local caching.
 */

"use client";

import { useEffect, useCallback, useRef } from "react";
import { create } from "zustand";
import type { ConversationMeta, ListConversationsResponse } from "../types";

// localStorage keys
const CACHE_KEY = "cognia:conversations:list";
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CachedData {
    conversations: ConversationMeta[];
    timestamp: number;
}

/**
 * Save conversations to localStorage cache.
 */
function saveToCache(convos: ConversationMeta[]) {
    if (typeof window === "undefined") return;

    try {
        const data: CachedData = {
            conversations: convos,
            timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
        // Silently fail if localStorage is full
    }
}

/**
 * Load conversations from localStorage cache.
 */
function loadFromCache(): ConversationMeta[] | null {
    if (typeof window === "undefined") return null;

    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const data: CachedData = JSON.parse(cached);
        const isExpired = Date.now() - data.timestamp > CACHE_EXPIRY;

        if (isExpired) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }

        return data.conversations;
    } catch {
        return null;
    }
}

/**
 * Zustand store for shared conversation state.
 */
interface ConversationsState {
    conversations: ConversationMeta[];
    isLoading: boolean;
    error: Error | null;
    hasMore: boolean;
    nextCursor: string | undefined;
    isFetching: boolean;
    hasFetched: boolean;
}

interface ConversationsActions {
    setConversations: (convos: ConversationMeta[]) => void;
    appendConversations: (convos: ConversationMeta[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: Error | null) => void;
    setHasMore: (hasMore: boolean) => void;
    setNextCursor: (cursor: string | undefined) => void;
    setIsFetching: (fetching: boolean) => void;
    setHasFetched: (fetched: boolean) => void;
    addConversation: (conv: ConversationMeta) => void;
    updateConversation: (
        id: string,
        updates: Partial<ConversationMeta>
    ) => void;
    removeConversation: (id: string) => void;
    bumpConversation: (id: string) => void;
}

type ConversationsStore = ConversationsState & ConversationsActions;

export const useConversationsStore = create<ConversationsStore>((set, get) => ({
    // State
    conversations: [],
    isLoading: true,
    error: null,
    hasMore: false,
    nextCursor: undefined,
    isFetching: false,
    hasFetched: false,

    // Actions
    setConversations: (convos) => {
        set({ conversations: convos });
        saveToCache(convos);
    },
    appendConversations: (convos) => {
        const newList = [...get().conversations, ...convos];
        set({ conversations: newList });
        saveToCache(newList);
    },
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setHasMore: (hasMore) => set({ hasMore }),
    setNextCursor: (cursor) => set({ nextCursor: cursor }),
    setIsFetching: (fetching) => set({ isFetching: fetching }),
    setHasFetched: (fetched) => set({ hasFetched: fetched }),

    addConversation: (conv) => {
        const current = get().conversations;
        // Don't add if already exists
        if (current.find((c) => c.id === conv.id)) return;
        const newList = [conv, ...current];
        set({ conversations: newList });
        saveToCache(newList);
    },
    updateConversation: (id, updates) => {
        const newList = get().conversations.map((c) =>
            c.id === id ? { ...c, ...updates } : c
        );
        set({ conversations: newList });
        saveToCache(newList);
    },
    removeConversation: (id) => {
        const newList = get().conversations.filter((c) => c.id !== id);
        set({ conversations: newList });
        saveToCache(newList);
    },
    bumpConversation: (id) => {
        const current = get().conversations;
        const index = current.findIndex((c) => c.id === id);
        if (index === -1) return;

        const newList = [...current];
        const [item] = newList.splice(index, 1);
        newList.unshift({ ...item, updatedAt: new Date().toISOString() });
        set({ conversations: newList });
        saveToCache(newList);
    },
}));

/**
 * Hook for managing conversation list.
 * Uses shared Zustand store for state synchronization across components.
 */
export function useConversations() {
    // Use selectors for stable references
    const conversations = useConversationsStore((s) => s.conversations);
    const isLoading = useConversationsStore((s) => s.isLoading);
    const error = useConversationsStore((s) => s.error);
    const hasMore = useConversationsStore((s) => s.hasMore);
    // Note: nextCursor, isFetching, hasFetched are accessed via getState() in callbacks

    // Get actions (these are stable references)
    const setConversations = useConversationsStore((s) => s.setConversations);
    const appendConversations = useConversationsStore(
        (s) => s.appendConversations
    );
    const setLoading = useConversationsStore((s) => s.setLoading);
    const setError = useConversationsStore((s) => s.setError);
    const setHasMore = useConversationsStore((s) => s.setHasMore);
    const setNextCursor = useConversationsStore((s) => s.setNextCursor);
    const setIsFetching = useConversationsStore((s) => s.setIsFetching);
    const setHasFetched = useConversationsStore((s) => s.setHasFetched);
    const storeAddConversation = useConversationsStore(
        (s) => s.addConversation
    );
    const storeUpdateConversation = useConversationsStore(
        (s) => s.updateConversation
    );
    const storeRemoveConversation = useConversationsStore(
        (s) => s.removeConversation
    );
    const storeBumpConversation = useConversationsStore(
        (s) => s.bumpConversation
    );

    // Track if initial fetch has been triggered
    const fetchTriggeredRef = useRef(false);

    /**
     * Fetch conversations from API.
     */
    const fetchConversations = useCallback(
        async (cursor?: string) => {
            const state = useConversationsStore.getState();
            if (state.isFetching) return;

            setIsFetching(true);

            try {
                const params = new URLSearchParams();
                params.set("limit", "20");
                if (cursor) params.set("cursor", cursor);

                const response = await fetch(`/api/conversations?${params}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch conversations");
                }

                const data: ListConversationsResponse = await response.json();

                if (cursor) {
                    appendConversations(data.conversations);
                } else {
                    setConversations(data.conversations);
                }

                setHasMore(data.hasMore);
                setNextCursor(data.nextCursor);
                setError(null);
                setHasFetched(true);
            } catch (err) {
                setError(
                    err instanceof Error ? err : new Error("Unknown error")
                );
            } finally {
                setLoading(false);
                setIsFetching(false);
            }
        },
        [
            setConversations,
            appendConversations,
            setLoading,
            setError,
            setHasMore,
            setNextCursor,
            setIsFetching,
            setHasFetched,
        ]
    );

    /**
     * Load more conversations (pagination).
     */
    const loadMore = useCallback(() => {
        const state = useConversationsStore.getState();
        if (state.hasMore && state.nextCursor && !state.isFetching) {
            fetchConversations(state.nextCursor);
        }
    }, [fetchConversations]);

    /**
     * Refresh the conversation list.
     */
    const refresh = useCallback(() => {
        setNextCursor(undefined);
        setLoading(true);
        fetchConversations();
    }, [fetchConversations, setNextCursor, setLoading]);

    /**
     * Create a new conversation.
     */
    const createConversation = useCallback(
        async (title?: string): Promise<ConversationMeta | null> => {
            try {
                const response = await fetch("/api/conversations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title }),
                });

                if (!response.ok) {
                    throw new Error("Failed to create conversation");
                }

                const data = await response.json();
                const newConvo: ConversationMeta = {
                    ...data,
                    messagePreview: "",
                    summary: null,
                };

                storeAddConversation(newConvo);
                return newConvo;
            } catch (err) {
                setError(
                    err instanceof Error ? err : new Error("Unknown error")
                );
                return null;
            }
        },
        [storeAddConversation, setError]
    );

    /**
     * Rename a conversation.
     */
    const renameConversation = useCallback(
        async (id: string, title: string): Promise<boolean> => {
            // Optimistic update
            storeUpdateConversation(id, { title });

            try {
                const response = await fetch(`/api/conversations/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title }),
                });

                if (!response.ok) {
                    throw new Error("Failed to rename conversation");
                }

                return true;
            } catch (err) {
                // Rollback on failure
                refresh();
                setError(
                    err instanceof Error ? err : new Error("Unknown error")
                );
                return false;
            }
        },
        [storeUpdateConversation, refresh, setError]
    );

    /**
     * Delete a conversation.
     */
    const deleteConversation = useCallback(
        async (id: string): Promise<boolean> => {
            // Store for rollback
            const previousConversations =
                useConversationsStore.getState().conversations;

            // Optimistic update
            storeRemoveConversation(id);

            try {
                const response = await fetch(`/api/conversations/${id}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error("Failed to delete conversation");
                }

                return true;
            } catch (err) {
                // Rollback on failure
                setConversations(previousConversations);
                setError(
                    err instanceof Error ? err : new Error("Unknown error")
                );
                return false;
            }
        },
        [storeRemoveConversation, setConversations, setError]
    );

    /**
     * Archive a conversation.
     */
    const archiveConversation = useCallback(
        async (id: string): Promise<boolean> => {
            // Optimistic update - remove from list
            storeRemoveConversation(id);

            try {
                const response = await fetch(`/api/conversations/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ archived: true }),
                });

                if (!response.ok) {
                    throw new Error("Failed to archive conversation");
                }

                return true;
            } catch (err) {
                // Rollback on failure
                refresh();
                setError(
                    err instanceof Error ? err : new Error("Unknown error")
                );
                return false;
            }
        },
        [storeRemoveConversation, refresh, setError]
    );

    /**
     * Update a conversation in the list (e.g., after title generation).
     */
    const updateConversation = useCallback(
        (id: string, updates: Partial<ConversationMeta>) => {
            storeUpdateConversation(id, updates);
        },
        [storeUpdateConversation]
    );

    /**
     * Move a conversation to the top (after activity).
     */
    const bumpConversation = useCallback(
        (id: string) => {
            storeBumpConversation(id);
        },
        [storeBumpConversation]
    );

    /**
     * Add a new conversation to the list (for external creation).
     */
    const addConversation = useCallback(
        (conv: ConversationMeta) => {
            storeAddConversation(conv);
        },
        [storeAddConversation]
    );

    // Initial load - only runs once per app lifecycle
    useEffect(() => {
        // Skip if already triggered
        if (fetchTriggeredRef.current) return;

        const state = useConversationsStore.getState();

        // Skip if already fetched or currently fetching
        if (state.hasFetched || state.isFetching) return;

        fetchTriggeredRef.current = true;

        // Try to load from cache first for instant display
        if (state.conversations.length === 0) {
            const cached = loadFromCache();
            if (cached && cached.length > 0) {
                setConversations(cached);
                setLoading(false);
            }
        }

        // Fetch fresh data
        fetchConversations();
    }, [fetchConversations, setConversations, setLoading]);

    return {
        conversations,
        isLoading,
        error,
        hasMore,
        loadMore,
        refresh,
        createConversation,
        renameConversation,
        deleteConversation,
        archiveConversation,
        updateConversation,
        bumpConversation,
        addConversation,
    };
}
