import { formatLinks } from './shared/formatters'
import { parseArgs } from './shared/parseArgs'

export function linksCommand(args = []) {
  const parsed = parseArgs(args)
  if (parsed.error) {
    return { output: [parsed.error], isError: true }
  }

  if (parsed.positional.length > 0 || parsed.shortFlags.size > 0) {
    return {
      output: ['Usage: links [--lang <code>]'],
      isError: true,
    }
  }

  return {
    output: formatLinks(parsed.lang),
    isError: false,
  }
}
