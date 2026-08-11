import { parseArgs } from './shared/parseArgs'

/**
 * pwd: print the current virtual working directory.
 * Example: /
 * Example: /projects
 */
export function pwdCommand(args = [], context = {}) {
  const parsed = parseArgs(args)
  if (parsed.error) {
    return { output: [parsed.error], isError: true }
  }

  // pwd does not take positional arguments or short flags.
  if (parsed.positional.length > 0 || parsed.shortFlags.size > 0) {
    return {
      output: ['Usage: pwd'],
      isError: true,
    }
  }

  const cwd = context.cwd || '/'
  return {
    output: [cwd],
    isError: false,
  }
}
