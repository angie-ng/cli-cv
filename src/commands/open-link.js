import { getLocalizedContent } from './shared/lang'

const URL_PATTERN = /^https?:\/\//i

/**
 * Build name -> URL map for openlink.
 * Contact profiles + project ids that have a repository URL.
 */
function buildLinkMap() {
  const content = getLocalizedContent('en')
  const contact = content.contact || {}
  const map = {}

  if (contact.github) map.github = contact.github
  if (contact.linkedin) map.linkedin = contact.linkedin

  ;(content.projects || []).forEach((project) => {
    if (project.id && project.repository) {
      map[project.id] = project.repository
    }
  })

  return map
}

/**
 * openlink: open a known profile/project URL or a raw http(s) URL.
 * No args => list available names (geek discoverability).
 */
export function openLinkCommand(args = []) {
  const linkMap = buildLinkMap()
  const names = Object.keys(linkMap).sort()

  if (args.length === 0) {
    return {
      output: [
        'Available links:',
        ...names.map((name) => `  ${name}`),
        '\u00A0',
        'Usage: openlink <name|url>',
        'Tip: you can also pass a full http(s) URL.',
      ],
      isError: false,
    }
  }

  if (args.length !== 1) {
    return {
      output: ['Usage: openlink <name|url>'],
      isError: true,
    }
  }

  const key = args[0]
  const lowerKey = key.toLowerCase()

  let url
  let label

  if (URL_PATTERN.test(key)) {
    url = key
    label = key
  } else if (linkMap[lowerKey]) {
    url = linkMap[lowerKey]
    label = lowerKey
  } else {
    return {
      output: [
        `Unknown link: ${key}`,
        `Try: openlink (no args) to list names, or pass an http(s) URL.`,
      ],
      isError: true,
    }
  }

  window.open(url, '_blank', 'noopener,noreferrer')

  return {
    output: [`Opened ${label}: ${url}`],
    isError: false,
  }
}
