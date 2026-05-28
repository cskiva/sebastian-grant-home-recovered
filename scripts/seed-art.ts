import 'dotenv/config'

import fs from 'node:fs'
import matter from 'gray-matter'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { toKebabCase } from '../src/utilities/toKebabCase'

type Frontmatter = {
  title?: string
  date?: string
  cover?: string
  slug?: string
  category?: string
  tags?: string[]
  description?: string
}

type LexicalTextNode = {
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  type: 'text'
  version: 1
}

type LexicalElementNode = {
  children: LexicalTextNode[]
  direction: null
  format: ''
  indent: number
  type: 'paragraph' | 'heading'
  version: 1
  tag?: 'h1' | 'h2' | 'h3' | 'h4'
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const root = path.resolve(dirname, '..')
const contentDir = path.join(root, 'content')
const publicDir = path.join(root, 'public')

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const forceMedia = args.includes('--force-media')
const skipMedia = args.includes('--skip-media')
const onlySlugIndex = args.indexOf('--slug')
const onlySlug = onlySlugIndex >= 0 ? args[onlySlugIndex + 1] : null

const textNode = (text: string): LexicalTextNode => ({
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  type: 'text',
  version: 1,
})

const elementNode = (
  type: 'paragraph' | 'heading',
  text: string,
  tag?: LexicalElementNode['tag'],
): LexicalElementNode => ({
  children: [textNode(text)],
  direction: null,
  format: '',
  indent: 0,
  type,
  version: 1,
  ...(tag ? { tag } : {}),
})

const markdownToLexical = (markdown: string) => {
  const normalized = markdown
    .replace(/\r\n/g, '\n')
    .replace(/\\\s*\n/g, '\n\n')
    .trim()

  const children = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block): LexicalElementNode => {
      const heading = block.match(/^(#{1,6})\s+(.+)$/s)

      if (heading) {
        const level = Math.min(heading[1].length, 4)
        return elementNode(
          'heading',
          heading[2].replace(/\n+/g, ' ').trim(),
          `h${level}` as LexicalElementNode['tag'],
        )
      }

      return elementNode('paragraph', block.replace(/\n+/g, ' ').trim())
    })

  return {
    root: {
      type: 'root',
      children: children.length ? children : [elementNode('paragraph', '')],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

const stripMarkdown = (markdown: string) =>
  markdown
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`]/g, '')
    .replace(/\\\s*\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const excerptFromMarkdown = (markdown: string) =>
  stripMarkdown(markdown).split(' ').slice(0, 30).join(' ')

const dateToISOString = (date?: string) => {
  if (!date) return new Date().toISOString()

  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString()
}

const normalizeTags = (tags: unknown) => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean)
  return [String(tags).trim()].filter(Boolean)
}

const resolveCoverPath = (cover?: string) => {
  if (!cover || /^(https?|ftp|file):\/\//i.test(cover)) return null

  const relativeToPublic = cover.replace(/^(\.\.\/)+/, '')
  const filePath = path.join(publicDir, relativeToPublic)

  return fs.existsSync(filePath) ? filePath : null
}

const getMarkdownFiles = (dir: string): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) return getMarkdownFiles(fullPath)
    if (entry.isFile() && /\.mdx?$/i.test(entry.name)) return [fullPath]
    return []
  })
}

const payload = await getPayload({ config })
const categoryCache = new Map<string, string>()
const mediaCache = new Map<string, string>()

const getOrCreateCategory = async (title?: string) => {
  const normalizedTitle = title?.trim()
  if (!normalizedTitle) return null

  const slug = toKebabCase(normalizedTitle)
  const cached = categoryCache.get(slug)
  if (cached) return cached

  const existing = await payload.find({
    collection: 'categories',
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  if (existing.docs[0]) {
    const id = existing.docs[0].id
    categoryCache.set(slug, id)
    return id
  }

  if (dryRun) {
    categoryCache.set(slug, slug)
    return slug
  }

  const created = await payload.create({
    collection: 'categories',
    data: {
      title: normalizedTitle,
      slug,
    },
  })

  categoryCache.set(slug, created.id)
  return created.id
}

const getOrCreateMedia = async (filePath: string | null, alt: string) => {
  if (!filePath || skipMedia) return null

  const filename = path.basename(filePath)
  const cached = mediaCache.get(filename)
  if (cached) return cached

  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    pagination: false,
    where: { filename: { equals: filename } },
  })

  if (existing.docs[0]) {
    if (!dryRun) {
      await payload.update({
        collection: 'media',
        data: { alt },
        filePath: forceMedia ? filePath : undefined,
        id: existing.docs[0].id,
        overwriteExistingFiles: forceMedia,
      })
    }
    mediaCache.set(filename, existing.docs[0].id)
    return existing.docs[0].id
  }

  if (dryRun) {
    mediaCache.set(filename, filename)
    return filename
  }

  const created = await payload.create({
    collection: 'media',
    data: { alt },
    filePath,
  })

  mediaCache.set(filename, created.id)
  return created.id
}

const seedFile = async (filePath: string) => {
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const frontmatter = data as Frontmatter
  const title = frontmatter.title?.trim() || path.basename(filePath, path.extname(filePath))
  const slug = toKebabCase(frontmatter.slug || title)

  if (onlySlug && slug !== toKebabCase(onlySlug)) return 'skipped' as const

  const categoryID = await getOrCreateCategory(frontmatter.category)
  const mediaID = await getOrCreateMedia(resolveCoverPath(frontmatter.cover), title)
  const tags = normalizeTags(frontmatter.tags)
  const publishedAt = dateToISOString(frontmatter.date)
  const description = frontmatter.description || excerptFromMarkdown(content)

  const postData = {
    title,
    slug,
    generateSlug: false,
    heroImage: mediaID,
    content: markdownToLexical(content),
    categories: categoryID ? [categoryID] : [],
    tags: tags.map((tag) => ({ tag })),
    zoomifySlug: slug,
    publishedAt,
    meta: {
      title,
      description,
      image: mediaID,
    },
    _status: 'published',
  }

  const existing = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  if (dryRun) {
    console.log(`[dry-run] ${existing.docs[0] ? 'update' : 'create'} ${slug}`)
    return 'seeded' as const
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'posts',
      context: { disableRevalidate: true },
      id: existing.docs[0].id,
      data: postData as never,
      draft: false,
    })
    console.log(`updated ${slug}`)
    return 'seeded' as const
  }

  await payload.create({
    collection: 'posts',
    context: { disableRevalidate: true },
    data: postData as never,
    draft: false,
  })
  console.log(`created ${slug}`)
  return 'seeded' as const
}

const files = getMarkdownFiles(contentDir)
let seeded = 0
let skipped = 0

for (const file of files) {
  const result = await seedFile(file)
  if (result === 'seeded') seeded += 1
  if (result === 'skipped') skipped += 1
}

console.log(`Done. ${seeded} artwork posts ${dryRun ? 'checked' : 'seeded'}, ${skipped} skipped.`)
process.exit(0)
