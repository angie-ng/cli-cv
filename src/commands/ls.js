import { parseArgs } from './shared/parseArgs'
import {
  FS_GROUP,
  FS_MTIME,
  FS_OWNER,
  HOME_PATH,
  OUT_OF_SCOPE_MESSAGE,
  getNodeAtPath,
  isWithinHome,
  listDir,
  resolvePath,
} from './shared/vfs'

/**
 * Format names in columns, similar to real `ls` (down, then across).
 */
function formatColumns(names, width = 80) {
  if (names.length === 0) return []

  const colWidth = Math.max(...names.map((name) => name.length)) + 2
  const cols = Math.max(1, Math.floor(width / colWidth))
  const rows = Math.ceil(names.length / cols)
  const lines = []

  for (let row = 0; row < rows; row += 1) {
    const cells = []
    for (let col = 0; col < cols; col += 1) {
      // Column-major order (like classic ls): fill down each column first.
      const index = col * rows + row
      if (index < names.length) {
        const isLastCell = col === cols - 1 || col * rows + row + rows >= names.length
        const value = names[index]
        cells.push(isLastCell ? value : value.padEnd(colWidth))
      }
    }
    lines.push(cells.join('').trimEnd())
  }

  return lines
}

/**
 * Build one shell-like long listing row.
 * Permissions are hardcoded as read-only to reinforce the "reader" role.
 */
function formatLongEntry(child) {
  const mode = child.type === 'dir' ? 'dr--r--r--' : '-r--r--r--'
  const links = '1'
  const size = String(child.size ?? (child.type === 'dir' ? 4096 : 256)).padStart(4)
  return `${mode} ${links} ${FS_OWNER.padEnd(8)} ${FS_GROUP.padEnd(6)} ${size} ${FS_MTIME} ${child.name}`
}

/**
 * ls: list files/directories in the virtual filesystem.
 *
 * Flags:
 * -a  show hidden files (names starting with ".")
 * -l  long listing (permissions / owner / group / size / date / name)
 */
export function lsCommand(args = [], context = {}) {
  const parsed = parseArgs(args)
  if (parsed.error) {
    return { output: [parsed.error], isError: true }
  }

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

  const cwd = context.cwd || HOME_PATH
  const targetPath = resolvePath(cwd, parsed.positional[0] || '.')

  if (!isWithinHome(targetPath)) {
    return {
      output: [OUT_OF_SCOPE_MESSAGE],
      isError: true,
    }
  }

  const node = getNodeAtPath(targetPath, parsed.lang)

  if (!node) {
    return {
      output: [`ls: no such file or directory: ${targetPath}`],
      isError: true,
    }
  }

  if (node.type === 'file') {
    if (parsed.shortFlags.has('l')) {
      return { output: [formatLongEntry(node)], isError: false }
    }
    return { output: [node.name], isError: false }
  }

  const includeHidden = parsed.shortFlags.has('a')
  const longFormat = parsed.shortFlags.has('l')
  const children = listDir(node, { includeHidden })

  if (children.length === 0) {
    return { output: [], isError: false }
  }

  if (longFormat) {
    return {
      output: children.map((child) => formatLongEntry(child)),
      isError: false,
    }
  }

  return {
    output: formatColumns(children.map((child) => child.name)),
    isError: false,
  }
}
