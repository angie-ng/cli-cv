import cv from '../../data/cv.json'

// Default language when the user does not pass --lang.
export const DEFAULT_LANGUAGE = cv.meta?.defaultLanguage || 'en'

// Languages that already have content in cv.json.
export const SUPPORTED_LANGUAGES = cv.meta?.supportedLanguages || ['en']

// Languages we plan to add later (kept here so future expansion is obvious).
// Planned order from the product roadmap: fr -> de -> it.
export const PLANNED_LANGUAGES = cv.meta?.plannedLanguages || ['fr', 'de', 'it']

/**
 * Normalize and validate a language code.
 * Returns { lang } on success, or { error } with a terminal-friendly message.
 */
export function resolveLanguage(rawLang) {
  const lang = (rawLang || DEFAULT_LANGUAGE).toLowerCase()

  if (SUPPORTED_LANGUAGES.includes(lang)) {
    return { lang }
  }

  if (PLANNED_LANGUAGES.includes(lang)) {
    return {
      error: `Language "${lang}" is planned but not available yet. Supported now: ${SUPPORTED_LANGUAGES.join(', ')}`,
    }
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
