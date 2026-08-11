/**
 * Help content for the interactive CV terminal.
 * Keep this list aligned with commands registered in index.js.
 *
 * Basic commands stay simple for any visitor.
 * Language flags and navigation details stay in Advanced (geek mode).
 */

const BASIC_COMMANDS = [
  ['help', 'Show available commands'],
  ['about', 'Show personal introduction'],
  ['skills', 'Show main technologies and strengths'],
  ['projects', 'Show projects overview'],
  ['experience', 'Show work experience'],
  ['education', 'Show education overview'],
  ['contact', 'Show the contact information'],
  ['links', 'Show public profiles and portfolio links'],
]

const ADVANCED_COMMANDS = [
  ['clear', 'Clear terminal output'],
  ['openlink [name|url]', 'Open a link (e.g. openlink linkedin)'],
  ['pwd', 'Print current virtual directory'],
  ['ls [path] [-a] [-l]', 'List files/directories'],
  ['cat <path> [--lang <code>]', 'Read a file or section (e.g. cat about --lang cz)'],
  ['cd [path]', 'Change virtual directory'],
]

export function helpCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['help does not take arguments. Try: help'],
      isError: true,
    }
  }

  const lines = [
    'Basic commands (clear and easy overview):',
    '----------------------------------------',
    ...BASIC_COMMANDS.map(([name, desc]) => `  ${name.padEnd(28)} ${desc}`),
    '\n',
    'Advanced commands for geeks:',
    '----------------------------',
    ...ADVANCED_COMMANDS.map(([name, desc]) => `  ${name.padEnd(28)} ${desc}`),
    '\n',
    'Language (advanced):',
    '--------------------',
    '  Default language is English (en).',
    '  Use --lang cz on content commands (e.g. cat about --lang cz).',
    '  Planned later: fr, de, it.',
  ]

  return { output: lines, isError: false }
}
