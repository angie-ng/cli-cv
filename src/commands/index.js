import { helpCommand } from './help'
import { clearCommand } from './clear'
import { aboutCommand } from './about'
import { skillsCommand } from './skills'
import { projectsCommand } from './projects'
import { experienceCommand } from './experience'
import { educationCommand } from './education'
import { contactCommand } from './contact'
import { linksCommand } from './links'
import { openLinkCommand } from './open-link'
import { pwdCommand } from './pwd'
import { lsCommand } from './ls'
import { catCommand } from './cat'
import { cdCommand } from './cd'
import { rmCommand } from './rm'

/**
 * Command registry.
 * Keys are the exact command names users type in the terminal.
 */
const COMMANDS = {
  help: helpCommand,
  clear: clearCommand,
  about: aboutCommand,
  skills: skillsCommand,
  projects: projectsCommand,
  experience: experienceCommand,
  education: educationCommand,
  contact: contactCommand,
  links: linksCommand,
  openlink: openLinkCommand,
  // Advanced virtual-navigation commands
  pwd: pwdCommand,
  ls: lsCommand,
  cat: catCommand,
  cd: cdCommand,
  rm: rmCommand,
  rmdir: rmCommand,
}

export const COMMAND_NAMES = Object.keys(COMMANDS)

/**
 * Execute one command line.
 * context can include:
 * - cwd: current virtual directory
 * - setCwd: function used by `cd` to update cwd in App state
 */
export function executeCommand(rawInput, context = {}) {
  const trimmed = rawInput.trim()
  if (!trimmed) return null

  const [name, ...args] = trimmed.split(/\s+/)
  const commandName = name.toLowerCase()
  const handler = COMMANDS[commandName]

  if (!handler) {
    return {
      output: [`command not found: ${commandName}`],
      isError: true,
    }
  }

  // Pass both args and session context so navigation commands can work.
  return handler(args, context)
}
