import cv from '../../data/cv.json'

// Default language when the user does not pass --lang.
export const DEFAULT_LANGUAGE = cv.meta?.defaultLanguage || 'en'

// Languages that already have content in cv.json.
export const SUPPORTED_LANGUAGES = cv.meta?.supportedLanguages || ['en']

/**
 * Normalize and validate a language code.
 * Returns { lang } on success, or { error } with a terminal-friendly message.
 */
export function resolveLanguage(rawLang) {
  const lang = (rawLang || DEFAULT_LANGUAGE).toLowerCase()

  if (SUPPORTED_LANGUAGES.includes(lang)) {
    return { lang }
  }

  return {
    error: `Unsupported language: ${lang}. Supported now: ${SUPPORTED_LANGUAGES.join(', ')}`,
  }
}

/**
 * Return localized CV content for the selected language.
 * Falls back to English if a language pack is missing (safety net).
 */
export function getLocalizedContent(lang = DEFAULT_LANGUAGE) {
  return cv.content?.[lang] || cv.content?.[DEFAULT_LANGUAGE] || {}
}
