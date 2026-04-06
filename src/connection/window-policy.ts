import type { ConnectionMode } from "./types";

export interface WindowPolicy {
  mode: ConnectionMode;
  startUrl: string;
  allowedOrigin: string;
  partition: string;
  preloadPath?: string;
}

export function isNavigationAllowed(targetUrl: string, allowedOrigin: string): boolean {
  try {
    const parsed = new URL(targetUrl);
    return parsed.origin === allowedOrigin;
  } catch {
    return false;
  }
}

export function shouldOpenExternally(targetUrl: string, allowedOrigin: string): boolean {
  try {
    const parsed = new URL(targetUrl);
    if (parsed.origin === allowedOrigin) {
      return false;
    }

    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function remotePartitionForProfile(profileId: string): string {
  return `persist:paperclip-remote-${profileId}`;
}

export function localPartition(): string {
  return "persist:paperclip-local";
}
