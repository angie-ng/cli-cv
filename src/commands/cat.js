import { parseArgs } from './shared/parseArgs'
import { getNodeAtPath, resolvePath } from './shared/vfs'

/**
 * cat: print the content of a virtual file (or section directory).
 *
 * Examples:
 *   cat about
 *   cat experience
 *   cat /projects/dafneapp
 *   cat experience/.interesting-fact --lang cz
 *
 * Notes:
 * - Works for both visible and hidden (dot) files.
 * - For section directories (experience/projects/education), cat prints
 *   the full section overview. Users never need an "index" file name.
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

  const cwd = context.cwd || '/'
  const targetPath = resolvePath(cwd, parsed.positional[0])
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
