// Deterministic module-scoped compilation cache boundary lines
const BUCKET_NAME = "events";
const STORAGE_ROOT_ENDPOINT = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET_NAME}`
  : "";

/**
 * High-performance, zero-allocation public media CDN asset URL resolver.
 * Eliminates client SDK instantiations inside standard rendering loops to optimize main-thread paint paths.
 *
 * @param urlOrPath - Raw database storage pointer path or absolute fallback URL string
 * @returns Fully-qualified public CDN asset route string
 */
export function getImageUrl(urlOrPath: string | null | undefined): string {
  // 1. Fallback Guard: Instantiate a reliable placeholder image asset instantly if path resolves empty
  if (!urlOrPath) return "/placeholder-event.jpg";

  const pathStr = String(urlOrPath).trim();

  // 2. Short-Circuit evaluation: If the string is already a fully-qualified absolute link, return it instantly
  if (pathStr.startsWith("http://") || pathStr.startsWith("https://")) {
    return pathStr;
  }

  // 3. Clean leading slashes to prevent double-slash protocol breaks inside destination path nodes
  const cleanPath = pathStr.startsWith("/") ? pathStr.slice(1) : pathStr;

  // 4. Zero-Overhead Static Resolution: Construct the CDN path natively without calling the Supabase SDK client layer
  if (!STORAGE_ROOT_ENDPOINT) {
    // Staging / Build-time local fallback layer to insulate static generation pathways from throwing errors
    return `/${cleanPath}`;
  }

  return `${STORAGE_ROOT_ENDPOINT}/${cleanPath}`;
}
