// here is what the openlink command can open, you can add more links here
// those are basically the arguments that the openlink command can take, and the corresponding URLs
const LINK_MAP = {
  github: 'https://github.com/angie-ng',
  linkedin: 'https://www.linkedin.com/in/angelika-viktorinova/',
  portfolio: 'https://github.com/angie-ng',
}

export function openLinkCommand(args = []) {
  if (args.length !== 1) {
    return {
      output: ['Usage: open <github|linkedin|portfolio>'],
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