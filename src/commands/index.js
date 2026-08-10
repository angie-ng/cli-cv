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
}

export const COMMAND_NAMES = Object.keys(COMMANDS)

export function executeCommand(rawInput) {
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

  return handler(args)
}