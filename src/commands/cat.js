import { parseArgs } from './shared/parseArgs'
import {
  HOME_PATH,
  OUT_OF_SCOPE_MESSAGE,
  getNodeAtPath,
  isWithinHome,
  resolvePath,
} from './shared/vfs'

/**
 * cat: print the content of a virtual file (or section directory).
 * Paths outside /home/reader are blocked (reader jail).
 */
export function catCommand(args = [], context = {}) {
  const parsed = parseArgs(args)
  if (parsed.error) {
    return { output: [parsed.error], isError: true }
  }

  if (parsed.shortFlags.size > 0) {
    return {
      output: ['cat does not support short flags. Try: cat <path> [--lang <code>]'],
      isError: true,
    }
  }

  if (parsed.positional.length !== 1) {
    return {
      output: ['Usage: cat <path> [--lang <code>]'],
      isError: true,
    }
  }

  const cwd = context.cwd || HOME_PATH
  const targetPath = resolvePath(cwd, parsed.positional[0])

  if (!isWithinHome(targetPath)) {
    return {
      output: [OUT_OF_SCOPE_MESSAGE],
      isError: true,
    }
  }

  const node = getNodeAtPath(targetPath, parsed.lang)

  if (!node) {
    return {
      output: [`cat: no such file or directory: ${targetPath}`],
      isError: true,
    }
  }

  if (typeof node.getContent !== 'function') {
    return {
      output: [`cat: ${targetPath}: is a directory`],
      isError: true,
    }
  }

  const output = node.getContent(parsed.lang)
  if (!output) {
    return {
      output: [`cat: ${targetPath}: empty or unavailable`],
      isError: true,
    }
  }

  return { output, isError: false }
}
