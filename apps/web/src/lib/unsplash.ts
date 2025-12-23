/**
 * Unsplash API Integration
 *
 * Server-side utility for fetching images from Unsplash.
 * Used during course creation to assign relevant cover images.
 *
 * @see https://unsplash.com/documentation
 */

const UNSPLASH_API_URL = "https://api.unsplash.com";

interface UnsplashPhoto {
    id: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    user: {
        name: string;
        username: string;
        links: {
            html: string;
        };
    };
    alt_description: string | null;
    description: string | null;
}

interface UnsplashSearchResponse {
    total: number;
    total_pages: number;
    results: UnsplashPhoto[];
}

export interface UnsplashImageResult {
    /** Optimized image URL with sizing parameters */
    url: string;
    /** Original photographer name (for attribution) */
    photographerName: string;
    /** Link to photographer's Unsplash profile (for attribution) */
    photographerUrl: string;
    /** Alt text for accessibility */
    altText: string;
}

/**
 * Search Unsplash for images matching a query
 *
 * @param query - Search term (e.g., course topic or title)
 * @param options - Search options
 * @returns First matching image result, or null if none found
 */
export async function searchUnsplashImage(
    query: string,
    options: {
        /** Image width in pixels (default: 800) */
        width?: number;
        /** Image height in pixels (default: 450 for 16:9 aspect) */
        height?: number;
        /** Orientation filter */
        orientation?: "landscape" | "portrait" | "squarish";
    } = {}
): Promise<UnsplashImageResult | null> {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!accessKey) {
        console.warn(
            "UNSPLASH_ACCESS_KEY not configured. Skipping image fetch."
        );
        return null;
    }

    const { width = 800, height = 450, orientation = "landscape" } = options;

    try {
        const params = new URLSearchParams({
            query,
            orientation,
            per_page: "1",
        });

        const response = await fetch(
            `${UNSPLASH_API_URL}/search/photos?${params}`,
            {
                headers: {
                    Authorization: `Client-ID ${accessKey}`,
                },
            }
        );

        if (!response.ok) {
            if (response.status === 403) {
                console.error(
                    "Unsplash API rate limit exceeded or invalid key"
                );
            } else {
                console.error(
                    `Unsplash API error: ${response.status} ${response.statusText}`
                );
            }
            return null;
        }

        const data: UnsplashSearchResponse = await response.json();

        if (data.results.length === 0) {
            return null;
        }

        const photo = data.results[0];

        // Build optimized URL with Unsplash's dynamic resizing
        // Format: raw URL + query params for dimensions and fit
        const optimizedUrl = `${photo.urls.raw}&w=${width}&h=${height}&fit=crop&auto=format`;

        return {
            url: optimizedUrl,
            photographerName: photo.user.name,
            photographerUrl: photo.user.links.html,
            altText:
                photo.alt_description ||
                photo.description ||
                `Image for ${query}`,
        };
    } catch (error) {
        console.error("Failed to fetch image from Unsplash:", error);
        return null;
    }
}

/**
 * Get an Unsplash image URL for a course
 *
 * Tries the topic first, then falls back to title keywords.
 *
 * @param topic - Course topic (e.g., "Philosophy")
 * @param title - Course title as fallback
 * @returns Optimized image URL or null
 */
export async function getCourseImageUrl(
    topic: string | null,
    title: string
): Promise<string | null> {
    // Try topic first (more general, better results)
    if (topic) {
        const result = await searchUnsplashImage(topic);
        if (result) {
            return result.url;
        }
    }

    // Fallback to title (extract first 2-3 meaningful words)
    const titleWords = title
        .split(/\s+/)
        .filter((word) => word.length > 3)
        .slice(0, 3)
        .join(" ");

    if (titleWords) {
        const result = await searchUnsplashImage(titleWords);
        if (result) {
            return result.url;
        }
    }

    return null;
}

/**
 * Build a static Unsplash URL for known images (used in seed data)
 *
 * @param photoId - Unsplash photo ID
 * @param width - Desired width (default: 800)
 * @param height - Desired height (default: 450)
 * @returns Formatted Unsplash source URL
 */
export function buildUnsplashUrl(
    photoId: string,
    width: number = 800,
    height: number = 450
): string {
    return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&auto=format`;
}
