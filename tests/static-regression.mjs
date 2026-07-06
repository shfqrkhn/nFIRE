import { execFileSync } from "node:child_process";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const fail = (message) => {
  throw new Error(message);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const index = read("index.html");
const notFound = read("404.html");
const readme = read("README.md");
const zipPolicy = read("docs/REPO_ZIP_POLICY.md");
const evidenceReceipt = read("docs/EVIDENCE_RECEIPT.md");
const handoff = read("docs/AI_MAINTAINER_HANDOFF.md");
const codeqlWorkflow = read(".github/workflows/codeql.yml");
const codeqlConfig = read(".github/codeql/codeql-config.yml");
const staticCheckWorkflow = read(".github/workflows/static-check.yml");
const pkg = JSON.parse(read("package.json"));
const manifest = JSON.parse(read("manifest.webmanifest"));
const sitemap = read("sitemap.xml");
const robots = read("robots.txt");
const sw = read("sw.js");
const headers = read("_headers");
const uiGuard = read("nfire-ui-guard.js");
const forbiddenTrackedPathPattern = /(^|\/)(node_modules|offline|linkedin-post-package|test-results|playwright-report|\.codex-remote-attachments)(\/|$)|^data\/(manual-overrides\.json|latest-simulation\.json|scoreboards)(\/|$)|(^|\/).*\.((env)|(pem)|(key)|(p12)|(pfx))$|(^|\/)(exports?|backups?|logs?|scratch)(\/|$)/i;
const popupPattern = /\b(alert|confirm|prompt)\s*\(/;
const trackedFiles = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((file) => file.replace(/\\/g, "/"));
const forbiddenTrackedFiles = trackedFiles.filter((file) => forbiddenTrackedPathPattern.test(file));
function gitArchiveEntries() {
  const archive = execFileSync("git", ["archive", "--format=tar", "HEAD"], {
    cwd: root,
    maxBuffer: 128 * 1024 * 1024,
  });
  const entries = [];
  for (let offset = 0; offset + 512 <= archive.length;) {
    const header = archive.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;
    const name = header.toString("utf8", 0, 100).replace(/\0.*$/, "");
    const prefix = header.toString("utf8", 345, 500).replace(/\0.*$/, "");
    const sizeRaw = header.toString("utf8", 124, 136).replace(/\0.*$/, "").trim();
    const size = sizeRaw ? parseInt(sizeRaw, 8) : 0;
    const fullName = [prefix, name].filter(Boolean).join("/");
    if (fullName) entries.push(fullName.replace(/\\/g, "/"));
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return entries;
}
const archiveEntries = gitArchiveEntries();
const pendingWorkspaceFiles = execFileSync("git", ["status", "--short"], { cwd: root, encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.slice(3).replace(/\\/g, "/").replace(/^"|"$/g, ""));
const archiveOrPending = (file) => archiveEntries.includes(file) || pendingWorkspaceFiles.includes(file);
const forbiddenArchiveEntries = archiveEntries.filter((file) => forbiddenTrackedPathPattern.test(file));
const requiredArchiveEntries = [
  "index.html",
  "404.html",
  "README.md",
  "docs/REPO_ZIP_POLICY.md",
  "package-lock.json",
  "package.json",
  "playwright.config.mjs",
  "nfire-ui-guard.js",
  "tests/ui-smoke.spec.mjs",
  "manifest.webmanifest",
  "sw.js",
  "_headers",
  "_redirects",
  "screenshot-main.png",
];
const md5Text = (file) =>
  crypto.createHash("md5").update(read(file).replace(/\r\n/g, "\n")).digest("hex");

assert(forbiddenTrackedFiles.length === 0, `Forbidden tracked paths: ${forbiddenTrackedFiles.join(", ")}`);
assert(forbiddenArchiveEntries.length === 0, `Forbidden generated archive paths: ${forbiddenArchiveEntries.join(", ")}`);
for (const file of requiredArchiveEntries) {
  assert(archiveOrPending(file), `Generated repository archive must include runtime path once committed: ${file}`);
}
const versionMatch = readme.match(/\*\*Version:\*\* v(\d+\.\d+\.\d+)/);
assert(versionMatch, "README must expose the shipped app version.");
const version = versionMatch[1];
for (const file of ["index.html", "404.html"]) {
  assert(read(file).includes(`>v${version}</div>`), `${file} version must match README.`);
}

for (const [file, html] of [
  ["index.html", index],
  ["404.html", notFound],
]) {
  assert(html.includes('name="viewport"'), `${file} must define a responsive viewport.`);
  assert(html.includes("upgrade-insecure-requests"), `${file} must keep the CSP upgrade guard.`);
  assert(!/<meta[^>]+http-equiv="Content-Security-Policy"[^>]+frame-ancestors/.test(html), `${file} must not put frame-ancestors in meta CSP.`);
  assert(/rel="preload" href="\.\/assets\/[^"]+\.css" as="style" crossorigin/.test(html), `${file} CSS preload must match stylesheet credentials.`);
  assert(html.includes("touch-action: manipulation"), `${file} must keep touch-friendly controls.`);
  assert(html.includes("github.com/sponsors/shfqrkhn?o=esb"), `${file} must expose the Sponsor link.`);
  assert(html.includes("Planning aid only. Not financial, investment, tax, legal, retirement, or eligibility advice."), `${file} must expose the finance and eligibility disclaimer.`);
  assert(html.includes("./nfire-ui-guard.js"), `${file} must load the nonblocking UI guard.`);
  assert(html.includes("local-first planning aid"), `${file} metadata must preserve planning-aid positioning.`);
  assert(!html.includes("financial independence engine"), `${file} metadata must not position the app as an advisory engine.`);
  assert(!/\b(eligibility determination|official government\/benefit determination|individualized professional recommendation)\b/i.test(html), `${file} must not imply eligibility or professional recommendation output.`);
  assert(!html.includes("http://"), `${file} must not reference insecure URLs.`);
}

assert(readme.includes("[shfqrkhn.github.io/nFIRE](https://shfqrkhn.github.io/nFIRE/)"), "README must link the live demo.");
assert(readme.includes("[Download current main ZIP](https://github.com/shfqrkhn/nFIRE/archive/refs/heads/main.zip)"), "README must link the repository ZIP.");
assert(!readme.includes("/releases/latest"), "README must not link GitHub Releases.");
assert(readme.includes("**License:** MIT"), "README must expose the MIT license above the fold.");
assert(readme.includes("![nFIRE financial independence dashboard](./screenshot-main.png)"), "README must include the screenshot.");
assert(readme.includes("python -m http.server 8080"), "README must document the local static-server command.");
assert(readme.includes("Use a local server instead of opening `index.html` directly"), "README must prevent direct-file launch confusion.");
assert(readme.includes("No account or backend is required"), "README must document the local-first privacy model.");
assert(readme.includes("export or back up local data"), "README must document backup/export expectations.");
assert(readme.includes("not financial, investment, tax, legal, retirement, or eligibility advice"), "README must include the explicit advice and eligibility disclaimer.");
assert(readme.includes("It does not determine eligibility"), "README must explicitly block eligibility determinations.");
assert(zipPolicy.includes("User plans and exports must never be bundled"), "Repository ZIP policy must block bundled user plans.");
assert(zipPolicy.includes("Claims of financial, investment, tax, legal, retirement, or eligibility advice"), "Repository ZIP policy must block advice claims.");
assert(zipPolicy.includes("git archive"), "Repository ZIP policy must tie download claims to generated archive evidence.");
assert(pkg.scripts?.["test:artifact"] === "bash scripts/verify_artifact_consistency.sh", "package must expose artifact consistency verification.");
assert(pkg.scripts?.["test:ui"] === "playwright test tests/ui-smoke.spec.mjs", "package must expose browser UI smoke verification.");
assert(pkg.scripts?.qa === "npm test && npm run test:artifact && npm run test:ui", "package must expose the full QA gate.");
assert(pkg.devDependencies?.["@playwright/test"], "package must pin Playwright for autonomous UI smoke coverage.");
assert(readme.includes("npm run qa"), "README must document the full QA gate.");
assert(zipPolicy.includes("npm run qa"), "Repository ZIP policy must include the full QA gate.");
assert(handoff.includes("npm run qa"), "Maintainer handoff must include the full QA gate.");
assert(evidenceReceipt.includes("npm run qa"), "Evidence receipt must include the full QA gate.");
assert(readme.includes("Playwright UI smoke gate"), "README must document browser UI smoke coverage.");
for (const phrase of ["browser UI smoke coverage", "onboarding", "export/import", "accessible control names"]) {
  assert(zipPolicy.includes(phrase), `Repository ZIP policy missing UI smoke coverage term: ${phrase}`);
}
assert(evidenceReceipt.includes("PASS_WITH_LIMITATIONS"), "Evidence receipt must define limited claims.");
assert(evidenceReceipt.includes("Planning aid only"), "Evidence receipt must preserve planning-aid boundary.");
assert(evidenceReceipt.includes("No financial, tax, legal, investment, retirement, or eligibility advice."), "Evidence receipt must block advice claims.");
for (const phrase of ["Claim Firewall Invariant", "Claim Boundaries", "must map", "NOT_RUN", "BLOCKED", "current source/repo state"]) {
  assert(evidenceReceipt.includes(phrase), `Evidence receipt missing claim firewall term: ${phrase}`);
}
for (const phrase of ["Currentness Watchdog", "stale, missing, inaccessible", "downgrade the affected claim", "assumption/source/repo/GitHub state"]) {
  assert(evidenceReceipt.includes(phrase), `Evidence receipt missing currentness watchdog term: ${phrase}`);
}
for (const phrase of ["Safe-To-Publish Receipt", "clean synced tree", "no GitHub Releases", "no protected tracked paths", "no open secret/dependabot/code-scanning alerts", "code-scanning not-applicable/no-analysis state", "remaining risks"]) {
  assert(evidenceReceipt.includes(phrase), `Evidence receipt missing safe-to-publish term: ${phrase}`);
}
assert(evidenceReceipt.includes("git rev-list --left-right --count 'HEAD...@{u}'"), "Evidence receipt must preserve the PowerShell-safe upstream delta command.");
assert(evidenceReceipt.includes("gh release list --limit 5"), "Evidence receipt must require a GitHub Releases absence check.");
assert(evidenceReceipt.includes("git archive"), "Evidence receipt must tie repository ZIP safety to generated archive evidence.");
for (const phrase of ["Runtime app code scanning", ".github/workflows/codeql.yml", "CodeQL JavaScript analysis", "PASS_WITH_LIMITATIONS"]) {
  assert(evidenceReceipt.includes(phrase), `Evidence receipt missing code scanning term: ${phrase}`);
}
for (const phrase of ["github/codeql-action/init@v4", "github/codeql-action/analyze@v4", "languages: javascript-typescript", "security-events: write", "config-file: ./.github/codeql/codeql-config.yml"]) {
  assert(codeqlWorkflow.includes(phrase), `CodeQL workflow missing: ${phrase}`);
}
for (const phrase of ["npm ci", "npx playwright install --with-deps chromium", "npm run qa"]) {
  assert(staticCheckWorkflow.includes(phrase), `Static check workflow missing browser QA step: ${phrase}`);
}
for (const phrase of ["paths-ignore:", "tests/**", "node_modules/**", "test-results/**", "playwright-report/**"]) {
  assert(codeqlConfig.includes(phrase), `CodeQL config missing: ${phrase}`);
}
for (const phrase of ["Input Accessibility Evidence", "keyboard only", "mouse/pointer only", "touch only", "platform-limited input only", "No critical workflow may require", "platform text-entry support", "Single input operation"]) {
  assert(evidenceReceipt.includes(phrase), `Evidence receipt missing input accessibility term: ${phrase}`);
}
for (const phrase of ["Design Language Evidence", "Signature Ecosystem Evidence", "shared `shfqrkhn` ecosystem", "Signature ecosystem fit", "modern minimalist", "Uiverse", "Open Props", "Design language/UI safety", "browser JS popups", "component overlap"]) {
  assert(evidenceReceipt.includes(phrase), `Evidence receipt missing design language term: ${phrase}`);
}
for (const phrase of ["Recovery And Data Safety Evidence", "Export, backup, reset", "user-controlled", "local-first", "browser data loss", "Recovery/data safety"]) {
  assert(evidenceReceipt.includes(phrase), `Evidence receipt missing recovery/data safety term: ${phrase}`);
}
for (const phrase of ["Mission-Critical Reliability Evidence", "self-checking", "crash-recoverable", "state-explicit", "TDD/SDD", "Autonomous AI-assisted development", "Mission-critical reliability"]) {
  assert(evidenceReceipt.includes(phrase), `Evidence receipt missing mission-critical reliability term: ${phrase}`);
}
for (const phrase of ["Assumption And Explainability Evidence", "user-editable planning inputs", "professional review, advice, eligibility screening", "visible inputs", "documented formulas", "source, freshness, limitation, and failure behavior"]) {
  assert(evidenceReceipt.includes(phrase), `Evidence receipt missing assumption/explainability term: ${phrase}`);
}
for (const phrase of ["OmniOS Transfer Contract", "Product truth", "Execution truth", "Evidence truth", "Operations truth", "Transfer truth", "GitHub Releases stay absent"]) {
  assert(handoff.includes(phrase), `Handoff missing OmniOS transfer contract term: ${phrase}`);
}
for (const phrase of ["Ecosystem truth", "shared signature design system", "Design truth", "Single input truth", "modern minimalist", "MIT UI libraries/resources", "browser JS popups", "arbitrary component copy-paste", "combined input-mode path"]) {
  assert(handoff.includes(phrase), `Handoff missing design truth term: ${phrase}`);
}
for (const phrase of ["Reliability truth", "self-checking", "crash-recoverable", "state-explicit", "TDD/SDD-backed", "remove complexity"]) {
  assert(handoff.includes(phrase), `Handoff missing reliability truth term: ${phrase}`);
}
for (const phrase of ["Doctrine Delta Decision", "promote", "reject", "quarantine", "keep_local", "source-backed, reusable, non-secret", "explicitly approves publication"]) {
  assert(handoff.includes(phrase), `Handoff missing doctrine delta term: ${phrase}`);
}
assert(!popupPattern.test(`${index}\n${notFound}\n${uiGuard}\n${sw}\n${read("assets/index-F7z_Yzm8.js")}`), "Runtime must not use browser popup APIs.");
assert(uiGuard.includes("__nfireStatus") && uiGuard.includes("__nfireConfirmReset") && uiGuard.includes("Press reset again within 5 seconds"), "UI guard must provide nonblocking status and reset confirmation.");
assert(uiGuard.includes("labelIconControls") && uiGuard.includes("Restore default planning data") && uiGuard.includes("Toggle current savings details"), "UI guard must label icon-only controls.");

for (const file of [
  ".nojekyll",
  "screenshot-main.png",
  "pwa-192x192.png",
  "pwa-512x512.png",
  "pwa-180x180.png",
  "favicon.ico",
]) {
  assert(exists(file), `${file} must exist.`);
}

assert(manifest.start_url === "./", "Manifest start_url must stay GitHub Pages-relative.");
assert(manifest.scope === "./", "Manifest scope must stay GitHub Pages-relative.");
assert(manifest.display === "standalone", "Manifest must keep installable standalone display.");
for (const icon of manifest.icons) {
  assert(icon.src.startsWith("./"), `Manifest icon ${icon.src} must be relative.`);
  assert(exists(icon.src.slice(2)), `Manifest icon ${icon.src} must exist.`);
}
for (const screenshot of manifest.screenshots ?? []) {
  assert(screenshot.src.startsWith("./"), `Manifest screenshot ${screenshot.src} must be relative.`);
  assert(exists(screenshot.src.slice(2)), `Manifest screenshot ${screenshot.src} must exist.`);
}

assert(robots.includes("Sitemap: https://shfqrkhn.github.io/nFIRE/sitemap.xml"), "robots.txt must point to the public sitemap.");
assert(sitemap.includes("<loc>https://shfqrkhn.github.io/nFIRE/</loc>"), "sitemap must list the live app URL.");
assert(sitemap.includes("<lastmod>2026-07-02</lastmod>"), "sitemap lastmod must match the current hardening date.");
assert(headers.includes("frame-ancestors 'none'"), "_headers must keep the live clickjacking guard.");

for (const asset of [...index.matchAll(/(?:src|href)="\.\/([^"]+)"/g)].map((match) => match[1])) {
  assert(exists(asset), `Referenced asset ${asset} must exist.`);
  assert(archiveOrPending(asset), `Generated repository archive must include referenced asset once committed: ${asset}`);
}
assert(sw.includes("index.html"), "Service worker must precache the app shell.");
assert(sw.includes(`{url:"nfire-ui-guard.js",revision:"${md5Text("nfire-ui-guard.js")}"}`), "Service worker nfire-ui-guard.js revision must match the nonblocking UI guard.");
assert(sw.includes("manifest.webmanifest"), "Service worker must precache the manifest.");
assert(sw.includes(`{url:"index.html",revision:"${md5Text("index.html")}"}`), "Service worker index.html revision must match the app shell.");
assert(!sw.includes("http://") && !sw.includes("https://"), "Service worker must not call external URLs.");

console.log(`OK: static regression checks passed for nFIRE v${version}.`);
