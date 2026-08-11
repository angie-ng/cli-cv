import { DEFAULT_LANGUAGE, getLocalizedContent } from './lang'
import {
  formatAbout,
  formatContact,
  formatEducation,
  formatEducationEntry,
  formatExperience,
  formatExperienceEntry,
  formatHiddenFile,
  formatLinks,
  formatProjectEntry,
  formatProjects,
  formatSkills,
} from './formatters'

/**
 * Virtual filesystem (VFS) for the interactive CV.
 *
 * Mental model:
 * - "/" is the home directory
 * - Simple sections are files: about, skills, contact, links
 * - Multi-entry sections are directories: experience, projects, education
 * - Dot-prefixed names are hidden files (shown only by `ls -a`)
 *
 * Important UX rule:
 * We never expose an "index" filename to users.
 * Typing `cat experience` reads the whole section content directly.
 */

function createFile(name, getContent, summary = '') {
  return {
    type: 'file',
    name,
    // True when the file name starts with a dot (Unix-like hidden file).
    hidden: name.startsWith('.'),
    summary,
    getContent,
  }
}

function createDir(name, children = {}) {
  return {
    type: 'dir',
    name,
    hidden: name.startsWith('.'),
    children,
  }
}

/**
 * Build the VFS tree for a selected language.
 * Rebuild is cheap here, so each command call can request a fresh tree.
 */
export function buildVfs(lang = DEFAULT_LANGUAGE) {
  const content = getLocalizedContent(lang)

  const experienceChildren = {}
  ;(content.experience || []).forEach((item) => {
    experienceChildren[item.id] = createFile(
      item.id,
      () => formatExperienceEntry(item.id, lang),
      `${item.role} @ ${item.company}`,
    )
  })
  experienceChildren['.interesting-fact'] = createFile(
    '.interesting-fact',
    () => formatHiddenFile('experience', '.interesting-fact', lang),
    'Hidden experience note',
  )

  const projectChildren = {}
  ;(content.projects || []).forEach((item) => {
    projectChildren[item.id] = createFile(
      item.id,
      () => formatProjectEntry(item.id, lang),
      item.name,
    )
  })
  projectChildren['.interesting-fact'] = createFile(
    '.interesting-fact',
    () => formatHiddenFile('projects', '.interesting-fact', lang),
    'Hidden project note',
  )

  const educationChildren = {}
  ;(content.education || []).forEach((item) => {
    educationChildren[item.id] = createFile(
      item.id,
      () => formatEducationEntry(item.id, lang),
      item.institution,
    )
  })
  educationChildren['.interesting-fact'] = createFile(
    '.interesting-fact',
    () => formatHiddenFile('education', '.interesting-fact', lang),
    'Hidden education note',
  )

  // Directory nodes also expose getContent so `cat experience` works
  // without forcing users to know any internal file name.
  const experienceDir = createDir('experience', experienceChildren)
  experienceDir.getContent = () => formatExperience(lang)
  experienceDir.summary = 'Work experience directory'

  const projectsDir = createDir('projects', projectChildren)
  projectsDir.getContent = () => formatProjects(lang)
  projectsDir.summary = 'Projects directory'

  const educationDir = createDir('education', educationChildren)
  educationDir.getContent = () => formatEducation(lang)
  educationDir.summary = 'Education directory'

  return createDir('/', {
    about: createFile('about', () => formatAbout(lang), 'Personal introduction'),
    skills: createFile('skills', () => formatSkills(lang), 'Technologies and strengths'),
    contact: createFile('contact', () => formatContact(lang), 'Contact information'),
    links: createFile('links', () => formatLinks(lang), 'Public profile links'),
    experience: experienceDir,
    projects: projectsDir,
    education: educationDir,
  })
}

/**
 * Normalize path input into a clean absolute path like "/projects/dafneapp".
 * Supports:
 * - absolute paths: "/education"
 * - relative paths: "dafneapp" (resolved from cwd)
 * - "." and ".."
 */
export function resolvePath(cwd = '/', inputPath = '.') {
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
 * By default, hidden (dot) files are excluded unless includeHidden=true.
 */
export function listDir(node, { includeHidden = false } = {}) {
  if (!node || node.type !== 'dir') return []

  return Object.values(node.children || {})
    .filter((child) => includeHidden || !child.hidden)
    .sort((a, b) => a.name.localeCompare(b.name))
}
