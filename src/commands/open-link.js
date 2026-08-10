import cv from '../data/cv.json'

// the openlink command opens one of the known links in a new browser tab
// the available link names are derived from cv.json (contact section)
const LINK_MAP = {
  github: cv.contact.github,
  linkedin: cv.contact.linkedin,
}

export function openLinkCommand(args = []) {
  if (args.length !== 1) {
    return {
      output: ['Usage: openlink <github|linkedin>'],
      isError: true,
    }
  }

  const key = args[0].toLowerCase()
  const url = LINK_MAP[key]

  if (!url) {
    return {
      output: [`Unknown link: ${key}`],
      isError: true,
    }
  }

  window.open(url, '_blank', 'noopener,noreferrer')

  return {
    output: [`Opened ${key}: ${url}`],
    isError: false,
  }
}
