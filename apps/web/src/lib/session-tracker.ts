import { prisma } from "../../../../services/db/db-client";
import { parseUserAgent } from "./user-agent";
import { getLocationFromIP } from "./geolocation";
import { sendNewLoginAlert } from "./mail";
import crypto from "crypto";

/**
 * Extract IP address from request headers
 */
export function getIPAddress(headers: Headers): string | null {
    // Check x-forwarded-for first (for proxies/load balancers)
    const forwardedFor = headers.get("x-forwarded-for");
    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwardedFor.split(",")[0].trim();
    }

    // Check x-real-ip (common proxy header)
    const realIP = headers.get("x-real-ip");
    if (realIP) {
        return realIP.trim();
    }

    return null;
}

/**
 * Create a hash for device identification
 */
function createDeviceHash(
    userAgent: string | null,
    location: string | null
): string {
    const combined = `${userAgent || ""}|${location || ""}`;
    return crypto.createHash("sha256").update(combined).digest("hex");
}

/**
 * Track a login event
 * Called after successful sign-in to record login history
 */
export async function trackLoginEvent(
    userId: string,
    headers: Headers
): Promise<void> {
    try {
        const ipAddress = getIPAddress(headers);
        const userAgent = headers.get("user-agent") || null;
        const deviceName = userAgent ? parseUserAgent(userAgent) : null;

        // Get location asynchronously
        const location = ipAddress ? await getLocationFromIP(ipAddress) : null;

        // Create login history entry
        await prisma.loginHistory.create({
            data: {
                userId,
                ipAddress,
                userAgent,
                deviceName,
                location,
                loginAt: new Date(),
            },
        });

        // Check if this is a new device
        if (userAgent) {
            const deviceHash = createDeviceHash(userAgent, location);
            const knownDevice = await prisma.knownDevice.findUnique({
                where: {
                    userId_deviceHash: {
                        userId,
                        deviceHash,
                    },
                },
            });

            if (!knownDevice) {
                // New device - create record and send alert
                await prisma.knownDevice.create({
                    data: {
                        userId,
                        deviceHash,
                        firstSeenAt: new Date(),
                        lastSeenAt: new Date(),
                    },
                });

                // Get user email for alert
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { email: true },
                });

                if (user?.email) {
                    // Send email alert (don't await, fire and forget)
                    sendNewLoginAlert(
                        user.email,
                        deviceName || "Unknown Device",
                        location,
                        new Date()
                    ).catch((error) => {
                        console.error(
                            "Failed to send login alert email:",
                            error
                        );
                    });
                }
            } else {
                // Update last seen
                await prisma.knownDevice.update({
                    where: { id: knownDevice.id },
                    data: { lastSeenAt: new Date() },
                });
            }
        }
    } catch (error) {
        // Don't fail login if tracking fails
        console.error("Failed to track login event:", error);
    }
}
