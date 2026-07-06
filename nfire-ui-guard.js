(function () {
  const RESET_WINDOW_MS = 5000;
  let resetArmedAt = 0;
  let statusEl = null;
  let clearTimer = null;

  function labelIconControls(root) {
    const scope = root || document;
    const controlSelector = "button, [role='button']";
    const controls = [
      ...(scope.matches?.(controlSelector) ? [scope] : []),
      ...scope.querySelectorAll(controlSelector)
    ];
    controls.forEach((control) => {
      if (control.getAttribute("aria-hidden") === "true") return;
      if (control.getAttribute("aria-label") || control.textContent.trim()) return;
      const title = control.getAttribute("title");
      if (title) {
        control.setAttribute("aria-label", title);
        return;
      }
      if (control.querySelector(".lucide-refresh-cw")) {
        control.setAttribute("aria-label", "Restore default planning data");
        return;
      }
      if (control.querySelector(".lucide-wallet")) {
        control.setAttribute("aria-label", "Toggle current savings details");
      }
    });

    const fieldSelector = "input:not([type='hidden']), select, textarea";
    const fields = [
      ...(scope.matches?.(fieldSelector) ? [scope] : []),
      ...scope.querySelectorAll(fieldSelector)
    ];
    fields.forEach((field) => {
      if (field.getAttribute("aria-label") || field.getAttribute("aria-hidden") === "true") return;
      const id = field.getAttribute("id");
      const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
      const wrapperLabel = field.closest(".mantine-InputWrapper-root")?.querySelector("label");
      let name = (label || wrapperLabel)?.textContent?.replace(/\s+/g, " ").trim();
      if (!name && field.classList.contains("mantine-Select-input")) {
        const value = field.value || "";
        if (/^[A-Z]{2}$/.test(value)) name = "Province";
        if (/Fixed Amount|Career Formula/i.test(value)) name = "Pension payout mode";
      }
      if (name) field.setAttribute("aria-label", name);
    });
  }

  function ensureStatus() {
    if (statusEl) return statusEl;
    statusEl = document.createElement("div");
    statusEl.setAttribute("role", "status");
    statusEl.setAttribute("aria-live", "polite");
    statusEl.style.cssText = [
      "position:fixed",
      "left:max(12px, env(safe-area-inset-left))",
      "right:max(12px, env(safe-area-inset-right))",
      "bottom:max(40px, env(safe-area-inset-bottom))",
      "z-index:10000",
      "max-width:520px",
      "margin:0 auto",
      "padding:10px 14px",
      "border:1px solid rgba(0,240,255,.35)",
      "border-radius:14px",
      "background:rgba(5,5,5,.92)",
      "color:#fff",
      "box-shadow:0 12px 36px rgba(0,0,0,.34)",
      "font:600 12px/1.4 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      "text-align:center",
      "pointer-events:none",
      "opacity:0",
      "transform:translateY(8px)",
      "transition:opacity .16s ease, transform .16s ease"
    ].join(";");
    document.body.appendChild(statusEl);
    return statusEl;
  }

  window.__nfireStatus = function (message) {
    const el = ensureStatus();
    el.textContent = message;
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
    window.clearTimeout(clearTimer);
    clearTimer = window.setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
    }, 4200);
  };

  window.__nfireConfirmReset = function () {
    const now = Date.now();
    if (now - resetArmedAt <= RESET_WINDOW_MS) {
      resetArmedAt = 0;
      window.__nfireStatus("Reset confirmed. Restoring default local planning data.");
      return true;
    }
    resetArmedAt = now;
    window.__nfireStatus("Press reset again within 5 seconds to restore defaults.");
    return false;
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => labelIconControls(document));
  } else {
    labelIconControls(document);
  }
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) labelIconControls(node);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
