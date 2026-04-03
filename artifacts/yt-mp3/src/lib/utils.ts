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
    const hostname = parsed.hostname || '';
    // Check if hostname contains any valid media platform
    return hostname.includes('youtube.com') || 
           hostname.includes('youtu.be') || 
           hostname.includes('vimeo.com') || 
           hostname.includes('instagram.com') || 
           hostname.includes('tiktok.com') || 
           hostname.includes('facebook.com') || 
           hostname.includes('twitter.com') || 
           hostname.includes('x.com');
  } catch {
    return false;
  }
}
