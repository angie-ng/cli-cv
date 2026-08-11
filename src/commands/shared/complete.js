import { HOME_PATH, getPathCompletions } from './vfs'

/**
 * Decide what Tab should complete for the current input line.
 *
 * Rules:
 * 1) If the user is still typing the command name -> complete command names.
 * 2) For ls / cd / cat, complete path arguments (last non-flag token).
 * 3) Only auto-fill when there is exactly one match (same conservative style
 *    as the original command-name completion).
 */
export function completeInputLine(currentInput, commandNames, cwd = HOME_PATH) {
  const trimmedRight = currentInput.replace(/\s+$/u, '')
  const endsWithSpace = /\s$/u.test(currentInput)
  const tokens = trimmedRight.length === 0 ? [] : trimmedRight.split(/\s+/)

  // Case A: completing the command name itself.
  if (tokens.length === 0 || (tokens.length === 1 && !endsWithSpace)) {
    const prefix = tokens[0] || ''
    const matches = commandNames.filter((name) => name.startsWith(prefix))
    if (prefix && matches.length === 1) {
      return matches[0]
    }
    return null
  }

  const commandName = tokens[0].toLowerCase()
  if (!['ls', 'cd', 'cat'].includes(commandName)) {
    return null
  }

  // Collect non-flag tokens after the command. The last one is the path prefix.
  const argTokens = tokens.slice(1).filter((token) => !token.startsWith('-'))
  const pathPrefix = endsWithSpace ? '' : (argTokens[argTokens.length - 1] || '')

  const matches = getPathCompletions(pathPrefix, cwd, {
    dirsOnly: commandName === 'cd',
  })

  if (matches.length !== 1) {
    return null
  }

  // Rebuild the line, replacing only the path token being completed.
  const completedPath = matches[0]
  if (endsWithSpace || argTokens.length === 0) {
    return `${trimmedRight} ${completedPath}`
  }

  const lastPathIndex = (() => {
    for (let i = tokens.length - 1; i >= 1; i -= 1) {
      if (!tokens[i].startsWith('-')) return i
    }
    return -1
  })()

  if (lastPathIndex === -1) {
    return `${trimmedRight} ${completedPath}`
  }

  const nextTokens = [...tokens]
  nextTokens[lastPathIndex] = completedPath
  return nextTokens.join(' ')
}
