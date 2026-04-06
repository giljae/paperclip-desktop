import type { RemotePreflightResult } from "./types";

export type RemoteLoopState = "signin_required" | "bootstrap_pending";

export interface RemoteLoopPayload {
  state: RemoteLoopState;
  title: string;
  detail: string;
  url: string;
  primaryActionLabel: string;
}

export function getRemoteLoopState(result: RemotePreflightResult): RemoteLoopState | null {
  if (!result.ok) {
    return null;
  }

  if (result.bootstrapStatus === "bootstrap_pending") {
    return "bootstrap_pending";
  }

  if (result.sessionState === "signed_out") {
    return "signin_required";
  }

  return null;
}

export function buildRemoteLoopPayload(result: RemotePreflightResult): RemoteLoopPayload | null {
  const state = getRemoteLoopState(result);
  if (!state) {
    return null;
  }

  if (state === "bootstrap_pending") {
    return {
      state,
      title: "Instance setup required",
      detail:
        "This verified remote does not have an instance admin yet. Open the remote setup flow to finish bootstrap, or go back and choose a different connection.",
      url: result.normalizedUrl,
      primaryActionLabel: "Open Remote Setup",
    };
  }

  return {
    state,
    title: "Remote sign-in required",
    detail:
      "Desktop verified this Paperclip remote, but there is no active session yet. Open the remote sign-in flow, or go back and choose a different connection.",
    url: result.normalizedUrl,
    primaryActionLabel: "Open Remote Sign-In",
  };
}
