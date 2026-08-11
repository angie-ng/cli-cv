import cv from '../../data/cv.json'
import { DEFAULT_LANGUAGE, getLocalizedContent } from './lang'

/**
 * Shared content formatters.
 * Direct commands (about, experience, ...) and `cat` both use these helpers,
 * so output stays consistent no matter how the user asks for the data.
 */

function trimTrailingSpacer(lines) {
  if (lines[lines.length - 1] === '\u00A0') {
    lines.pop()
  }
  return lines
}

export function formatAbout(lang = DEFAULT_LANGUAGE) {
  const { name, title, focus, summary } = getLocalizedContent(lang).profile || {}

  return [
    'About',
    '-----',
    `${name} — ${title}`,
    `Focus: ${focus}`,
    '\u00A0',
    summary,
  ]
}

export function formatSkills(lang = DEFAULT_LANGUAGE) {
  const lines = ['Skills', '------']

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
  const lines = ['Technologies', '------------']
  ;(skills.technologies || []).forEach((tech) => lines.push(tech))
  return lines
}

export function formatSkillsTools(lang = DEFAULT_LANGUAGE) {
  const skills = getLocalizedContent(lang).skills || {}
  const lines = ['Tools', '-----']
  ;(skills.tools || []).forEach((tool) => lines.push(tool))
  return lines
}

export function formatSkillsLanguages(lang = DEFAULT_LANGUAGE) {
  const skills = getLocalizedContent(lang).skills || {}
  const lines = ['Languages', '---------']
  Object.entries(skills.languages || {}).forEach(([code, level]) => {
    lines.push(`${code.toUpperCase()}: ${level}`)
  })
  return lines
}

export function formatSkillsSoftSkills(lang = DEFAULT_LANGUAGE) {
  const skills = getLocalizedContent(lang).skills || {}
  const lines = ['Soft skills', '-----------']
  ;(skills.soft_skills || []).forEach((skill) => lines.push(skill))
  return lines
}

export function formatContact(lang = DEFAULT_LANGUAGE) {
  const { email, linkedin, github } = getLocalizedContent(lang).contact || {}

  return [
    'Contact',
    '-------',
    `Email:    ${email}`,
    `LinkedIn: ${linkedin}`,
    `GitHub:   ${github}`,
  ]
}

export function formatLinks(lang = DEFAULT_LANGUAGE) {
  const { github, linkedin } = getLocalizedContent(lang).contact || {}

  return [
    'Links',
    '-----',
    `GitHub:   ${github}`,
    `LinkedIn: ${linkedin}`,
  ]
}

export function formatExperience(lang = DEFAULT_LANGUAGE) {
  const experience = getLocalizedContent(lang).experience || []
  const lines = ['Experience', '----------']

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

  const lines = [
    `${item.role} @ ${item.company}`,
    `Period: ${item.period}`,
    '\u00A0',
  ]

  ;(item.responsibilities || []).forEach((resp) => {
    lines.push(`  • ${resp}`)
  })

  return lines
}

export function formatProjects(lang = DEFAULT_LANGUAGE) {
  const projects = getLocalizedContent(lang).projects || []
  const lines = ['Projects', '--------']

  projects.forEach((project) => {
    lines.push(project.name)

    if (project.type) {
      lines.push(`Type: ${project.type}`)
    }

    if (project.description) {
      lines.push('Description:')
      project.description.forEach((desc) => lines.push(`  • ${desc}`))
    }

    if (project.stack) {
      lines.push('Technology stack:')
      project.stack.forEach((tech) => lines.push(`  • ${tech}`))
    }

    if (project.focus) {
      lines.push('Focus:')
      project.focus.forEach((item) => lines.push(`  • ${item}`))
    }

    if (project.method) {
      lines.push(`Method: ${project.method}`)
    }

    if (project.repository) {
      lines.push(`Link: ${project.repository}`)
    }

    lines.push('\u00A0')
  })

  return trimTrailingSpacer(lines)
}

export function formatProjectEntry(entryId, lang = DEFAULT_LANGUAGE) {
  const projects = getLocalizedContent(lang).projects || []
  const project = projects.find((entry) => entry.id === entryId)
  if (!project) return null

  // Same visual structure as the full projects overview, but for one item only.
  const lines = [project.name]

  if (project.type) {
    lines.push(`Type: ${project.type}`)
  }

  if (project.description) {
    lines.push('Description:')
    project.description.forEach((desc) => lines.push(`  • ${desc}`))
  }

  if (project.stack) {
    lines.push('Technology stack:')
    project.stack.forEach((tech) => lines.push(`  • ${tech}`))
  }

  if (project.focus) {
    lines.push('Focus:')
    project.focus.forEach((item) => lines.push(`  • ${item}`))
  }

  if (project.method) {
    lines.push(`Method: ${project.method}`)
  }

  if (project.repository) {
    lines.push(`Link: ${project.repository}`)
  }

  return lines
}

export function formatEducation(lang = DEFAULT_LANGUAGE) {
  const education = getLocalizedContent(lang).education || []
  const lines = ['Education', '---------']

  education.forEach((item) => {
    lines.push(`${item.institution.padEnd(36)} ${item.period}`)
  })

  return lines
}

export function formatEducationEntry(entryId, lang = DEFAULT_LANGUAGE) {
  const education = getLocalizedContent(lang).education || []
  const item = education.find((entry) => entry.id === entryId)
  if (!item) return null

  return [
    item.institution,
    `Period: ${item.period}`,
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
