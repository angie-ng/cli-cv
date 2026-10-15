import cv from '../../data/cv.json'
import { DEFAULT_LANGUAGE, getLocalizedContent } from './lang'

/**
 * Shared content formatters.
 * Direct commands (about, experience, ...) and `cat` both use these helpers,
 * so output stays consistent no matter how the user asks for the data.
 */

const UI_FALLBACK = {
  about: 'About',
  skills: 'Skills',
  technologies: 'Technologies',
  tools: 'Tools',
  languages: 'Languages',
  softSkills: 'Soft skills',
  contact: 'Contact',
  email: 'Email',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  links: 'Links',
  experience: 'Experience',
  period: 'Period',
  projects: 'Projects',
  stack: 'Technology stack',
  link: 'Link',
  education: 'Education',
}

function getUi(lang) {
  return { ...UI_FALLBACK, ...(getLocalizedContent(lang).ui || {}) }
}

const LANG_TO_LOCALE = { cz: 'cs', en: 'en', fr: 'fr', de: 'de', it: 'it' }

function sectionHeading(title, lang = DEFAULT_LANGUAGE) {
  const locale = LANG_TO_LOCALE[lang] || lang
  const heading = title.toLocaleUpperCase(locale)
  return [
    { text: heading, kind: 'title' },
    { text: '-'.repeat(heading.length), kind: 'title' },
  ]
}

function subHeading(title) {
  return { text: title, kind: 'role' }
}

function labeled(label, value) {
  return `${label}: ${value}`
}

function labelOnly(label) {
  return `${label}:`
}

function bullet(text) {
  return { text: `• ${text}`, kind: 'bullet' }
}

function trimTrailingSpacer(lines) {
  if (lines[lines.length - 1] === '\u00A0') {
    lines.pop()
  }
  return lines
}

function formatProjectFields(project, ui) {
  const lines = []

  if (project.category) {
    lines.push(project.category)
  }

  if (project.highlights) {
    project.highlights.forEach((item) => lines.push(bullet(item)))
  }

  if (project.stack) {
    lines.push(labelOnly(ui.stack))
    project.stack.forEach((tech) => lines.push(bullet(tech)))
  }

  if (project.link) {
    lines.push(labeled(ui.link, project.link))
  }

  return lines
}

export function formatAbout(lang = DEFAULT_LANGUAGE) {
  const { name, headline, summary } = getLocalizedContent(lang).profile || {}
  const ui = getUi(lang)

  return [
    ...sectionHeading(ui.about, lang),
    { text: name, kind: 'role' },
    headline ? { text: headline, kind: 'title' } : null,
    '\u00A0',
    summary,
  ].filter(Boolean)
}

export function formatSkills(lang = DEFAULT_LANGUAGE) {
  const ui = getUi(lang)
  const lines = [...sectionHeading(ui.skills, lang)]

  lines.push(...formatSkillsTechnologies(lang))
  lines.push('\u00A0')
  lines.push(...formatSkillsTools(lang))
  lines.push('\u00A0')
  lines.push(...formatSkillsLanguages(lang))
  lines.push('\u00A0')
  lines.push(...formatSkillsSoftSkills(lang))

  return lines
}

/** One skills category as a standalone file for the skills/ directory. */
export function formatSkillsTechnologies(lang = DEFAULT_LANGUAGE) {
  const skills = getLocalizedContent(lang).skills || {}
  const ui = getUi(lang)
  const lines = [subHeading(ui.technologies)]
  ;(skills.technologies || []).forEach((tech) => lines.push(tech))
  return lines
}

export function formatSkillsTools(lang = DEFAULT_LANGUAGE) {
  const skills = getLocalizedContent(lang).skills || {}
  const ui = getUi(lang)
  const lines = [subHeading(ui.tools)]
  ;(skills.tools || []).forEach((tool) => lines.push(tool))
  return lines
}

export function formatSkillsLanguages(lang = DEFAULT_LANGUAGE) {
  const skills = getLocalizedContent(lang).skills || {}
  const ui = getUi(lang)
  const lines = [subHeading(ui.languages)]
  Object.entries(skills.languages || {}).forEach(([code, level]) => {
    lines.push(`${code.toUpperCase()}: ${level}`)
  })
  return lines
}

