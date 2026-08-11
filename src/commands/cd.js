import { parseArgs } from './shared/parseArgs'
import {
  HOME_PATH,
  OUT_OF_SCOPE_MESSAGE,
  getNodeAtPath,
  isWithinHome,
  resolvePath,
} from './shared/vfs'

/**
 * cd: change the current virtual directory.
 * Stays inside /home/reader (reader jail).
 */
export function cdCommand(args = [], context = {}) {
  const parsed = parseArgs(args)
  if (parsed.error) {
    return { output: [parsed.error], isError: true }
  }

  if (parsed.shortFlags.size > 0) {
    return {
      output: ['cd does not support short flags. Try: cd <path>'],
      isError: true,
    }
  }

  if (parsed.positional.length > 1) {
    return {
      output: ['Usage: cd [path]'],
      isError: true,
    }
  }

  const cwd = context.cwd || HOME_PATH
  // No argument => go home (like many shells with just `cd`).
  const targetPath = resolvePath(cwd, parsed.positional[0] || HOME_PATH)

  if (!isWithinHome(targetPath)) {
    return {
      output: [OUT_OF_SCOPE_MESSAGE],
      isError: true,
    }
  }

  const node = getNodeAtPath(targetPath, parsed.lang)

  if (!node) {
    return {
      output: [`cd: no such file or directory: ${targetPath}`],
      isError: true,
    }
  }

  if (node.type !== 'dir') {
    return {
      output: [`cd: not a directory: ${targetPath}`],
      isError: true,
    }
  }

  if (typeof context.setCwd === 'function') {
    context.setCwd(targetPath)
  }

  return {
    output: [],
    isError: false,
  }
}
