/**
 * Image download and optimization utility for seed data
 *
 * Downloads images from Unsplash, resizes them to optimal dimensions,
 * and saves them locally as optimized WebP files.
 */

import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

export interface ImageOptions {
    /** Width in pixels (default: 800) */
    width?: number;
    /** Height in pixels (default: 450 for 16:9) */
    height?: number;
    /** WebP quality 1-100 (default: 85) */
    quality?: number;
}

const DEFAULT_OPTIONS: Required<ImageOptions> = {
    width: 800,
    height: 450,
    quality: 85,
};

/**
 * Build Unsplash source URL from photo ID
 */
export function buildUnsplashUrl(photoId: string): string {
    return `https://images.unsplash.com/${photoId}?w=1200&q=80&auto=format`;
}

/**
 * Generate a URL-safe slug from a course title
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Ensure the output directory exists
 */
function ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Download an image from URL and return as buffer
 */
async function downloadImage(url: string): Promise<Buffer> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Failed to download image: ${response.status} ${response.statusText}`
        );
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

/**
 * Download and optimize an image from Unsplash
 *
 * @param photoId - Unsplash photo ID (e.g., "photo-1481627834876-b7833e8f5570")
 * @param outputDir - Output directory (e.g., "public/images/courses")
 * @param slug - Filename slug (e.g., "introduction-to-statistics")
 * @param options - Image processing options
 * @returns Local path for use in imageUrl (e.g., "/images/courses/intro-stats.webp")
 */
export async function downloadAndOptimizeImage(
    photoId: string,
    outputDir: string,
    slug: string,
    options: ImageOptions = {}
): Promise<string> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const url = buildUnsplashUrl(photoId);
    const filename = `${slug}.webp`;
    const outputPath = path.join(outputDir, filename);

    // Ensure output directory exists
    ensureDirectoryExists(outputDir);

    console.log(`    Downloading image: ${photoId}`);

    try {
        // Download the image
        const imageBuffer = await downloadImage(url);

        // Process with sharp: resize and convert to WebP
        await sharp(imageBuffer)
            .resize(opts.width, opts.height, {
                fit: "cover",
                position: "center",
            })
            .webp({ quality: opts.quality })
            .toFile(outputPath);

        console.log(
            `    ✓ Saved optimized image: ${filename} (${opts.width}x${opts.height})`
        );

        // Return the public path for use in database
        // outputDir is an absolute path like "/path/to/apps/web/public/images/courses"
        // We need to extract just the part after "public" -> "/images/courses/filename.webp"
        const publicIndex = outputDir.indexOf("/public/");
        const publicPath =
            publicIndex !== -1
                ? outputDir.substring(publicIndex + "/public".length)
                : `/images/courses`; // fallback
        return `${publicPath}/${filename}`;
    } catch (error) {
        console.error(`    ✗ Failed to process image: ${error}`);
        throw error;
    }
}

/**
 * Extract Unsplash photo ID from a full URL
 *
 * @param url - Full Unsplash URL (e.g., "https://images.unsplash.com/photo-123?w=800...")
 * @returns Photo ID (e.g., "photo-123")
 */
export function extractPhotoId(url: string): string | null {
    // Match pattern like "photo-1481627834876-b7833e8f5570"
    const match = url.match(/\/(photo-[a-zA-Z0-9-]+)/);
    return match ? match[1] : null;
}
