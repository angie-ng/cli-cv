import { DEFAULT_LANGUAGE, getLocalizedContent } from './lang'
import {
  formatAbout,
  formatContact,
  formatEducation,
  formatExperience,
  formatExperienceEntry,
  formatHiddenFile,
  formatLinks,
  formatProjectEntry,
  formatProjects,
  formatSkills,
  formatSkillsLanguages,
  formatSkillsSoftSkills,
  formatSkillsTechnologies,
  formatSkillsTools,
} from './formatters'

/**
 * Virtual filesystem (VFS) for the interactive CV.
 *
 * Layout:
 *   /                       system root
 *   /home/reader/           default home (read-only viewer)
 *     about, contact, links, education   (files)
 *     skills/, experience/, projects/    (directories)
 *
 * Dot-prefixed names are hidden (shown only by `ls -a`).
 * Section directories can be `cat`-ed to show a full overview
 * without exposing any internal "index" filename.
 */

/** Default starting directory for the terminal session. */
export const HOME_PATH = '/home/reader'

/**
 * Shown when the reader tries to leave their home jail
 * (e.g. /, /home, /home/david, ../.. from ~).
 */
export const OUT_OF_SCOPE_MESSAGE =
  "Nice try. That path is out of scope with 'reader' privileges. Stay in your directory, please, and don't try to hack me :D"

/** Fake ownership shown by `ls -l`. */
export const FS_OWNER = 'angelika'
export const FS_GROUP = 'reader'

/**
 * True only for /home/reader and paths under it.
 * Used as a soft jail for cd / ls / cat / Tab completion.
 */
export function isWithinHome(absPath) {
  return absPath === HOME_PATH || absPath.startsWith(`${HOME_PATH}/`)
}

/**
 * Fixed timestamp for listings.
 * Kept constant on purpose so the CV does not look "stale" as real dates pass.
 */
export const FS_MTIME = 'Aug 12 12:00'

function createFile(name, getContent, summary = '', size = 256) {
  return {
    type: 'file',
    name,
    hidden: name.startsWith('.'),
    summary,
    size,
    getContent,
  }
}

function createDir(name, children = {}, summary = '', size = 4096) {
  return {
    type: 'dir',
    name,
    hidden: name.startsWith('.'),
    summary,
    size,
    children,
  }
}

/**
 * Build the VFS tree for a selected language.
 * Rebuild is cheap here, so each command call can request a fresh tree.
 */
export function buildVfs(lang = DEFAULT_LANGUAGE) {
  const content = getLocalizedContent(lang)

  // --- experience/ ---
  const experienceChildren = {}
  ;(content.experience || []).forEach((item) => {
    experienceChildren[item.id] = createFile(
      item.id,
      () => formatExperienceEntry(item.id, lang),
      `${item.role} @ ${item.company}`,
      512,
    )
  })
  experienceChildren['.interesting-fact'] = createFile(
    '.interesting-fact',
    () => formatHiddenFile('experience', '.interesting-fact', lang),
    'Hidden experience note',
    128,
  )

  const experienceDir = createDir(
    'experience',
    experienceChildren,
    'Work experience directory',
  )
  experienceDir.getContent = () => formatExperience(lang)

  // --- projects/ ---
  const projectChildren = {}
  ;(content.projects || []).forEach((item) => {
    projectChildren[item.id] = createFile(
      item.id,
      () => formatProjectEntry(item.id, lang),
      item.name,
      512,
    )
  })
  projectChildren['.interesting-fact'] = createFile(
    '.interesting-fact',
    () => formatHiddenFile('projects', '.interesting-fact', lang),
    'Hidden project note',
    128,
  )

  const projectsDir = createDir('projects', projectChildren, 'Projects directory')
  projectsDir.getContent = () => formatProjects(lang)

  // --- skills/ (directory with category files) ---
  const skillsChildren = {
    technologies: createFile(
      'technologies',
      () => formatSkillsTechnologies(lang),
      'Technology list',
      256,
    ),
    tools: createFile(
      'tools',
      () => formatSkillsTools(lang),
      'Tools list',
      128,
    ),
    languages: createFile(
      'languages',
      () => formatSkillsLanguages(lang),
      'Spoken languages',
      128,
    ),
    soft_skills: createFile(
      'soft_skills',
      () => formatSkillsSoftSkills(lang),
      'Soft skills list',
      128,
    ),
    '.interesting-fact': createFile(
      '.interesting-fact',
      () => formatHiddenFile('skills', '.interesting-fact', lang),
      'Hidden skills note',
      128,
    ),
  }

  const skillsDir = createDir('skills', skillsChildren, 'Skills directory')
  skillsDir.getContent = () => formatSkills(lang)

  // Reader home contains the CV content visitors explore.
  const readerHome = createDir('reader', {
    about: createFile('about', () => formatAbout(lang), 'Personal introduction', 512),
    contact: createFile('contact', () => formatContact(lang), 'Contact information', 256),
    links: createFile('links', () => formatLinks(lang), 'Public profile links', 256),
    // education is intentionally a single file (small section).
    education: createFile('education', () => formatEducation(lang), 'Education overview', 256),
    skills: skillsDir,
    experience: experienceDir,
    projects: projectsDir,
  }, 'Reader home (read-only CV workspace)')

  const homeDir = createDir('home', {
    reader: readerHome,
  }, 'Home directories')

  return createDir('/', {
    home: homeDir,
  }, 'Filesystem root')
}

