#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const partners = [
  { slug: "samsung-life", domain: "samsunglife.com", wiki: "삼성생명" },
  { slug: "hanwha-life", domain: "hanwhalife.com", wiki: "한화생명" },
  { slug: "kyobo", domain: "kyobo.co.kr", wiki: "교보생명" },
  { slug: "shinhan-life", domain: "shinhanlife.com", wiki: "신한라이프생명" },
  { slug: "kb-life", domain: "kbli.co.kr", wiki: "KB라이프생명" },
  { slug: "nh-life", domain: "nhlife.co.kr", wiki: "NH농협생명" },
  { slug: "miraeasset-life", domain: "miraeassetlife.com", wiki: "미래에셋생명" },
  { slug: "dongyang-life", domain: "myangel.co.kr", wiki: "동양생명" },
  { slug: "heungkuk-life", domain: "heungkuklife.com", wiki: "흥국생명" },
  { slug: "metlife", domain: "metlife.co.kr", wiki: "메트라이프" },
  { slug: "aia", domain: "aia.co.kr", wiki: "AIA그룹" },
  { slug: "prudential", domain: "prudential.co.kr", wiki: "푸르덴셜생명보험" },
  { slug: "chubb-life", domain: "chubblife.co.kr", wiki: "처브라이프생명" },
  { slug: "abl-life", domain: "abllife.co.kr", wiki: "ABL생명" },
  { slug: "samsung-fire", domain: "samsungfire.com", wiki: "삼성화재해상보험" },
  { slug: "hyundai-marine", domain: "hi.co.kr", wiki: "현대해상화재보험" },
  { slug: "db-ins", domain: "idbins.com", wiki: "DB손해보험" },
  { slug: "kb-ins", domain: "kbinsure.co.kr", wiki: "KB손해보험" },
  { slug: "meritz-fire", domain: "meritzfire.com", wiki: "메리츠화재해상보험" },
  { slug: "hanwha-ins", domain: "hwgeneralins.com", wiki: "한화손해보험" },
  { slug: "lotte-ins", domain: "lotteins.co.kr", wiki: "롯데손해보험" },
  { slug: "nh-fire", domain: "nhfire.co.kr", wiki: "NH농협손해보험" },
  { slug: "heungkuk-fire", domain: "heungkukfire.co.kr", wiki: "흥국화재해상보험" },
  { slug: "axa", domain: "axa.co.kr", wiki: "AXA" },
  { slug: "mg-ins", domain: "mggeneralins.com", wiki: "MG손해보험" },
  { slug: "carrot-ins", domain: "carrotins.com", wiki: "캐롯손해보험" },
];

const OUT_DIR = "public/logos";
const MANIFEST_PATH = "src/config/logo-manifest.json";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
const TIMEOUT = 25000;
const ONLY_MISSING = process.argv.includes("--only-missing");

await fs.mkdir(OUT_DIR, { recursive: true });

const BROWSER_HEADERS = {
  "User-Agent": UA,
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "sec-ch-ua": '"Chromium";v="123", "Not:A-Brand";v="8"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

function fetchWithTimeout(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), opts.timeout ?? TIMEOUT);
  return fetch(url, {
    ...opts,
    signal: ctrl.signal,
    redirect: "follow",
    headers: { ...BROWSER_HEADERS, ...(opts.headers ?? {}) },
  }).finally(() => clearTimeout(t));
}

async function fetchHtml(domain) {
  const errors = [];
  for (const url of [`https://www.${domain}`, `https://${domain}`]) {
    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) {
        errors.push(`${url} → HTTP ${res.status}`);
        continue;
      }
      const html = await res.text();
      return { html, baseUrl: res.url };
    } catch (e) {
      errors.push(`${url} → ${e.message}`);
    }
  }
  throw new Error(errors.join("; "));
}

function extractIconCandidates(html, baseUrl) {
  const candidates = [];
  const linkRe = /<link\b[^>]*>/gi;
  const matches = html.match(linkRe) ?? [];
  for (const tag of matches) {
    const rel = (tag.match(/\brel=["']([^"']+)["']/i)?.[1] ?? "").toLowerCase();
    const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
    const sizes = tag.match(/\bsizes=["']([^"']+)["']/i)?.[1] ?? "";
    if (!href) continue;
    const sizeNum = parseInt(sizes.split("x")[0] || "0", 10) || 0;
    let priority = 0;
    if (rel.includes("apple-touch-icon")) priority = 100 + sizeNum;
    else if (rel.includes("icon") && href.endsWith(".svg")) priority = 90;
    else if (rel.includes("mask-icon")) priority = 80;
    else if (rel.includes("icon") && href.match(/\.(png|jpg|jpeg|webp)$/i)) priority = 50 + sizeNum;
    else if (rel.includes("shortcut") || rel.includes("icon")) priority = 30;
    if (priority === 0) continue;
    try {
      const abs = new URL(href, baseUrl).href;
      candidates.push({ url: abs, priority });
    } catch {}
  }

  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogMatch) {
    try {
      candidates.push({ url: new URL(ogMatch[1], baseUrl).href, priority: 20 });
    } catch {}
  }

  candidates.push({ url: new URL("/apple-touch-icon.png", baseUrl).href, priority: 10 });
  candidates.push({ url: new URL("/favicon.ico", baseUrl).href, priority: 1 });

  candidates.sort((a, b) => b.priority - a.priority);
  const seen = new Set();
  return candidates.filter((c) => {
    if (seen.has(c.url)) return false;
    seen.add(c.url);
    return true;
  });
}

