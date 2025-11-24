/**
 * IP Geolocation utility using ip-api.com (free tier)
 * Caches results in memory to avoid rate limits
 */

interface CachedResult {
    result: string | null;
    timestamp: number;
}

// Simple in-memory cache (expires after 1 hour)
const cache = new Map<string, CachedResult>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Get location string from IP address
 * @param ipAddress - The IP address to geolocate
 * @returns Location string like "London, UK" or "Unknown"
 */
export async function getLocationFromIP(
    ipAddress: string | null | undefined
): Promise<string | null> {
    if (!ipAddress) {
        return null;
    }

    // Check cache first
    const cached = cache.get(ipAddress);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.result;
    }

    try {
        // Use ip-api.com free tier (no API key required)
        // Rate limit: 45 requests per minute
        const response = await fetch(
            `http://ip-api.com/json/${ipAddress}?fields=status,message,city,country,countryCode`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            // Cache null result for 5 minutes on error
            cache.set(ipAddress, {
                result: null,
                timestamp: Date.now() - (CACHE_TTL - 5 * 60 * 1000),
            });
            return null;
        }

        const data = await response.json();

        if (data.status === "fail") {
            // API error, cache null for 5 minutes
            cache.set(ipAddress, {
                result: null,
                timestamp: Date.now() - (CACHE_TTL - 5 * 60 * 1000),
            });
            return null;
        }

        // Build location string
        const parts: string[] = [];
        if (data.city) {
            parts.push(data.city);
        }
        if (data.country) {
            parts.push(data.country);
        } else if (data.countryCode) {
            parts.push(data.countryCode);
        }

        const location = parts.length > 0 ? parts.join(", ") : null;

        // Cache the result
        cache.set(ipAddress, {
            result: location,
            timestamp: Date.now(),
        });

        return location;
    } catch (error) {
        // Network error or other issue
        console.error("Geolocation error:", error);
        // Cache null result for 5 minutes
        cache.set(ipAddress, {
            result: null,
            timestamp: Date.now() - (CACHE_TTL - 5 * 60 * 1000),
        });
        return null;
    }
}

/**
 * Clear the geolocation cache (useful for testing)
 */
export function clearGeolocationCache(): void {
    cache.clear();
}
