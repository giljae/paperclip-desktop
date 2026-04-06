export function getLauncherHtml(): string {
  return String.raw`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Paperclip</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
    min-height: 100vh;
    background: #0a0a0a;
    color: #e4e4e7;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 24px;
    user-select: none;
    overflow: auto;
  }

  .window {
    width: min(100%, 480px);
    min-height: 380px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .logo {
    width: 56px;
    height: 56px;
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
  }

  .app-title {
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 32px;
    opacity: 0;
    animation: fadeIn 0.5s ease-out 0.15s forwards;
  }

  .view {
    display: none;
    flex-direction: column;
    align-items: center;
    width: 100%;
    opacity: 0;
    animation: fadeIn 0.35s ease-out forwards;
  }
  .view.active { display: flex; }

  .chooser-cards {
    display: flex;
    gap: 14px;
    margin-bottom: 24px;
  }

  .chooser-card {
    width: 200px;
    padding: 20px 16px;
    border: 1px solid #27272a;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    transition: border-color 0.2s, background 0.2s;
    background: transparent;
    color: #e4e4e7;
  }
  .chooser-card:hover {
    border-color: #52525b;
    background: #18181b;
  }
  .chooser-card.selected {
    border-color: #a1a1aa;
    background: #1c1c1f;
  }
  .chooser-card .card-icon {
    width: 32px;
    height: 32px;
    margin: 0 auto 12px;
  }
  .chooser-card .card-label {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .chooser-card .card-desc {
    font-size: 11px;
    color: #71717a;
    line-height: 1.4;
  }
  .chooser-card .badge {
    display: inline-block;
    font-size: 10px;
    background: #27272a;
    color: #a1a1aa;
    padding: 2px 7px;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .remember-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #71717a;
    margin-bottom: 20px;
  }
  .remember-row input[type="checkbox"] {
    accent-color: #a1a1aa;
  }

  .btn {
    padding: 8px 20px;
    border-radius: 6px;
    border: 1px solid #27272a;
    background: transparent;
    color: #e4e4e7;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    font-family: inherit;
  }
  .btn:hover { background: #18181b; border-color: #52525b; }
  .btn.primary {
    background: #e4e4e7;
    color: #0a0a0a;
    border-color: #e4e4e7;
    font-weight: 500;
  }
  .btn.primary:hover { background: #d4d4d8; border-color: #d4d4d8; }
  .btn.danger { color: #f87171; border-color: #7f1d1d; }
  .btn.danger:hover { background: #1c1215; border-color: #991b1b; }
  .btn:disabled { opacity: 0.35; pointer-events: none; }

  .btn-row {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .session-return {
    width: 340px;
    margin-top: 20px;
    display: none;
  }
  .session-return.visible {
    display: block;
  }
  .session-return .btn {
    width: 100%;
  }

  .form-group {
    width: 340px;
    margin-bottom: 16px;
    text-align: left;
  }
  .form-group label {
    display: block;
    font-size: 12px;
    color: #71717a;
    margin-bottom: 6px;
  }
  .form-group input {
    width: 100%;
    padding: 9px 12px;
    border-radius: 6px;
    border: 1px solid #27272a;
    background: #18181b;
    color: #e4e4e7;
    font-size: 13px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
  }
  .form-group input::placeholder { color: #3f3f46; }
  .form-group input:focus { border-color: #52525b; }
  .form-group .field-hint {
    font-size: 11px;
    color: #52525b;
    margin-top: 4px;
  }
  .form-group .field-error {
    font-size: 11px;
    color: #f87171;
    margin-top: 4px;
    display: none;
  }
  .form-group .field-success {
    font-size: 11px;
    color: #4ade80;
    margin-top: 4px;
    display: none;
  }

  .form-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 8px;
    margin-bottom: 16px;
  }

  #view-remote-form .form-actions,
  #view-remote-loop .btn-row,
  #view-error .btn-row {
    width: 340px;
    flex-direction: column;
    align-items: stretch;
  }

  #view-remote-form .form-actions .btn,
  #view-remote-loop .btn-row .btn,
  #view-error .btn-row .btn {
    width: 100%;
  }

  .back-link {
    font-size: 12px;
    color: #52525b;
    cursor: pointer;
    transition: color 0.15s;
    margin-top: 12px;
  }
  .back-link:hover { color: #a1a1aa; }

  .requirements-box {
    width: 340px;
    border: 1px solid #27272a;
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 16px;
    background: #141417;
    text-align: left;
  }
  .requirements-title {
    font-size: 12px;
    font-weight: 500;
    color: #a1a1aa;
    margin-bottom: 8px;
  }
  .requirements-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: #71717a;
    font-size: 11px;
    line-height: 1.4;
  }
  .requirements-list div::before {
    content: "• ";
    color: #a1a1aa;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 20px;
    margin-bottom: 16px;
  }
  .status-badge.healthy { background: #052e16; color: #4ade80; }
  .status-badge.warning { background: #2b2110; color: #fbbf24; }
  .status-badge.unreachable { background: #2a1215; color: #f87171; }
  .status-badge.testing { background: #1c1c1f; color: #a1a1aa; }
  .status-badge .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .status-card {
    width: 340px;
    display: none;
    border: 1px solid #27272a;
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 14px;
    background: #141417;
    text-align: left;
  }
  .status-card.active { display: block; }
  .status-title {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .status-detail {
    color: #71717a;
    font-size: 11px;
    line-height: 1.4;
  }
  .status-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
  }
  .pill {
    display: inline-flex;
    align-items: center;
    border: 1px solid #27272a;
    border-radius: 4px;
    padding: 2px 7px;
    font-size: 10px;
    color: #a1a1aa;
    background: transparent;
  }

  .connections-list {
    width: 400px;
    margin-bottom: 16px;
  }

  .conn-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border: 1px solid #27272a;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .conn-item:hover {
    border-color: #52525b;
    background: #18181b;
  }
  .conn-item.active-conn {
    border-color: #4ade80;
    background: #0a1a0f;
  }
  .conn-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: #27272a;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .conn-icon svg { width: 16px; height: 16px; }
  .conn-info { flex: 1; min-width: 0; }
  .conn-name {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .conn-url {
    font-size: 11px;
    color: #52525b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .conn-meta {
    font-size: 10px;
    color: #3f3f46;
    margin-top: 2px;
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .conn-actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }
  .conn-actions button {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: none;
    background: transparent;
    color: #52525b;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s, background 0.15s;
  }
  .conn-actions button:hover { color: #e4e4e7; background: #27272a; }
  .conn-actions button.delete-btn:hover { color: #f87171; background: #1c1215; }
  .conn-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .conn-status-dot.healthy { background: #4ade80; }
  .conn-status-dot.auth-required { background: #fbbf24; }
  .conn-status-dot.unreachable { background: #f87171; }
  .conn-status-dot.unsupported { background: #9ca3af; }
  .conn-status-dot.unknown { background: #3f3f46; }
  .empty-state {
    text-align: center;
    padding: 32px 0;
    color: #3f3f46;
    font-size: 13px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #a1a1aa;
  }

  .section-subtitle {
    font-size: 12px;
    color: #52525b;
    margin-bottom: 20px;
  }

  .connecting-view {
    text-align: center;
  }
  .connecting-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #27272a;
    border-top-color: #a1a1aa;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin: 0 auto 16px;
  }
  .connecting-label {
    font-size: 13px;
    color: #a1a1aa;
    margin-bottom: 4px;
  }
  .connecting-url {
    font-size: 11px;
    color: #52525b;
  }

  .loop-card {
    width: 360px;
    padding: 18px;
    border: 1px solid #27272a;
    border-radius: 10px;
    background: #141417;
    margin-bottom: 18px;
    text-align: left;
  }
  .loop-eyebrow {
    font-size: 11px;
    color: #fbbf24;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .loop-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .loop-detail {
    font-size: 12px;
    color: #a1a1aa;
    line-height: 1.5;
    margin-bottom: 14px;
  }
  .loop-url {
    font-size: 11px;
    color: #71717a;
    word-break: break-word;
    padding: 10px 12px;
    border: 1px solid #27272a;
    border-radius: 8px;
    background: #0f0f12;
  }

  .error-box {
    width: 340px;
    padding: 16px;
    border: 1px solid #7f1d1d;
    border-radius: 8px;
    background: #1c1215;
    margin-bottom: 16px;
    text-align: center;
  }
  .error-box .error-title {
    font-size: 13px;
    font-weight: 500;
    color: #f87171;
    margin-bottom: 4px;
  }
  .error-box .error-detail {
    font-size: 11px;
    color: #71717a;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }
  .modal-overlay.active { display: flex; }
  .modal {
    width: 380px;
    background: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 24px;
    animation: fadeIn 0.2s ease-out forwards;
  }
  .modal .modal-title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  .modal .form-group { width: 100%; }
  .modal .form-actions { justify-content: flex-end; }

  .progress-track {
    width: 240px;
    height: 3px;
    background: #27272a;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 24px;
  }
  .progress-bar {
    height: 100%;
    width: 0%;
    background: #a1a1aa;
    border-radius: 2px;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .steps {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 280px;
  }
  .step {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #52525b;
    transition: color 0.3s ease;
  }
  .step.active { color: #e4e4e7; }
  .step.done { color: #71717a; }
  .step-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .step-icon .pending { width: 6px; height: 6px; border-radius: 50%; background: #3f3f46; }
  .step-icon .spinner { width: 14px; height: 14px; border: 2px solid #3f3f46; border-top-color: #a1a1aa; border-radius: 50%; animation: spin 0.7s linear infinite; }
  .step-icon .check { color: #71717a; font-size: 14px; line-height: 1; }
  .step-detail {
    display: block;
    font-size: 11px;
    color: #52525b;
    margin-top: 2px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
</head>
<body>
<div class="window">
  <div class="logo">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"/></svg>
  </div>
  <div class="app-title">Paperclip</div>

  <div class="view active" id="view-chooser">
    <div class="section-subtitle">How would you like to start?</div>
    <div class="chooser-cards">
      <div class="chooser-card selected" id="card-local" onclick="selectCard('local')">
        <span class="badge">Recommended</span>
        <div class="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
        <div class="card-label">Run Local</div>
        <div class="card-desc">Start the embedded Paperclip server on this machine with the current trusted local flow.</div>
      </div>

      <div class="chooser-card" id="card-remote" onclick="selectCard('remote')">
        <div class="card-icon" style="margin-top: 22px">
          <svg viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <div class="card-label">Connect Remote</div>
        <div class="card-desc">Connect only to verified remote Paperclip instances that expose upstream authenticated mode.</div>
      </div>
    </div>

    <div class="remember-row">
      <input type="checkbox" id="rememberChoice">
      <label for="rememberChoice">Remember my choice and don't ask again</label>
    </div>

    <div class="btn-row">
      <button class="btn" onclick="openSavedConnections()">Saved Connections</button>
      <button class="btn primary" onclick="chooserContinue()">Continue</button>
    </div>
  </div>

  <div class="view" id="view-remote-form">
    <div class="section-title">Connect to Remote Paperclip</div>

    <div class="requirements-box">
      <div class="requirements-title">Remote requirements</div>
      <div class="requirements-list">
        <div>Remote mode is for verified Paperclip servers, not arbitrary web pages.</div>
        <div>Shared or networked remotes should run upstream authenticated mode.</div>
        <div>The remote server owns sign-in. Desktop does not store remote passwords.</div>
      </div>
    </div>

    <div class="form-group">
      <label for="remoteUrl">Remote URL</label>
      <input type="text" id="remoteUrl" placeholder="https://paperclip.example.com">
      <div class="field-hint">Desktop verifies /api/health and auth readiness before loading a remote origin.</div>
      <div class="field-error" id="urlError">Enter a valid http(s) URL.</div>
      <div class="field-success" id="urlSuccess">Verified authenticated Paperclip remote detected.</div>
    </div>

    <div class="form-group">
      <label for="displayName">Display name <span style="color:#3f3f46">(optional)</span></label>
      <input type="text" id="displayName" placeholder="e.g. Home Server">
    </div>

    <div id="testStatus" style="min-height: 24px;"></div>
    <div class="status-card" id="statusCard">
      <div class="status-title" id="statusTitle">Waiting for verification</div>
      <div class="status-detail" id="statusDetail">Run verification to inspect deployment mode, auth readiness, and sign-in state.</div>
      <div class="status-meta" id="statusMeta"></div>
    </div>

    <div class="form-actions">
      <button class="btn" onclick="verifyRemote()">Verify Remote</button>
      <button class="btn primary" id="signinBtn" onclick="continueToSignIn()" disabled>Continue to Sign-In</button>
      <button class="btn" id="saveBtn" onclick="connectAndSave()" disabled>Connect &amp; Save</button>
    </div>

    <div class="back-link" onclick="showChooser()">&larr; Back to chooser</div>
  </div>

  <div class="view" id="view-connecting">
    <div class="connecting-view">
      <div class="connecting-spinner"></div>
      <div class="connecting-label" id="connectingLabel">Opening verified remote...</div>
      <div class="connecting-url" id="connectingUrl"></div>
    </div>
  </div>

  <div class="view" id="view-remote-loop">
    <div class="loop-card">
      <div class="loop-eyebrow" id="remoteLoopEyebrow">Verified Remote</div>
      <div class="loop-title" id="remoteLoopTitle">Remote sign-in required</div>
      <div class="loop-detail" id="remoteLoopDetail">Desktop verified the remote, but it still needs work in the remote window before you can continue here.</div>
      <div class="loop-url" id="remoteLoopUrl"></div>
    </div>

    <div class="btn-row">
      <button class="btn primary" id="remoteLoopPrimaryBtn" onclick="openCurrentRemoteInBrowser()">Open Remote in Browser</button>
      <button class="btn" onclick="retryRemoteVerification()">Retry Verification</button>
      <button class="btn" onclick="showChooser()">Back to Connections</button>
      <button class="btn" onclick="switchToLocal()">Switch to Local</button>
    </div>
  </div>

  <div class="view" id="view-error">
    <div class="error-box">
      <div class="error-title" id="errorTitle">Remote not eligible</div>
      <div class="error-detail" id="errorDetail">This host responded, but it is either not Paperclip or is configured in upstream local_trusted mode.</div>
    </div>

    <div class="btn-row">
      <button class="btn" onclick="retryLastAction()">Retry</button>
      <button class="btn" onclick="showView('remote-form')">Choose another connection</button>
      <button class="btn primary" onclick="switchToLocal()">Switch to Local</button>
    </div>

    <div class="back-link" onclick="showChooser()">&larr; Back to chooser</div>
  </div>

  <div class="view" id="view-saved">
    <div class="section-title">Saved Connections</div>
    <div class="connections-list" id="connectionsList"></div>

    <div class="btn-row">
      <button class="btn" onclick="openAddModal()">+ Add Connection</button>
      <button class="btn" onclick="showChooser()">Back</button>
    </div>
  </div>

  <div class="view" id="view-local-boot">
    <div class="progress-track">
      <div class="progress-bar" id="localProgress"></div>
    </div>

    <div class="steps" id="localSteps">
      <div class="step" id="step-init" data-key="init">
        <div class="step-icon"><div class="pending"></div></div>
        <div><div class="step-label">Initializing</div></div>
      </div>
      <div class="step" id="step-database" data-key="database">
        <div class="step-icon"><div class="pending"></div></div>
        <div><div class="step-label">Starting database</div></div>
      </div>
      <div class="step" id="step-server" data-key="server">
        <div class="step-icon"><div class="pending"></div></div>
        <div><div class="step-label">Starting server</div></div>
      </div>
      <div class="step" id="step-ready" data-key="ready">
        <div class="step-icon"><div class="pending"></div></div>
        <div><div class="step-label">Loading interface</div></div>
      </div>
    </div>
  </div>

  <div class="session-return" id="sessionReturn">
    <button class="btn" id="sessionReturnBtn" onclick="returnToCurrentSession()">Return to Current Session</button>
  </div>
</div>

<div class="modal-overlay" id="editModal">
  <div class="modal">
    <div class="modal-title" id="modalTitle">Add Connection</div>

    <div class="form-group">
      <label for="modalName">Name</label>
      <input type="text" id="modalName" placeholder="Connection name">
    </div>
    <div class="form-group">
      <label for="modalUrl">URL</label>
      <input type="text" id="modalUrl" placeholder="https://paperclip.example.com">
      <div class="field-hint">Remote profiles are verified before use and never store raw passwords.</div>
      <div class="field-error" id="modalError">Enter a valid http(s) URL.</div>
    </div>

    <div class="form-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn primary" onclick="saveModal()">Save</button>
    </div>
  </div>
</div>

<script>
const launcher = window.paperclipLauncher;
let selectedCard = "local";
let editingId = null;
let lastVerification = null;
let lastErrorAction = null;
let lastRemoteLoop = null;
let snapshot = null;

const stepElements = {
  init: document.getElementById("step-init"),
  database: document.getElementById("step-database"),
  server: document.getElementById("step-server"),
  ready: document.getElementById("step-ready"),
};
const stepOrder = ["init", "database", "server", "ready"];

function showView(name) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.remove("active");
    view.style.opacity = "0";
  });

  const viewEl = document.getElementById("view-" + name);
  if (viewEl) {
    viewEl.classList.add("active");
    void viewEl.offsetWidth;
    viewEl.style.animation = "none";
    void viewEl.offsetWidth;
    viewEl.style.animation = "fadeIn 0.35s ease-out forwards";
  }

  if (name === "saved") {
    renderConnections();
  }
  if (name === "local-boot") {
    resetLocalBoot();
  }
  updateSessionReturn(name);
}

function showChooser() {
  showView("chooser");
  launcher.showChooser();
}

function selectCard(type) {
  selectedCard = type;
  document.getElementById("card-local").classList.toggle("selected", type === "local");
  document.getElementById("card-remote").classList.toggle("selected", type === "remote");
}

async function chooserContinue() {
  const rememberChoice = document.getElementById("rememberChoice").checked;
  if (selectedCard === "remote") {
    await launcher.setChooserMode("remote_existing");
    showView("remote-form");
    return;
  }

  await launcher.setChooserMode("local_embedded");
  lastErrorAction = { type: "local", rememberChoice };
  resetLocalBoot();
  showView("local-boot");
  await launcher.connectLocal({ rememberChoice });
}

async function openSavedConnections() {
  const nextSnapshot = await launcher.openSavedConnections();
  applySnapshot(nextSnapshot);
  showView("saved");
}

function resetVerificationUi() {
  document.getElementById("urlError").style.display = "none";
  document.getElementById("urlSuccess").style.display = "none";
  document.getElementById("testStatus").innerHTML = "";
  document.getElementById("statusCard").classList.remove("active");
  document.getElementById("signinBtn").disabled = true;
  document.getElementById("saveBtn").disabled = true;
}

function renderStatus(result) {
  const testStatus = document.getElementById("testStatus");
  const card = document.getElementById("statusCard");
  const title = document.getElementById("statusTitle");
  const detail = document.getElementById("statusDetail");
  const meta = document.getElementById("statusMeta");
  const success = document.getElementById("urlSuccess");
  const signinBtn = document.getElementById("signinBtn");
  const saveBtn = document.getElementById("saveBtn");
  const mapped = mapVerificationResult(result);

  testStatus.innerHTML = '<div class="status-badge ' + mapped.badgeClass + '"><div class="dot"></div>' + escapeHtml(mapped.badge) + "</div>";
  card.classList.add("active");
  title.textContent = mapped.title;
  detail.textContent = mapped.detail;
  meta.innerHTML = mapped.meta.map((item) => '<span class="pill">' + escapeHtml(item) + "</span>").join("");

  success.style.display = mapped.success ? "block" : "none";
  signinBtn.textContent = mapped.actionLabel;
  saveBtn.textContent = mapped.saveLabel;
  signinBtn.disabled = !mapped.success;
  saveBtn.disabled = !mapped.success;
}

function renderRemoteLoop(payload) {
  lastRemoteLoop = payload;
  document.getElementById("remoteLoopEyebrow").textContent =
    payload.state === "bootstrap_pending" ? "Remote Setup Required" : "Verified Remote";
  document.getElementById("remoteLoopTitle").textContent = payload.title || "Remote sign-in required";
  document.getElementById("remoteLoopDetail").textContent = payload.detail || "";
  document.getElementById("remoteLoopUrl").textContent = payload.url || "";
  document.getElementById("remoteLoopPrimaryBtn").textContent = payload.primaryActionLabel || "Open Remote in Browser";
  showView("remote-loop");
}

async function verifyRemote() {
  const remoteUrl = document.getElementById("remoteUrl").value.trim();
  resetVerificationUi();
  document.getElementById("testStatus").innerHTML = '<div class="status-badge testing"><div class="dot"></div>Verifying remote...</div>';

  const result = await launcher.verifyRemote({ remoteUrl });
  lastVerification = result;

  if (result.reason === "invalid_url") {
    document.getElementById("testStatus").innerHTML = "";
    document.getElementById("urlError").textContent = result.detail || "Enter a valid http(s) URL.";
    document.getElementById("urlError").style.display = "block";
    return;
  }

  renderStatus(result);
}

async function continueToSignIn() {
  if (!lastVerification || !lastVerification.ok) {
    return;
  }

  const rememberChoice = document.getElementById("rememberChoice").checked;
  const remoteUrl = document.getElementById("remoteUrl").value.trim();
  const displayName = document.getElementById("displayName").value.trim();
  lastErrorAction = {
    type: "remote",
    saveProfile: false,
    rememberChoice,
    remoteUrl,
    displayName,
  };

  showRemoteConnectingState(lastVerification);
  await launcher.connectRemote({
    remoteUrl,
    displayName,
    saveProfile: false,
    rememberChoice,
  });

  if (needsBrowserStep(lastVerification)) {
    await launcher.openRemoteInBrowser(lastVerification.normalizedUrl);
  }
}

async function connectAndSave() {
  if (!lastVerification || !lastVerification.ok) {
    document.getElementById("urlError").style.display = "block";
    return;
  }

  const rememberChoice = document.getElementById("rememberChoice").checked;
  const remoteUrl = document.getElementById("remoteUrl").value.trim();
  const displayName = document.getElementById("displayName").value.trim();
  lastErrorAction = {
    type: "remote",
    saveProfile: true,
    rememberChoice,
    remoteUrl,
    displayName,
  };

  showRemoteConnectingState(lastVerification);
  await launcher.connectRemote({
    remoteUrl,
    displayName,
    saveProfile: true,
    rememberChoice,
  });
}

async function retryLastAction() {
  if (!lastErrorAction) {
    return;
  }

  if (lastErrorAction.type === "local") {
    resetLocalBoot();
    showView("local-boot");
    await launcher.connectLocal({ rememberChoice: !!lastErrorAction.rememberChoice });
    return;
  }

  document.getElementById("remoteUrl").value = lastErrorAction.remoteUrl || "";
  document.getElementById("displayName").value = lastErrorAction.displayName || "";
  showRemoteConnectingState(lastVerification || {
    ok: true,
    sessionState: "signed_out",
    bootstrapStatus: null,
    normalizedUrl: lastErrorAction.remoteUrl,
  });
  await launcher.connectRemote({
    remoteUrl: lastErrorAction.remoteUrl,
    displayName: lastErrorAction.displayName,
    saveProfile: !!lastErrorAction.saveProfile,
    rememberChoice: !!lastErrorAction.rememberChoice,
  });
}

async function switchToLocal() {
  const rememberChoice = document.getElementById("rememberChoice").checked;
  lastErrorAction = { type: "local", rememberChoice };
  resetLocalBoot();
  showView("local-boot");
  await launcher.connectLocal({ rememberChoice });
}

async function returnToCurrentSession() {
  await launcher.returnToCurrentSession();
}

async function openCurrentRemoteInBrowser() {
  const remoteUrl = lastRemoteLoop && lastRemoteLoop.url
    ? lastRemoteLoop.url
    : document.getElementById("remoteUrl").value.trim();
  if (!remoteUrl) {
    return;
  }

  await launcher.openRemoteInBrowser(remoteUrl);
}

async function retryRemoteVerification() {
  const remoteUrl = lastRemoteLoop && lastRemoteLoop.url
    ? lastRemoteLoop.url
    : document.getElementById("remoteUrl").value.trim();

  if (!remoteUrl) {
    showView("remote-form");
    return;
  }

  document.getElementById("remoteUrl").value = remoteUrl;
  showView("remote-form");
  await verifyRemote();
}

function showRemoteConnectingState(result) {
  const loopState = result.bootstrapStatus === "bootstrap_pending"
    ? "bootstrap_pending"
    : result.sessionState === "signed_out"
      ? "signin_required"
      : null;

  document.getElementById("connectingLabel").textContent =
    loopState === "bootstrap_pending"
      ? "Opening remote setup..."
      : loopState === "signin_required"
        ? "Opening remote sign-in..."
        : "Opening verified remote...";
  document.getElementById("connectingUrl").textContent = result.normalizedUrl || document.getElementById("remoteUrl").value.trim();
  showView("connecting");
}

function needsBrowserStep(result) {
  return result && (result.bootstrapStatus === "bootstrap_pending" || result.sessionState === "signed_out");
}

function updateSessionReturn(viewName) {
  const container = document.getElementById("sessionReturn");
  const button = document.getElementById("sessionReturnBtn");
  const hiddenViews = new Set(["local-boot", "connecting"]);
  const visible = !!(snapshot && snapshot.hasCurrentConnection && !hiddenViews.has(viewName));

  container.classList.toggle("visible", visible);
  button.textContent = snapshot && snapshot.currentConnectionLabel
    ? snapshot.currentConnectionLabel
    : "Return to Current Session";
}

function renderConnections() {
  const list = document.getElementById("connectionsList");
  const profiles = snapshot ? snapshot.profiles : [];

  if (!profiles.length) {
    list.innerHTML = '<div class="empty-state">No saved connections yet.</div>';
    return;
  }

  list.innerHTML = profiles.map((profile) => {
    const icon = profile.mode === "local_embedded"
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
    const lastConnected = profile.lastConnectedAt
      ? '<span class="pill">Last connected: ' + escapeHtml(relativeTime(profile.lastConnectedAt)) + "</span>"
      : "";
    const actions = profile.mode === "remote_existing"
      ? "<div class=\"conn-actions\" onclick=\"event.stopPropagation()\">" +
          "<button title=\"Edit\" onclick=\"openEditModal('" + escapeJsSingleQuote(profile.id) + "')\">&#9998;</button>" +
          "<button title=\"Duplicate\" onclick=\"duplicateConn('" + escapeJsSingleQuote(profile.id) + "')\">&#10697;</button>" +
          "<button class=\"delete-btn\" title=\"Delete\" onclick=\"deleteConn('" + escapeJsSingleQuote(profile.id) + "')\">&#10005;</button>" +
        "</div>"
      : "";

    return "<div class=\"conn-item " + (snapshot.activeProfileId === profile.id ? "active-conn" : "") + "\" ondblclick=\"quickConnect('" + escapeJsSingleQuote(profile.id) + "')\">" +
      '<div class="conn-icon">' + icon + "</div>" +
      '<div class="conn-info">' +
        '<div class="conn-name">' + escapeHtml(profile.name) + "</div>" +
        '<div class="conn-url">' + escapeHtml(profile.remoteUrl || "Embedded local server") + "</div>" +
        '<div class="conn-meta"><span class="pill">' + escapeHtml(capabilityLabel(profile)) + "</span>" + lastConnected + "</div>" +
      "</div>" +
      '<div class="conn-status-dot ' + statusClass(profile) + '"></div>' +
      actions +
    "</div>";
  }).join("");
}

function openAddModal() {
  editingId = null;
  document.getElementById("modalTitle").textContent = "Add Connection";
  document.getElementById("modalName").value = "";
  document.getElementById("modalUrl").value = "";
  document.getElementById("modalError").style.display = "none";
  document.getElementById("editModal").classList.add("active");
}

function openEditModal(profileId) {
  const profile = snapshot.profiles.find((candidate) => candidate.id === profileId);
  if (!profile || profile.mode !== "remote_existing") {
    return;
  }

  editingId = profileId;
  document.getElementById("modalTitle").textContent = "Edit Connection";
  document.getElementById("modalName").value = profile.name;
  document.getElementById("modalUrl").value = profile.remoteUrl || "";
  document.getElementById("modalError").style.display = "none";
  document.getElementById("editModal").classList.add("active");
}

function closeModal() {
  editingId = null;
  document.getElementById("editModal").classList.remove("active");
}

async function saveModal() {
  const name = document.getElementById("modalName").value.trim();
  const remoteUrl = document.getElementById("modalUrl").value.trim();

  try {
    const nextSnapshot = await launcher.saveRemoteProfile({
      profileId: editingId || undefined,
      name,
      remoteUrl,
    });
    applySnapshot(nextSnapshot);
    closeModal();
    showView("saved");
  } catch (error) {
    document.getElementById("modalError").textContent = error && error.message ? error.message : "Enter a valid http(s) URL.";
    document.getElementById("modalError").style.display = "block";
  }
}

async function duplicateConn(profileId) {
  const nextSnapshot = await launcher.duplicateProfile(profileId);
  applySnapshot(nextSnapshot);
  showView("saved");
}

async function deleteConn(profileId) {
  const nextSnapshot = await launcher.deleteProfile(profileId);
  applySnapshot(nextSnapshot);
  showView("saved");
}

async function quickConnect(profileId) {
  const profile = snapshot.profiles.find((candidate) => candidate.id === profileId);
  if (!profile) {
    return;
  }

  if (profile.mode === "local_embedded") {
    lastErrorAction = { type: "local", rememberChoice: false };
    resetLocalBoot();
    showView("local-boot");
    await launcher.connectSavedProfile(profileId);
    return;
  }

  document.getElementById("remoteUrl").value = profile.remoteUrl || "";
  document.getElementById("displayName").value = profile.name;
  lastErrorAction = {
    type: "remote",
    saveProfile: false,
    rememberChoice: false,
    remoteUrl: profile.remoteUrl,
    displayName: profile.name,
  };
  document.getElementById("connectingLabel").textContent = "Opening verified remote...";
  document.getElementById("connectingUrl").textContent = profile.remoteUrl || "";
  showView("connecting");
  await launcher.connectSavedProfile(profileId);
}

function resetLocalBoot() {
  document.getElementById("localProgress").style.width = "0%";
  Object.values(stepElements).forEach((step) => {
    step.classList.remove("active", "done");
    step.querySelector(".step-icon").innerHTML = '<div class="pending"></div>';
    const detail = step.querySelector(".step-detail");
    if (detail) {
      detail.remove();
    }
  });
}

function applyBootStatus(payload) {
  showView("local-boot");
  document.getElementById("localProgress").style.width = Math.min(100, Math.max(0, payload.progress || 0)) + "%";
  const currentIndex = stepOrder.indexOf(payload.step);

  stepOrder.forEach((key, index) => {
    const step = stepElements[key];
    const iconContainer = step.querySelector(".step-icon");
    step.classList.remove("active", "done");

    if (index < currentIndex) {
      step.classList.add("done");
      iconContainer.innerHTML = '<span class="check">&#10003;</span>';
      ensureStepDetail(step, "");
      return;
    }

    if (index === currentIndex) {
      step.classList.add("active");
      iconContainer.innerHTML = '<div class="spinner"></div>';
      ensureStepDetail(step, payload.detail || "");
      return;
    }

    iconContainer.innerHTML = '<div class="pending"></div>';
    const detail = step.querySelector(".step-detail");
    if (detail) {
      detail.remove();
    }
  });
}

function ensureStepDetail(step, detailText) {
  if (!detailText) {
    return;
  }

  let detail = step.querySelector(".step-detail");
  if (!detail) {
    detail = document.createElement("div");
    detail.className = "step-detail";
    step.querySelector(".step-label").parentElement.appendChild(detail);
  }
  detail.textContent = detailText;
}

function capabilityLabel(profile) {
  if (profile.mode === "local_embedded") {
    return "Local embedded";
  }

  switch (profile.lastHealth) {
    case "healthy":
      return "Authenticated / session active";
    case "auth_required":
      return "Authenticated / sign-in required";
    case "unsupported":
      return "Blocked: unsupported remote";
    case "unreachable":
      return "Host unreachable";
    default:
      return "Pending verification";
  }
}

function statusClass(profile) {
  switch (profile.lastHealth) {
    case "healthy":
      return "healthy";
    case "auth_required":
      return "auth-required";
    case "unsupported":
      return "unsupported";
    case "unreachable":
      return "unreachable";
    default:
      return "unknown";
  }
}

function mapVerificationResult(result) {
  if (result.ok && result.bootstrapStatus === "bootstrap_pending") {
    return {
      success: true,
      badgeClass: "warning",
      badge: "Verified remote - setup required",
      title: "Instance setup required",
      detail: mergeDetail(
        "The host is a verified authenticated Paperclip remote, but no instance admin exists yet. Open the remote setup flow instead of entering credentials in Desktop.",
        result.warning,
      ),
      meta: buildResultMeta(result),
      actionLabel: "Open Setup in Browser",
      saveLabel: "Save Connection",
    };
  }

  if (result.ok && result.sessionState === "signed_in") {
    return {
      success: true,
      badgeClass: "healthy",
      badge: "Authenticated Paperclip detected",
      title: "Verified remote ready",
      detail: mergeDetail(
        "The host looks like a Paperclip instance in authenticated mode, and an active session was found.",
        result.warning,
      ),
      meta: buildResultMeta(result),
      actionLabel: "Connect Remote",
      saveLabel: "Connect & Save",
    };
  }

  if (result.ok && result.sessionState === "signed_out") {
    return {
      success: true,
      badgeClass: "warning",
      badge: "Verified remote - sign-in required",
      title: "Verified remote, no active session",
      detail: mergeDetail(
        "The host looks like an authenticated Paperclip instance. Continue to the remote sign-in flow instead of entering credentials in Desktop.",
        result.warning,
      ),
      meta: buildResultMeta(result),
      actionLabel: "Open Sign-In in Browser",
      saveLabel: "Save Connection",
    };
  }

  const detail = mergeDetail(result.detail || "Could not verify remote.", result.warning);
  if (result.reason === "unsupported_local_trusted") {
    return {
      success: false,
      badgeClass: "unreachable",
      badge: "Unsupported remote deployment",
      title: "Paperclip detected but not eligible",
      detail,
      meta: buildResultMeta(result),
      actionLabel: "Continue to Sign-In",
      saveLabel: "Connect & Save",
    };
  }

  if (result.reason === "not_paperclip") {
    return {
      success: false,
      badgeClass: "unreachable",
      badge: "Host reachable, not Paperclip",
      title: "Non-Paperclip endpoint",
      detail,
      meta: buildResultMeta(result),
      actionLabel: "Continue to Sign-In",
      saveLabel: "Connect & Save",
    };
  }

  if (result.reason === "tls_error") {
    return {
      success: false,
      badgeClass: "unreachable",
      badge: "TLS validation failed",
      title: "Remote certificate rejected",
      detail,
      meta: buildResultMeta(result),
      actionLabel: "Continue to Sign-In",
      saveLabel: "Connect & Save",
    };
  }

  return {
    success: false,
    badgeClass: "unreachable",
    badge: "Host unreachable",
    title: "Could not verify remote",
    detail,
    meta: buildResultMeta(result),
    actionLabel: "Continue to Sign-In",
    saveLabel: "Connect & Save",
  };
}

function buildResultMeta(result) {
  const meta = [];
  if (result.deploymentMode) meta.push("deploymentMode=" + result.deploymentMode);
  if (result.deploymentExposure) meta.push("deploymentExposure=" + result.deploymentExposure);
  if (result.authReady !== null && result.authReady !== undefined) meta.push("authReady=" + result.authReady);
  if (result.bootstrapStatus) meta.push("bootstrapStatus=" + result.bootstrapStatus);
  if (result.bootstrapInviteActive !== null && result.bootstrapInviteActive !== undefined) meta.push("bootstrapInviteActive=" + result.bootstrapInviteActive);
  if (result.sessionState) meta.push("session=" + result.sessionState);
  if (result.version) meta.push("version=" + result.version);
  return meta;
}

function mergeDetail(detail, warning) {
  return warning ? detail + " " + warning : detail;
}

function relativeTime(timestamp) {
  const value = Date.parse(timestamp);
  if (Number.isNaN(value)) {
    return timestamp;
  }

  const diff = Date.now() - value;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return Math.round(diff / 60_000) + " min ago";
  if (diff < 86_400_000) return Math.round(diff / 3_600_000) + " hr ago";
  return Math.round(diff / 86_400_000) + " day(s) ago";
}

function applySnapshot(nextSnapshot) {
  snapshot = nextSnapshot;
  selectedCard = nextSnapshot.state.chooserMode === "remote_existing" ? "remote" : "local";
  selectCard(selectedCard);
  document.getElementById("rememberChoice").checked =
    !nextSnapshot.state.alwaysShowChooser && nextSnapshot.state.autoConnectLastProfile;
  renderConnections();
  updateSessionReturn((document.querySelector(".view.active") || {}).id?.replace("view-", "") || nextSnapshot.initialView || "chooser");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function escapeJsSingleQuote(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll("'", "\\'");
}

window.paperclipLauncher.onStateChanged((nextSnapshot) => {
  applySnapshot(nextSnapshot);
});

window.paperclipLauncher.onNavigate((payload) => {
  if (payload.view === "saved") {
    showView("saved");
    return;
  }

  if (payload.view === "chooser") {
    showView("chooser");
    return;
  }

  if (payload.view === "remote-form") {
    if (payload.profile) {
      document.getElementById("remoteUrl").value = payload.profile.remoteUrl || "";
      document.getElementById("displayName").value = payload.profile.name || "";
    }
    showView("remote-form");
    return;
  }

  if (payload.view === "connecting") {
    document.getElementById("connectingLabel").textContent = payload.label || "Opening verified remote...";
    document.getElementById("connectingUrl").textContent = payload.url || "";
    showView("connecting");
    return;
  }

  if (payload.view === "remote-loop") {
    renderRemoteLoop(payload);
    return;
  }

  if (payload.view === "local-boot") {
    resetLocalBoot();
    showView("local-boot");
  }
});

window.paperclipLauncher.onBootStatus((payload) => {
  applyBootStatus(payload);
});

window.paperclipLauncher.onConnectionError((payload) => {
  document.getElementById("errorTitle").textContent = payload.title;
  document.getElementById("errorDetail").textContent = payload.detail;
  showView("error");
});

document.addEventListener("DOMContentLoaded", async () => {
  const initialSnapshot = await launcher.bootstrap();
  applySnapshot(initialSnapshot);
  showView(initialSnapshot.initialView || "chooser");
});
</script>
</body>
</html>`;
}
