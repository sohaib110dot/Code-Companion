import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const mDisplay = m < 10 && h > 0 ? `0${m}` : m;
  const sDisplay = s < 10 ? `0${s}` : s;

  if (h > 0) {
    return `${h}:${mDisplay}:${sDisplay}`;
  }
  return `${mDisplay}:${sDisplay}`;
}

export function isValidMediaUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Accept common media platforms
    const validHosts = ['youtube.com', 'youtu.be', 'vimeo.com', 'instagram.com', 'tiktok.com', 'facebook.com', 'twitter.com', 'x.com'];
    return validHosts.some(host => parsed.hostname?.includes(host));
  } catch {
    return false;
  }
}
