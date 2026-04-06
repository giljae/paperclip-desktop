# PRD: Remote Connection Mode for Paperclip Desktop

- **Status:** Draft
- **Owner:** Desktop App Maintainers
- **Branch:** `feature/remote`
- **Last Updated:** April 6, 2026

---

## 1) Summary

Paperclip Desktop currently boots an embedded local Paperclip server and opens it inside Electron. This PRD defines a new **Remote Connection Mode** that allows users to connect the desktop shell to an already-running Paperclip instance (for example, over Tailscale), while retaining the current **Local Embedded Mode**.

The feature introduces:

1. A launch-time **connection chooser** (`Local` vs `Remote`).
2. A **Remote Connect** flow with URL validation + health check.
3. **Saved Connections** (CRUD) and **Quick Connect** UX for fast switching.
4. Security controls for remote origins in Electron.

This enables users to keep all runtime state on a remote machine while using Desktop as a secure native client.

---

## 2) Problem Statement

### Current limitation

Desktop startup assumes local ownership of the server lifecycle:
- find free local port
- spawn bundled server
- wait for local health
- load `http://localhost:<port>`

This blocks a common workflow where users run Paperclip remotely and access it from multiple devices via browser (e.g., over Tailscale).

### User pain

- Cannot use Desktop as a remote client.
- Must use a browser for remote workflows.
- No saved-connection workflow for frequently used instances.

---

## 3) Goals

### Product goals

1. Let users connect Desktop to a remote Paperclip URL.
2. Preserve existing one-click local behavior.
3. Provide best-in-class switching UX via saved connection profiles.
4. Keep Electron security posture strong in remote mode.

### Success metrics (first 60 days)

- **Adoption:** ≥ 20% of weekly active desktop users create at least 1 remote profile.
- **Reliability:** ≥ 99% successful startup to usable UI (local + remote combined).
- **Usability:** Median time to connect to a saved remote profile ≤ 3 seconds from app open.
- **Stability:** No increase > 5% in renderer crashes/regressions.

---

## 4) Non-goals

- Implementing remote authentication protocols beyond what upstream Paperclip already supports.
- Acting as a reverse proxy.
- Multi-window simultaneous connections in V1.
- Cross-device sync of saved profiles in V1.

---

## 5) Personas & Primary Use Cases

### Persona A: Solo remote operator
- Runs Paperclip on a home server/VM.
- Uses laptop + phone over Tailscale.
- Needs one-click reconnect from desktop.

### Persona B: Team member with multiple environments
- Has dev/staging/prod Paperclip instances.
- Needs fast switching without retyping URLs.

### Persona C: Existing local-only desktop user
- Wants no change in current one-click local startup.

---

## 6) Proposed User Experience

## 6.1 First-run / Launch chooser

On launch (or on first run), show:
- **Run Local Paperclip** (recommended default)
- **Connect to Remote Paperclip**

Checkbox:
- `Remember my choice and don't ask again`

Advanced:
- `Always show chooser on launch` (in settings)

## 6.2 Remote connect form

Fields:
- Remote URL (required)
- Display name (optional)

Actions:
- **Test Connection**
- **Connect**
- **Connect & Save**

Validation:
- Require `http://` or `https://`
- Normalize trailing slashes
- Warn for non-HTTPS unless hostname matches private/tailnet patterns

## 6.3 Saved Connections (CRUD)

Data shown per profile:
- Name
- URL (origin + host)
- Last connected timestamp
- Status indicator (last known reachable/unreachable)

CRUD actions:
- Add, edit, rename, delete
- Duplicate profile (quality-of-life)

## 6.4 Quick Connect

Available via:
- App menu (Connection submenu)
- Tray menu (when present)
- Optional keyboard shortcut palette (future)

Entries:
- Connect Local
- Recent / Saved remote profiles
- Manage Connections…

## 6.5 Startup behavior

- If `remember last profile` is enabled, app auto-attempts last used profile.
- On failure:
  - Show actionable error.
  - Offer `Retry`, `Choose another connection`, `Switch to Local`.

---

## 7) Functional Requirements

### FR-1: Connection modes
- App must support two exclusive modes:
  - `local_embedded`
  - `remote_existing`

### FR-2: Mode-aware boot pipeline
- Local mode keeps current spawn/wait/load flow.
- Remote mode skips local server spawn and navigates to configured remote URL after validation.

### FR-3: Saved profiles
- Persist multiple connection profiles locally.
- Support full CRUD operations.

### FR-4: Connection validation
- Before connecting to remote URL, run preflight checks:
  - URL parse/normalize
  - network reachability
  - optional endpoint sanity check (Paperclip fingerprint)

### FR-5: Security allowlist
- In remote mode, renderer may only navigate to the configured remote origin (plus localhost when local mode).
- All other links open externally.

### FR-6: Local mode compatibility
- Existing local behaviors remain unchanged by default.

### FR-7: Telemetry/events (if telemetry exists)
- Emit structured events for connect attempts/results/profile actions.

---

## 8) Non-functional Requirements

- **Performance:** connection-switch UI action to first paint ≤ 2.5s on healthy network.
- **Reliability:** graceful degradation on unreachable remote endpoints.
- **Security:** maintain `contextIsolation=true`, `nodeIntegration=false`; enforce strict origin checks.
- **Maintainability:** mode logic separated into testable modules.

---

## 9) Technical Design (High Level)

## 9.1 New core abstractions

### `ConnectionProfile`

```ts
interface ConnectionProfile {
  id: string;
  name: string;
  mode: "local_embedded" | "remote_existing";
  remoteUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastConnectedAt?: string;
  lastHealth?: "healthy" | "unreachable" | "unknown";
}
```

