import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const runtimePath = path.join(root, "src", "model-runtime.js");
const artifactPath = path.join(root, "assets", "index-F7z_Yzm8.js");
const serviceWorkerPath = path.join(root, "sw.js");
const startMarker = "/* NFIRE_MODEL_SOURCE_START */";
const endMarker = "/* NFIRE_MODEL_SOURCE_END */";
const legacyStart = "const TZ={brackets:";
const legacyEnd = ";var Sp={exports:{}";
const runtime = fs.readFileSync(runtimePath, "utf8").replace(/\r\n/g, "\n").trim();
const original = fs.readFileSync(artifactPath, "utf8").replace(/\r\n/g, "\n");
const originalServiceWorker = fs.readFileSync(serviceWorkerPath, "utf8").replace(/\r\n/g, "\n");
let artifact = original;

const integration = `${startMarker}\n${runtime}\nconst nFIREEngine=globalThis.nFIREModelSource.createEngine(Ze),Ui=nFIREEngine.policy,Up=nFIREEngine.oasThreshold,Hp=nFIREEngine.calculateTax,XB=nFIREEngine.grossUpWithdrawal,ZB=nFIREEngine.calculatePension,V0=nFIREEngine.testSolvency,z0=nFIREEngine.simulate;globalThis.nFIREEngine=nFIREEngine;\n${endMarker}`;

if (artifact.includes(startMarker)) {
  const start = artifact.indexOf(startMarker);
  const end = artifact.indexOf(endMarker, start);
  if (end < 0) throw new Error("Generated model start marker has no matching end marker.");
  artifact = artifact.slice(0, start) + integration + artifact.slice(end + endMarker.length);
} else {
  const start = artifact.indexOf(legacyStart);
  const end = artifact.indexOf(legacyEnd, start);
  if (start < 0 || end < 0) throw new Error("Neither generated markers nor the pinned v10.1.40 legacy model were found.");
  artifact = artifact.slice(0, start) + integration + artifact.slice(end + 1);
}

const revision = crypto.createHash("md5").update(artifact).digest("hex");
const assetEntry = /\{url:"assets\/index-F7z_Yzm8\.js",revision:(?:null|"[a-f0-9]{32}")\}/;
if (!assetEntry.test(originalServiceWorker)) throw new Error("Service worker does not contain the pinned application asset entry.");
const serviceWorker = originalServiceWorker.replace(assetEntry, `{url:"assets/index-F7z_Yzm8.js",revision:"${revision}"}`);

if (process.argv.includes("--check")) {
  const stale = [];
  if (artifact !== original) stale.push(path.relative(root, artifactPath));
  if (serviceWorker !== originalServiceWorker) stale.push(path.relative(root, serviceWorkerPath));
  if (stale.length) throw new Error(`${stale.join(", ")} stale; run npm run build:model.`);
  console.log(`OK: readable financial model and precache revision are current (${revision}).`);
} else {
  fs.writeFileSync(artifactPath, artifact);
  fs.writeFileSync(serviceWorkerPath, serviceWorker);
  console.log(`Built readable financial model and precache revision (${revision}).`);
}
