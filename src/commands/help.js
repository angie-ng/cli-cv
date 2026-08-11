/**
 * Help content for the interactive CV terminal.
 * Keep this list aligned with commands registered in index.js.
 */

const BASIC_COMMANDS = [
  ['help', 'Show available commands'],
  ['about [--lang <code>]', 'Show personal introduction'],
  ['skills [--lang <code>]', 'Show main technologies and strengths'],
  ['projects [--lang <code>]', 'Show projects overview'],
  ['experience [--lang <code>]', 'Show work experience'],
  ['education [--lang <code>]', 'Show education overview'],
  ['contact [--lang <code>]', 'Show the contact information'],
  ['links [--lang <code>]', 'Show public profiles and portfolio links'],
]

const ADVANCED_COMMANDS = [
  ['clear', 'Clear terminal output'],
  ['openlink <name>', 'Open a link (e.g. openlink github)'],
  ['pwd', 'Print current virtual directory'],
  ['ls [path] [-a] [-l]', 'List files/directories'],
  ['cat <path> [--lang <code>]', 'Read a file or section'],
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
    'Language:',
    '---------',
    '  Default language is English (en).',
    '  Use --lang cz to switch one command to Czech.',
    '  Planned later: fr, de, it.',
    '\n',
    'Useful examples:',
    '----------------',
    '  ls',
    '  ls -a experience',
    '  ls -l projects',
    '  cat experience/.interesting-fact',
    '  experience --lang cz',
    '  cd projects',
    '  cat dafneapp',
  ]

  return { output: lines, isError: false }
}
