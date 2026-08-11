import { parseArgs } from './shared/parseArgs'
import { getNodeAtPath, listDir, resolvePath } from './shared/vfs'

/**
 * ls: list files/directories in the virtual filesystem.
 *
 * Supported flags:
 * -a  show hidden files (names starting with ".")
 * -l  long listing (type + name + short summary)
 *
 * Examples:
 *   ls
 *   ls experience
 *   ls -a
 *   ls -l projects
 *   ls -al
 */
export function lsCommand(args = [], context = {}) {
  const parsed = parseArgs(args)
  if (parsed.error) {
    return { output: [parsed.error], isError: true }
  }

  // Reject unknown short flags early (only -a and -l are valid for ls).
  for (const flag of parsed.shortFlags) {
    if (flag !== 'a' && flag !== 'l') {
      return {
        output: [`Unknown flag: -${flag}. Supported: -a, -l`],
        isError: true,
      }
    }
  }

  if (parsed.positional.length > 1) {
    return {
      output: ['Usage: ls [path] [-a] [-l]'],
      isError: true,
    }
  }

  const cwd = context.cwd || '/'
  const targetPath = resolvePath(cwd, parsed.positional[0] || '.')
  const node = getNodeAtPath(targetPath, parsed.lang)

  if (!node) {
    return {
      output: [`ls: no such file or directory: ${targetPath}`],
      isError: true,
    }
  }

  // If the target is a file, just print its name (like real ls).
  if (node.type === 'file') {
    return {
      output: [node.name],
      isError: false,
    }
  }

  const includeHidden = parsed.shortFlags.has('a')
  const longFormat = parsed.shortFlags.has('l')
  const children = listDir(node, { includeHidden })

  if (children.length === 0) {
    return { output: [], isError: false }
  }

  if (!longFormat) {
    // Compact mode: print one name per line for readability in the web terminal.
    return {
      output: children.map((child) => child.name),
      isError: false,
    }
  }

  // Long mode: type + name + short description.
  const lines = children.map((child) => {
    const typeLabel = child.type === 'dir' ? 'dir ' : 'file'
    const summary = child.summary || ''
    return `${typeLabel.padEnd(5)} ${child.name.padEnd(28)} ${summary}`.trimEnd()
  })

  return { output: lines, isError: false }
}
