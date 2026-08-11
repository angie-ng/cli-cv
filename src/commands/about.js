import { formatAbout } from './shared/formatters'
import { parseArgs } from './shared/parseArgs'

export function aboutCommand(args = []) {
  const parsed = parseArgs(args)
  if (parsed.error) {
    return { output: [parsed.error], isError: true }
  }

  // Direct content commands only accept the optional --lang flag.
  if (parsed.positional.length > 0 || parsed.shortFlags.size > 0) {
    return {
      output: ['Usage: about [--lang <code>]'],
      isError: true,
    }
  }

  return {
    output: formatAbout(parsed.lang),
    isError: false,
  }
}
