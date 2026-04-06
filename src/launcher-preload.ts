import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("paperclipLauncher", {
  bootstrap: () => ipcRenderer.invoke("launcher:bootstrap"),
  setChooserMode: (mode: "local_embedded" | "remote_existing") =>
    ipcRenderer.invoke("launcher:set-chooser-mode", mode),
  saveRemoteProfile: (payload: { profileId?: string; name?: string; remoteUrl: string }) =>
    ipcRenderer.invoke("launcher:save-remote-profile", payload),
  duplicateProfile: (profileId: string) => ipcRenderer.invoke("launcher:duplicate-profile", profileId),
  deleteProfile: (profileId: string) => ipcRenderer.invoke("launcher:delete-profile", profileId),
  verifyRemote: (payload: { remoteUrl: string }) => ipcRenderer.invoke("launcher:verify-remote", payload),
  connectLocal: (payload: { rememberChoice: boolean }) => ipcRenderer.invoke("launcher:connect-local", payload),
  connectRemote: (payload: {
    profileId?: string;
    remoteUrl: string;
    displayName?: string;
    saveProfile: boolean;
    rememberChoice: boolean;
  }) => ipcRenderer.invoke("launcher:connect-remote", payload),
  connectSavedProfile: (profileId: string) => ipcRenderer.invoke("launcher:connect-saved-profile", profileId),
  openSavedConnections: () => ipcRenderer.invoke("launcher:open-saved-connections"),
  showChooser: () => ipcRenderer.invoke("launcher:show-chooser"),
  onStateChanged: (callback: (snapshot: unknown) => void) => {
    ipcRenderer.on("launcher:state-changed", (_event, snapshot) => callback(snapshot));
  },
  onNavigate: (callback: (payload: unknown) => void) => {
    ipcRenderer.on("launcher:navigate", (_event, payload) => callback(payload));
  },
  onBootStatus: (callback: (payload: unknown) => void) => {
    ipcRenderer.on("launcher:boot-status", (_event, payload) => callback(payload));
  },
  onConnectionError: (callback: (payload: unknown) => void) => {
    ipcRenderer.on("launcher:connection-error", (_event, payload) => callback(payload));
  },
});
