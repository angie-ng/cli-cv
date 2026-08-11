import { formatContact } from './shared/formatters'
import { parseArgs } from './shared/parseArgs'

export function contactCommand(args = []) {
  const parsed = parseArgs(args)
  if (parsed.error) {
    return { output: [parsed.error], isError: true }
  }

  if (parsed.positional.length > 0 || parsed.shortFlags.size > 0) {
    return {
      output: ['Usage: contact [--lang <code>]'],
      isError: true,
    }
  }

  return {
    output: formatContact(parsed.lang),
    isError: false,
  }
}