export function formatSkillsSoftSkills(lang = DEFAULT_LANGUAGE) {
  const skills = getLocalizedContent(lang).skills || {}
  const ui = getUi(lang)
  const lines = [subHeading(ui.softSkills)]
  ;(skills.soft_skills || []).forEach((skill) => lines.push(skill))
  return lines
}

export function formatContact(lang = DEFAULT_LANGUAGE) {
  const { email, linkedin, github } = getLocalizedContent(lang).contact || {}
  const ui = getUi(lang)

  return [
    ...sectionHeading(ui.contact, lang),
    labeled(ui.email, email),
    labeled(ui.linkedin, linkedin),
    labeled(ui.github, github),
  ]
}

export function formatLinks(lang = DEFAULT_LANGUAGE) {
  const { github, linkedin } = getLocalizedContent(lang).contact || {}
  const ui = getUi(lang)

  return [
    ...sectionHeading(ui.links, lang),
    labeled(ui.github, github),
    labeled(ui.linkedin, linkedin),
  ]
}

export function formatExperience(lang = DEFAULT_LANGUAGE) {
  const experience = getLocalizedContent(lang).experience || []
  const ui = getUi(lang)
  const lines = [...sectionHeading(ui.experience, lang)]

  experience.forEach((item) => {
    lines.push({
      text: `${item.role.padEnd(26)} ${item.company.padEnd(26)} ${item.period}`,
      kind: 'role',
    })
    ;(item.responsibilities || []).forEach((resp) => {
      lines.push(bullet(resp))
    })
    lines.push('\u00A0')
  })

  return trimTrailingSpacer(lines)
}

export function formatExperienceEntry(entryId, lang = DEFAULT_LANGUAGE) {
  const experience = getLocalizedContent(lang).experience || []
  const item = experience.find((entry) => entry.id === entryId)
  if (!item) return null

  const ui = getUi(lang)
  const lines = [
    { text: `${item.role} @ ${item.company}`, kind: 'role' },
    labeled(ui.period, item.period),
    '\u00A0',
  ]

  ;(item.responsibilities || []).forEach((resp) => {
    lines.push(bullet(resp))
  })

  return lines
}

export function formatProjects(lang = DEFAULT_LANGUAGE) {
  const projects = getLocalizedContent(lang).projects || []
  const ui = getUi(lang)
  const lines = [...sectionHeading(ui.projects, lang)]

  projects.forEach((project) => {
    lines.push({ text: project.name, kind: 'role' })
    lines.push(...formatProjectFields(project, ui))
    lines.push('\u00A0')
  })

  return trimTrailingSpacer(lines)
}

export function formatProjectEntry(entryId, lang = DEFAULT_LANGUAGE) {
  const projects = getLocalizedContent(lang).projects || []
  const project = projects.find((entry) => entry.id === entryId)
  if (!project) return null

  const ui = getUi(lang)
  return [{ text: project.name, kind: 'role' }, ...formatProjectFields(project, ui)]
}

export function formatEducation(lang = DEFAULT_LANGUAGE) {
  const education = getLocalizedContent(lang).education || []
  const ui = getUi(lang)
  const lines = [...sectionHeading(ui.education, lang)]

  education.forEach((item) => {
    lines.push({
      text: `${item.institution.padEnd(36)} ${item.period}`,
      kind: 'role',
    })
  })

  return lines
}

export function formatEducationEntry(entryId, lang = DEFAULT_LANGUAGE) {
  const education = getLocalizedContent(lang).education || []
  const item = education.find((entry) => entry.id === entryId)
  if (!item) return null

  const ui = getUi(lang)
  return [
    { text: item.institution, kind: 'role' },
    labeled(ui.period, item.period),
  ]
}

/**
 * Read a hidden (dot) file for a section.
 * Hidden content is stored under cv.hidden and can be language-specific.
 */
export function formatHiddenFile(section, fileName, lang = DEFAULT_LANGUAGE) {
  const hidden = cv.hidden?.[section]?.[fileName]
  if (!hidden) return null

  // Prefer selected language, then fall back to English.
  return hidden[lang] || hidden[DEFAULT_LANGUAGE] || null
}
