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
    ...BASIC_COMMANDS.map(([name, desc]) => `  ${name.padEnd(12)} ${desc}`),
    '',
    'Advanced commands for geeks:',
    '----------------------------',
    ...ADVANCED_COMMANDS.map(([name, desc]) => `  ${name.padEnd(12)} ${desc}`),
    '  open <name>   Open a link (e.g. open github)',
    '  (More advanced commands coming soon: ls, cat, cd, pwd)',
  ]

  return { output: lines, isError: false }
}