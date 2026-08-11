import { parseArgs } from './shared/parseArgs'
import { getNodeAtPath, resolvePath } from './shared/vfs'

/**
 * cd: change the current virtual directory.
 *
 * Supported targets:
 * - cd /            go to home
 * - cd ..           go one level up
 * - cd projects     go into a section directory
 * - cd /education   absolute path
 *
 * Without arguments, cd goes home ("/").
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

  const cwd = context.cwd || '/'
  const targetPath = resolvePath(cwd, parsed.positional[0] || '/')
  const node = getNodeAtPath(targetPath, parsed.lang)

  if (!node) {
    return {
      output: [`cd: no such file or directory: ${targetPath}`],
      isError: true,
    }
  }

  // Only directories are valid cd targets.
  if (node.type !== 'dir') {
    return {
      output: [`cd: not a directory: ${targetPath}`],
      isError: true,
    }
  }

  // Update session cwd through the context provided by App.jsx.
  if (typeof context.setCwd === 'function') {
    context.setCwd(targetPath)
  }

  // Silent success, like a real shell.
  return {
    output: [],
    isError: false,
  }
}