function extFromContentType(ct, fallback) {
  const map = {
    "image/svg+xml": ".svg",
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/x-icon": ".ico",
    "image/vnd.microsoft.icon": ".ico",
    "image/gif": ".gif",
  };
  const base = (ct || "").split(";")[0].trim().toLowerCase();
  return map[base] ?? fallback;
}

async function findLogoFromWikipedia(title) {
  if (!title) return null;
  try {
    const apiUrl = `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const res = await fetchWithTimeout(apiUrl, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.originalimage?.source ?? data.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

async function downloadFirstWorking(candidates, slug) {
  for (const c of candidates) {
    try {
      const res = await fetchWithTimeout(c.url);
      if (!res.ok) continue;
      const ct = res.headers.get("content-type") ?? "";
      if (!ct.startsWith("image/")) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.byteLength < 200) continue; // skip empty/placeholder
      const urlExt = path.extname(new URL(c.url).pathname).toLowerCase();
      const ext = extFromContentType(ct, urlExt && [".png", ".jpg", ".jpeg", ".svg", ".webp", ".ico", ".gif"].includes(urlExt) ? urlExt : ".png");
      const filename = `${slug}${ext}`;
      const outPath = path.join(OUT_DIR, filename);
      await fs.writeFile(outPath, buf);
      return { filename, source: c.url, size: buf.byteLength, priority: c.priority };
    } catch {}
  }
  return null;
}

let manifestExisting = {};
try {
  manifestExisting = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
} catch {}

const targets = ONLY_MISSING
  ? partners.filter((p) => !manifestExisting[p.slug])
  : partners;

console.log(`Fetching logos for ${targets.length}/${partners.length} partners${ONLY_MISSING ? " (only missing)" : ""}...\n`);

async function tryWikipedia(p) {
  const wikiUrl = await findLogoFromWikipedia(p.wiki);
  if (!wikiUrl) return null;
  return await downloadFirstWorking([{ url: wikiUrl, priority: 0 }], p.slug);
}

const results = await Promise.allSettled(targets.map(async (p) => {
  try {
    const { html, baseUrl } = await fetchHtml(p.domain);
    const candidates = extractIconCandidates(html, baseUrl);
    if (candidates.length > 0) {
      const result = await downloadFirstWorking(candidates, p.slug);
      if (result) return { slug: p.slug, status: "ok", ...result };
    }
    const wiki = await tryWikipedia(p);
    if (wiki) return { slug: p.slug, status: "ok-wiki", ...wiki };
    return { slug: p.slug, status: "all-failed-incl-wiki" };
  } catch {
    const wiki = await tryWikipedia(p);
    if (wiki) return { slug: p.slug, status: "ok-wiki", ...wiki };
    return { slug: p.slug, status: "fetch-failed-no-wiki" };
  }
}));

const manifest = { ...manifestExisting };
let okCount = 0;
let newCount = 0;
for (let i = 0; i < results.length; i++) {
  const r = results[i];
  const p = targets[i];
  if (r.status === "fulfilled") {
    const v = r.value;
    if (v.status === "ok" || v.status === "ok-wiki") {
      manifest[p.slug] = `/logos/${v.filename}`;
      const tag = v.status === "ok-wiki" ? " [wiki]" : "";
      console.log(`  ✓ ${p.slug.padEnd(18)} ${v.filename.padEnd(28)} (${v.size}B)${tag}`);
      newCount++;
    } else {
      console.log(`  ✗ ${p.slug.padEnd(18)} ${v.status}${v.error ? ` — ${v.error}` : ""}`);
    }
  } else {
    console.log(`  ✗ ${p.slug.padEnd(18)} rejected: ${r.reason?.message ?? r.reason}`);
  }
}
okCount = Object.keys(manifest).length;

await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${newCount} new, ${okCount}/${partners.length} total logos saved.`);
console.log(`Manifest written to ${MANIFEST_PATH}`);
