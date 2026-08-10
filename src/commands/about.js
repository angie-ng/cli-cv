import cv from '../data/cv.json'

export function aboutCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['about does not take arguments. Try: about'],
      isError: true,
    }
  }

  const { name, title, focus, summary } = cv.profile

  return {
    output: [
      'About',
      '-----',
      `${name} — ${title}`,
      `Focus: ${focus}`,
      '\u00A0',
      summary,
    ],
    isError: false,
  }
}
