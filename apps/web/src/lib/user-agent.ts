import { UAParser } from "ua-parser-js";

/**
 * Parse a User Agent string into a friendly device description
 * @param userAgent - The User Agent string from the request
 * @returns A friendly description like "Chrome on Windows" or "Safari on iPhone"
 */
export function parseUserAgent(userAgent: string | null | undefined): string {
    if (!userAgent) {
        return "Unknown Device";
    }

    try {
        const parser = new UAParser(userAgent);
        const browser = parser.getBrowser();
        const os = parser.getOS();
        const device = parser.getDevice();

        // Build device name
        const parts: string[] = [];

        // Browser name
        if (browser.name) {
            parts.push(browser.name);
        }

        // OS/platform
        if (device.type === "mobile" || device.type === "tablet") {
            // For mobile devices, show device model if available
            if (device.model) {
                parts.push(device.model);
            } else if (os.name) {
                parts.push(os.name);
            }
        } else {
            // For desktop, show OS
            if (os.name) {
                parts.push(os.name);
            }
        }

        // If we have at least one part, join them
        if (parts.length > 0) {
            return parts.join(" on ");
        }

        // Fallback to raw UA if parsing fails
        return userAgent.length > 50
            ? userAgent.substring(0, 50) + "..."
            : userAgent;
    } catch {
        // Fallback to raw UA if parsing fails
        return userAgent.length > 50
            ? userAgent.substring(0, 50) + "..."
            : userAgent;
    }
}
