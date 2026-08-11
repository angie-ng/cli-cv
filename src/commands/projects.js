import { formatProjects } from './shared/formatters'
import { parseArgs } from './shared/parseArgs'

export function projectsCommand(args = []) {
  const parsed = parseArgs(args)
  if (parsed.error) {
    return { output: [parsed.error], isError: true }
  }

  if (parsed.positional.length > 0 || parsed.shortFlags.size > 0) {
    return {
      output: ['Usage: projects [--lang <code>]'],
      isError: true,
    }
  }

  return {
    output: formatProjects(parsed.lang),
    isError: false,
  }
}
