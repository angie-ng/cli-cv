// values for the help command, which is used to show the available commands and their descriptions
// add new commands here to make them show up in the help output
// the idea is to have just a few basic commands for the user to get an overview of the CV (sufficient for HR), and then some more advanced commands for those who want to explore more
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

// those are basically commands requiring arguments or some knowledge of the command, so it is just for fun for tech people
const ADVANCED_COMMANDS = [
  ['clear', 'Clear terminal output'],
  ['openlink <name>', 'Open a link (e.g. openlink github, openlink linkedin)'],
]

export function helpCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['help does not take arguments. Try: help'],
      isError: true,
    }
  }

  // This is what and how is written to the terminal when the user types "help"
  const lines = [
    'Basic commands (clear and easy overview):',
    '----------------------------------------',
    ...BASIC_COMMANDS.map(([name, desc]) => `  ${name.padEnd(12)} ${desc}`),    // padEnd is used to align the columns - higher number = more space between command and description
    '\n',
    'Advanced commands for geeks:',
    '----------------------------',
    ...ADVANCED_COMMANDS.map(([name, desc]) => `  ${name.padEnd(16)} ${desc}`),
    '\n',
    '  (More advanced commands coming soon: ls, cat, cd, pwd)',
  ]

  return { output: lines, isError: false }
}