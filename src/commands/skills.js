import { formatSkills } from './shared/formatters'
import { parseArgs } from './shared/parseArgs'

export function skillsCommand(args = []) {
  const parsed = parseArgs(args)
  if (parsed.error) {
    return { output: [parsed.error], isError: true }
  }

  if (parsed.positional.length > 0 || parsed.shortFlags.size > 0) {
    return {
      output: ['Usage: skills [--lang <code>]'],
      isError: true,
    }
  }

  return {
    output: formatSkills(parsed.lang),
    isError: false,
  }
}
