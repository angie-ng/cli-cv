import { formatExperience } from './shared/formatters'
import { parseArgs } from './shared/parseArgs'

export function experienceCommand(args = []) {
  const parsed = parseArgs(args)
  if (parsed.error) {
    return { output: [parsed.error], isError: true }
  }

  if (parsed.positional.length > 0 || parsed.shortFlags.size > 0) {
    return {
      output: ['Usage: experience [--lang <code>]'],
      isError: true,
    }
  }

  return {
    output: formatExperience(parsed.lang),
    isError: false,
  }
}
