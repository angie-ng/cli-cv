import cv from '../../data/cv.json'
import { DEFAULT_LANGUAGE, getLocalizedContent } from './lang'

/**
 * Shared content formatters.
 * Direct commands (about, experience, ...) and `cat` both use these helpers,
 * so output stays consistent no matter how the user asks for the data.
 */

const UI_FALLBACK = {
  about: 'About',
  focus: 'Focus',
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
  type: 'Type',
  description: 'Description',
  stack: 'Technology stack',
  method: 'Method',
  link: 'Link',
  education: 'Education',
}

function getUi(lang) {
  return { ...UI_FALLBACK, ...(getLocalizedContent(lang).ui || {}) }
}

function sectionHeading(title) {
  return [title, '-'.repeat(title.length)]
}

function trimTrailingSpacer(lines) {
  if (lines[lines.length - 1] === '\u00A0') {
    lines.pop()
  }
  return lines
}

function formatProjectFields(project, ui) {
  const lines = []

  if (project.type) {
    lines.push(`${ui.type}: ${project.type}`)
  }

  if (project.description) {
    lines.push(`${ui.description}:`)
    project.description.forEach((desc) => lines.push(`  • ${desc}`))
  }

  if (project.stack) {
    lines.push(`${ui.stack}:`)
    project.stack.forEach((tech) => lines.push(`  • ${tech}`))
  }

  if (project.focus) {
    lines.push(`${ui.focus}:`)
    project.focus.forEach((item) => lines.push(`  • ${item}`))
  }

  if (project.method) {
    lines.push(`${ui.method}: ${project.method}`)
  }

  if (project.repository) {
    lines.push(`${ui.link}: ${project.repository}`)
  }

  return lines
}

export function formatAbout(lang = DEFAULT_LANGUAGE) {
  const { name, title, focus, summary } = getLocalizedContent(lang).profile || {}
  const ui = getUi(lang)

  return [
    ...sectionHeading(ui.about),
    `${name} — ${title}`,
    `${ui.focus}: ${focus}`,
    '\u00A0',
    summary,
  ]
}

export function formatSkills(lang = DEFAULT_LANGUAGE) {
  const ui = getUi(lang)
  const lines = [...sectionHeading(ui.skills)]

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
  const lines = [...sectionHeading(ui.technologies)]
  ;(skills.technologies || []).forEach((tech) => lines.push(tech))
  return lines
}

export function formatSkillsTools(lang = DEFAULT_LANGUAGE) {
  const skills = getLocalizedContent(lang).skills || {}
  const ui = getUi(lang)
  const lines = [...sectionHeading(ui.tools)]
  ;(skills.tools || []).forEach((tool) => lines.push(tool))
  return lines
}

export function formatSkillsLanguages(lang = DEFAULT_LANGUAGE) {
  const skills = getLocalizedContent(lang).skills || {}
  const ui = getUi(lang)
  const lines = [...sectionHeading(ui.languages)]
  Object.entries(skills.languages || {}).forEach(([code, level]) => {
    lines.push(`${code.toUpperCase()}: ${level}`)
  })
  return lines
}

export function formatSkillsSoftSkills(lang = DEFAULT_LANGUAGE) {
  const skills = getLocalizedContent(lang).skills || {}
  const ui = getUi(lang)
  const lines = [...sectionHeading(ui.softSkills)]
  ;(skills.soft_skills || []).forEach((skill) => lines.push(skill))
  return lines
}

export function formatContact(lang = DEFAULT_LANGUAGE) {
  const { email, linkedin, github } = getLocalizedContent(lang).contact || {}
  const ui = getUi(lang)

  return [
    ...sectionHeading(ui.contact),
    `${ui.email}: ${email}`,
    `${ui.linkedin}: ${linkedin}`,
    `${ui.github}: ${github}`,
  ]
}

export function formatLinks(lang = DEFAULT_LANGUAGE) {
  const { github, linkedin } = getLocalizedContent(lang).contact || {}
  const ui = getUi(lang)

  return [
    ...sectionHeading(ui.links),
    `${ui.github}: ${github}`,
    `${ui.linkedin}: ${linkedin}`,
  ]
}

export function formatExperience(lang = DEFAULT_LANGUAGE) {
  const experience = getLocalizedContent(lang).experience || []
  const ui = getUi(lang)
  const lines = [...sectionHeading(ui.experience)]

  experience.forEach((item) => {
    lines.push(`${item.role.padEnd(26)} ${item.company.padEnd(26)} ${item.period}`)
    ;(item.responsibilities || []).forEach((resp) => {
      lines.push(`  • ${resp}`)
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
    `${item.role} @ ${item.company}`,
    `${ui.period}: ${item.period}`,
    '\u00A0',
  ]

  ;(item.responsibilities || []).forEach((resp) => {
    lines.push(`  • ${resp}`)
  })

  return lines
}

export function formatProjects(lang = DEFAULT_LANGUAGE) {
  const projects = getLocalizedContent(lang).projects || []
  const ui = getUi(lang)
  const lines = [...sectionHeading(ui.projects)]

  projects.forEach((project) => {
    lines.push(project.name)
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
  return [project.name, ...formatProjectFields(project, ui)]
}

export function formatEducation(lang = DEFAULT_LANGUAGE) {
  const education = getLocalizedContent(lang).education || []
  const ui = getUi(lang)
  const lines = [...sectionHeading(ui.education)]

  education.forEach((item) => {
    lines.push(`${item.institution.padEnd(36)} ${item.period}`)
  })

  return lines
}

export function formatEducationEntry(entryId, lang = DEFAULT_LANGUAGE) {
  const education = getLocalizedContent(lang).education || []
  const item = education.find((entry) => entry.id === entryId)
  if (!item) return null

  const ui = getUi(lang)
  return [
    item.institution,
    `${ui.period}: ${item.period}`,
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
