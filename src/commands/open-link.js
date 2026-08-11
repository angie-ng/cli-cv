import { getLocalizedContent } from './shared/lang'

/**
 * openlink: open a known profile URL in a new browser tab.
 * Link names are derived from the contact section in cv.json.
 */
export function openLinkCommand(args = []) {
  if (args.length !== 1) {
    return {
      output: ['Usage: openlink <github|linkedin>'],
      isError: true,
    }
  }

  // Contact URLs are language-independent; English pack is enough.
  const contact = getLocalizedContent('en').contact || {}
  const LINK_MAP = {
    github: contact.github,
    linkedin: contact.linkedin,
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
