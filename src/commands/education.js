import { formatEducation } from './shared/formatters'
import { parseArgs } from './shared/parseArgs'

export function educationCommand(args = []) {
  const parsed = parseArgs(args)
  if (parsed.error) {
    return { output: [parsed.error], isError: true }
  }

  if (parsed.positional.length > 0 || parsed.shortFlags.size > 0) {
    return {
      output: ['Usage: education [--lang <code>]'],
      isError: true,
    }
  }

  return {
    output: formatEducation(parsed.lang),
    isError: false,
  }
}