/**
 * Normalize path input into a clean absolute path.
 * Supports absolute paths, relative paths, "." and "..".
 */
export function resolvePath(cwd = HOME_PATH, inputPath = '.') {
  const base = inputPath.startsWith('/') ? [] : cwd.split('/').filter(Boolean)
  const parts = inputPath.split('/').filter((part) => part.length > 0)

  for (const part of parts) {
    if (part === '.') continue
    if (part === '..') {
      base.pop()
      continue
    }
    base.push(part)
  }

  return `/${base.join('/')}`
}

/**
 * Find a VFS node by absolute path.
 * Returns null when the path does not exist.
 */
export function getNodeAtPath(absPath, lang = DEFAULT_LANGUAGE) {
  const root = buildVfs(lang)
  if (absPath === '/') return root

  const parts = absPath.split('/').filter(Boolean)
  let current = root

  for (const part of parts) {
    if (current.type !== 'dir' || !current.children?.[part]) {
      return null
    }
    current = current.children[part]
  }

  return current
}

/**
 * List children of a directory node.
 * Hidden (dot) files are excluded unless includeHidden=true.
 */
export function listDir(node, { includeHidden = false } = {}) {
  if (!node || node.type !== 'dir') return []

  return Object.values(node.children || {})
    .filter((child) => includeHidden || !child.hidden)
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Build path completion candidates for Tab.
 * - Completes the last path segment under the resolved parent directory.
 * - dirsOnly=true is used by `cd` (directories only).
 */
export function getPathCompletions(pathPrefix, cwd = HOME_PATH, { dirsOnly = false, lang = DEFAULT_LANGUAGE } = {}) {
  const endsWithSlash = pathPrefix.endsWith('/')
  const absPrefix = resolvePath(cwd, pathPrefix || '.')

  let parentPath
  let partial

  if (endsWithSlash || pathPrefix === '') {
    parentPath = pathPrefix === '' ? cwd : absPrefix
    partial = ''
  } else {
    const slashIndex = pathPrefix.lastIndexOf('/')
    if (slashIndex === -1) {
      parentPath = cwd
      partial = pathPrefix
    } else {
      const parentInput = pathPrefix.slice(0, slashIndex + 1)
      parentPath = resolvePath(cwd, parentInput || '/')
      partial = pathPrefix.slice(slashIndex + 1)
    }
  }

  if (!isWithinHome(parentPath)) {
    return []
  }

  const parentNode = getNodeAtPath(parentPath, lang)
  if (!parentNode || parentNode.type !== 'dir') {
    return []
  }

  // For completion we include hidden names when the user already typed ".".
  const includeHidden = partial.startsWith('.')
  const children = listDir(parentNode, { includeHidden: true })
    .filter((child) => includeHidden || !child.hidden)
    .filter((child) => !dirsOnly || child.type === 'dir')
    .filter((child) => child.name.startsWith(partial))

  const parentPrefix = endsWithSlash
    ? pathPrefix
    : pathPrefix.slice(0, pathPrefix.length - partial.length)

  return children.map((child) => {
    const completed = `${parentPrefix}${child.name}`
    return child.type === 'dir' ? `${completed}/` : completed
  })
}
