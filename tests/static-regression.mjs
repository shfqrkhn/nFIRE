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
const releasePolicy = read("docs/RELEASE_ARTIFACT_POLICY.md");
const manifest = JSON.parse(read("manifest.webmanifest"));
const sitemap = read("sitemap.xml");
const robots = read("robots.txt");
const sw = read("sw.js");
const headers = read("_headers");
const md5Text = (file) =>
  crypto.createHash("md5").update(read(file).replace(/\r\n/g, "\n")).digest("hex");

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
  assert(html.includes("Planning aid only. Not financial, investment, tax, legal, or retirement advice."), `${file} must expose the finance disclaimer.`);
  assert(!html.includes("http://"), `${file} must not reference insecure URLs.`);
}

assert(readme.includes("[shfqrkhn.github.io/nFIRE](https://shfqrkhn.github.io/nFIRE/)"), "README must link the live demo.");
assert(readme.includes("[GitHub latest release](https://github.com/shfqrkhn/nFIRE/releases/latest)"), "README must link the latest release.");
assert(readme.includes("**License:** MIT"), "README must expose the MIT license above the fold.");
assert(readme.includes("![nFIRE financial independence dashboard](./screenshot-main.png)"), "README must include the screenshot.");
assert(readme.includes("python -m http.server 8080"), "README must document the local static-server command.");
assert(readme.includes("Use a local server instead of opening `index.html` directly"), "README must prevent direct-file launch confusion.");
assert(readme.includes("No account or backend is required"), "README must document the local-first privacy model.");
assert(readme.includes("export or back up local data"), "README must document backup/export expectations.");
assert(readme.includes("not financial, investment, tax, legal, or retirement advice"), "README must include the explicit advice disclaimer.");
assert(releasePolicy.includes("User plans and exports must never be bundled"), "Release policy must block bundled user plans.");
assert(releasePolicy.includes("Claims of financial, investment, tax, legal, retirement, or eligibility advice"), "Release policy must block advice claims.");
assert(releasePolicy.includes("bash scripts/verify_artifact_consistency.sh"), "Release policy must include artifact consistency verification.");

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
}
assert(sw.includes("index.html"), "Service worker must precache the app shell.");
assert(sw.includes("manifest.webmanifest"), "Service worker must precache the manifest.");
assert(sw.includes(`{url:"index.html",revision:"${md5Text("index.html")}"}`), "Service worker index.html revision must match the app shell.");
assert(!sw.includes("http://") && !sw.includes("https://"), "Service worker must not call external URLs.");

console.log(`OK: static regression checks passed for nFIRE v${version}.`);
