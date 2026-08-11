import { HOME_PATH } from './shared/vfs'
import { parseArgs } from './shared/parseArgs'

/**
 * pwd: print the current virtual working directory.
 */
export function pwdCommand(args = [], context = {}) {
  const parsed = parseArgs(args)
  if (parsed.error) {
    return { output: [parsed.error], isError: true }
  }

  if (parsed.positional.length > 0 || parsed.shortFlags.size > 0) {
    return {
      output: ['Usage: pwd'],
      isError: true,
    }
  }

  return {
    output: [context.cwd || HOME_PATH],
    isError: false,
  }
}
