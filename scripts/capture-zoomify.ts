#!/usr/bin/env tsx
/**
 * Captures zoomed-out screenshots of each Zoomify artwork using Playwright
 * and saves them as high-res WebP images via Sharp.
 *
 * First-time setup on VM:
 *   pnpm dlx playwright install chromium --with-deps
 *
 * Usage:
 *   pnpm capture-zoomify                      # capture all missing previews
 *   pnpm capture-zoomify --force              # recapture everything
 *   pnpm capture-zoomify --slug solopoly      # single artwork
 *   pnpm capture-zoomify --watch              # run then recheck every hour
 */

import { chromium } from 'playwright'
import sharp from 'sharp'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import http from 'node:http'
import matter from 'gray-matter'
import _ from 'lodash'

const ROOT = path.resolve(process.cwd())
const CONTENT_DIR = path.join(ROOT, 'content')
const PUBLIC_DIR = path.join(ROOT, 'public')
const OUTPUT_DIR = path.join(PUBLIC_DIR, 'art-previews')
const PORT = 9877
const VIEWPORT = { width: 1600, height: 1000 }
const TILE_WAIT_MS = 6_000          // time for CDN tiles to paint after canvas appears
const WATCH_INTERVAL_MS = 60 * 60 * 1000

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
}

function startServer(): Promise<http.Server> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0])
      const filePath = path.normalize(path.join(PUBLIC_DIR, urlPath === '/' ? 'index.html' : urlPath))

      // Prevent path traversal
      if (!filePath.startsWith(PUBLIC_DIR + path.sep) && filePath !== PUBLIC_DIR) {
        res.writeHead(403); res.end(); return
      }

      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        res.writeHead(404); res.end(); return
      }

      const ext = path.extname(filePath)
      res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' })
      fs.createReadStream(filePath).pipe(res)
    })

    server.listen(PORT, '127.0.0.1', () => resolve(server))
    server.on('error', reject)
  })
}

function readSlugs(): string[] {
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md'))
    .flatMap(file => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8')
      const { data } = matter(raw)
      return data.slug ? [String(data.slug)] : []
    })
}

async function captureSlug(
  browser: import('playwright').Browser,
  slug: string,
): Promise<'ok' | 'error'> {
  const zoomifyKey = _.camelCase(slug)
  const url = `http://127.0.0.1:${PORT}/static.html?zoomify=${encodeURIComponent(zoomifyKey)}`
  const out = path.join(OUTPUT_DIR, `${slug}.webp`)

  console.log(`  → ${slug} (key: ${zoomifyKey})`)

  const ctx = await browser.newContext({ viewport: VIEWPORT })
  const page = await ctx.newPage()

  // Force the container to fill the viewport before Zoomify measures it
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const s = document.createElement('style')
      s.textContent =
        'html,body{margin:0;padding:0;width:100vw;height:100vh;overflow:hidden;background:#121212}' +
        '#viewport,main{width:100%;height:100%;margin:0;padding:0}' +
        '#myZoomifyContainer{width:100%;height:100%}'
      document.head.appendChild(s)
    })
  })

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    await page.waitForSelector('#myZoomifyContainer canvas', { timeout: 20_000 })
    // Let CDN tiles download and paint
    await page.waitForTimeout(TILE_WAIT_MS)

    const el = await page.$('#myZoomifyContainer')
    const png = el
      ? await el.screenshot({ type: 'png' })
      : await page.screenshot({ type: 'png' })

    await sharp(png)
      .resize(2400, 2400, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(out)

    console.log(`  ✓ ${slug}.webp`)
    return 'ok'
  } catch (err) {
    console.error(`  ✗ ${slug}: ${(err as Error).message}`)
    return 'error'
  } finally {
    await ctx.close()
  }
}

async function run(opts: { slugs?: string[]; force: boolean }): Promise<void> {
  await fsp.mkdir(OUTPUT_DIR, { recursive: true })

  const all = opts.slugs ?? readSlugs()
  const pending = opts.force
    ? all
    : all.filter(s => !fs.existsSync(path.join(OUTPUT_DIR, `${s}.webp`)))

  if (pending.length === 0) {
    console.log('All previews up to date.')
    return
  }

  console.log(`Capturing ${pending.length} artwork(s)...`)

  const server = await startServer()
  const browser = await chromium.launch({ headless: true })
  let ok = 0, fail = 0

  try {
    for (const slug of pending) {
      const result = await captureSlug(browser, slug)
      if (result === 'ok') ok++; else fail++
    }
  } finally {
    await browser.close()
    server.close()
  }

  console.log(`Done: ${ok} captured, ${fail} failed.`)
}

async function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const watch = args.includes('--watch')
  const slugIdx = args.indexOf('--slug')
  const slugs = slugIdx >= 0 ? [args[slugIdx + 1]] : undefined

  await run({ slugs, force })

  if (watch) {
    const mins = WATCH_INTERVAL_MS / 60_000
    console.log(`\nWatch mode — rechecking every ${mins} min. Ctrl+C to stop.`)
    const loop = async (): Promise<void> => {
      await new Promise(r => setTimeout(r, WATCH_INTERVAL_MS))
      await run({ force: false })
      return loop()
    }
    loop().catch(console.error)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
