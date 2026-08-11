import { DEFAULT_LANGUAGE, resolveLanguage } from './lang'

/**
 * Parse raw CLI args into:
 * - positional: normal path/name arguments
 * - shortFlags: set of short flags like "a", "l"
 * - lang: selected language (defaults to English)
 * - error: human-readable parse error (if any)
 *
 * Supported patterns:
 * - --lang cz
 * - -a -l
 * - -al / -la (combined short flags)
 */
export function parseArgs(args = []) {
  const positional = []
  const shortFlags = new Set()
  let lang = DEFAULT_LANGUAGE

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i]

    // Long flag: --lang <code>
    if (token === '--lang') {
      const value = args[i + 1]
      if (!value || value.startsWith('-')) {
        return {
          positional,
          shortFlags,
          lang,
          error: 'Usage: --lang <code> (example: --lang cz)',
        }
      }

      const resolved = resolveLanguage(value)
      if (resolved.error) {
        return { positional, shortFlags, lang, error: resolved.error }
      }

      lang = resolved.lang
      i += 1
      continue
    }

    // Unknown long flag
    if (token.startsWith('--')) {
      return {
        positional,
        shortFlags,
        lang,
        error: `Unknown flag: ${token}`,
      }
    }

    // Short flags: -a, -l, -al, -la
    if (token.startsWith('-') && token.length > 1) {
      const letters = token.slice(1).split('')
      for (const letter of letters) {
        if (!/[a-z]/i.test(letter)) {
          return {
            positional,
            shortFlags,
            lang,
            error: `Unknown flag: -${letter}`,
          }
        }
        shortFlags.add(letter.toLowerCase())
      }
      continue
    }

    // Everything else is a positional argument (usually a path).
    positional.push(token)
  }

  return { positional, shortFlags, lang, error: null }
}