### `ConnectionState`

```ts
interface ConnectionState {
  activeProfileId: string | null;
  alwaysShowChooser: boolean;
  autoConnectLastProfile: boolean;
}
```

## 9.2 New modules (proposed)

- `src/connection/profiles.ts` — persistence + CRUD
- `src/connection/validate.ts` — URL normalization + preflight
- `src/connection/boot.ts` — mode-aware boot orchestration
- `src/ui/connection/*` — chooser/manage views (implementation style TBD)

## 9.3 Main process refactor

Current flow in `main.ts` should be split into:

- `bootLocal(profile)`
  - existing server startup lifecycle
- `bootRemote(profile)`
  - validate URL
  - create window with remote-origin policy
  - load remote URL

Window creation should accept explicit policy:

```ts
createWindow({ startUrl, allowedOrigins, mode })
```

## 9.4 Origin policy

Implement strict allowed-origin checks:
- Local mode: allow only `localhost`/`127.0.0.1` on active port.
- Remote mode: allow only the configured origin.

Any navigation outside allowed origin:
- prevent in-app navigation
- open in system browser if safe (`http/https`)

## 9.5 Persistence

Store profiles + state under app userData:
- `connections.json` (or existing config store if available)

Example:

```json
{
  "activeProfileId": "default-local",
  "alwaysShowChooser": false,
  "autoConnectLastProfile": true,
  "profiles": [
    {
      "id": "default-local",
      "name": "Local",
      "mode": "local_embedded",
      "createdAt": "2026-04-06T00:00:00.000Z",
      "updatedAt": "2026-04-06T00:00:00.000Z"
    },
    {
      "id": "home-tailnet",
      "name": "Home Server",
      "mode": "remote_existing",
      "remoteUrl": "https://paperclip-host.tailnet.ts.net",
      "createdAt": "2026-04-06T00:00:00.000Z",
      "updatedAt": "2026-04-06T00:00:00.000Z"
    }
  ]
}
```

---

## 10) Error Handling UX

### Remote URL invalid
- Inline message: “Enter a valid http(s) URL.”

### Host unreachable
- Message + actions: Retry / Edit URL / Switch to Local.

### Non-Paperclip endpoint
- Warning modal: “Connected host does not appear to be Paperclip.”
- Allow continue (advanced users) or cancel.

### TLS/certificate errors
- Present explicit warning and remediation guidance.
- V1 default: block with clear explanation; no insecure bypass unless explicitly enabled in advanced debug settings.

---

## 11) Security Considerations

1. Keep Electron hardening defaults (`contextIsolation`, no node integration).
2. Restrict in-app navigation to allowed origin set.
3. Validate remote URLs and sanitize user-provided strings.
4. Never expose local privileged APIs to arbitrary remote pages.
5. Keep update channel and connection channel concerns isolated.

---

## 12) Analytics / Observability (Optional)

Track events if telemetry framework exists:
- `connection_mode_selected`
- `connection_attempted`
- `connection_succeeded`
- `connection_failed` (with reason bucket)
- `profile_created/updated/deleted`
- `quick_connect_used`

Also add structured logs in main process for boot path and failure reasons.

---

## 13) QA Strategy

### Unit tests
- URL normalization/validation
- profile CRUD operations
- allowed-origin policy checks

### Integration tests
- Local boot path unaffected
- Remote boot path skips local spawn
- switch profiles during runtime

### Manual matrix
- macOS (Intel + Apple Silicon)
- online/offline states
- reachable/unreachable tailnet endpoint
- invalid certificates
- malformed URLs

---

## 14) Rollout Plan

### Phase 1 (MVP)
- Mode chooser
- Remote connect (no save)
- Mode-aware boot + security allowlist

### Phase 2
- Saved profiles CRUD
- Quick connect menu
- Auto-connect last profile

### Phase 3
- Polishing: recents, favorites, improved diagnostics

Feature flag recommendation:
- Ship behind `remoteModeEnabled` internal flag for initial beta.

---

## 15) Risks and Mitigations

1. **Security regressions from remote navigation**
   - Mitigation: strict origin allowlist + no privileged API expansion.

2. **User confusion between local and remote state**
   - Mitigation: always show active profile badge + clear mode labeling.

3. **Connection instability on mobile/hotspot networks**
   - Mitigation: resilient retry UX + clear errors + quick fallback to local.

4. **Version mismatch with remote Paperclip**
   - Mitigation: lightweight compatibility warning, not hard block.

---

## 16) Acceptance Criteria

1. User can choose Local or Remote on launch.
2. User can input a remote URL, test, and connect successfully.
3. Remote mode does not spawn local Paperclip server process.
4. User can create/edit/delete saved remote profiles.
5. User can quick-connect to saved profiles from app menu/tray.
6. Out-of-origin in-app navigation is blocked and opened externally.
7. Existing local startup behavior works unchanged when Local is selected.

---

## 17) Open Questions

1. Should remote mode support HTTP on private/tailnet hosts by default or require explicit acknowledgment?
2. Do we want a tiny built-in connection history beyond saved profiles?
3. How should compatibility with remote Paperclip versions be detected reliably?
4. Should profile storage be plain JSON or migrated into an existing store abstraction?

---

## 18) Implementation Checklist

- [ ] Define profile and state types
- [ ] Build persistence layer + migration path
- [ ] Build launch chooser UI
- [ ] Build remote connect UI + validation
- [ ] Refactor boot logic into mode-specific paths
- [ ] Implement allowed-origin policy per profile/mode
- [ ] Add Saved Connections CRUD UI
- [ ] Add Quick Connect in app/tray menu
- [ ] Add automated tests
- [ ] Add docs + release notes

