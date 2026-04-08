import type { RemotePreflightResult } from "./types";

export type RemoteLoopState = "signin_required" | "bootstrap_pending";

export interface RemoteLoopPayload {
  state: RemoteLoopState;
  title: string;
  detail: string;
  url: string;
  primaryActionLabel: string;
}

export function getRemoteLoopState(_result: RemotePreflightResult): RemoteLoopState | null {
  return null;
}

export function buildRemoteLoopPayload(_result: RemotePreflightResult): RemoteLoopPayload | null {
  return null;
}
