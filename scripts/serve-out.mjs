// Serves the static export in out/ under /EGCSite, the way GitHub Pages does: a directory
// answers with its index.html, a missing path with 404.html. Used by the Playwright tests.
// Usage: node scripts/serve-out.mjs [port]   (default 4173)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'out');
const BASE = '/EGCSite';
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

async function resolveFile(urlPath) {
  const relative = decodeURIComponent(urlPath.slice(BASE.length)).replace(/^\/+/, '');
  const file = path.join(ROOT, relative);
  if (!file.startsWith(ROOT)) return null;
  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      // GitHub Pages redirects /dir to /dir/ before serving its index.
      if (!urlPath.endsWith('/')) return { redirect: `${urlPath}/` };
      return { file: path.join(file, 'index.html') };
    }
    return { file };
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const { pathname, search } = new URL(req.url ?? '/', 'http://localhost');
  if (pathname === BASE) {
    res.writeHead(301, { Location: `${BASE}/${search}` }).end();
    return;
  }
  const found = pathname.startsWith(`${BASE}/`) ? await resolveFile(pathname) : null;
  if (found?.redirect) {
    res.writeHead(301, { Location: found.redirect + search }).end();
    return;
  }
  try {
    if (!found) throw new Error('not found');
    const body = await readFile(found.file);
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(found.file)] ?? 'application/octet-stream' }).end(body);
  } catch {
    const body = await readFile(path.join(ROOT, '404.html')).catch(() => 'Not found');
    res.writeHead(404, { 'Content-Type': TYPES['.html'] }).end(body);
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Serving out/ at http://127.0.0.1:${PORT}${BASE}/`);
});
