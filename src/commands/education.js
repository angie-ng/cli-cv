import cv from '../data/cv.json'

export function educationCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['education does not take arguments. Try: education'],
      isError: true,
    }
  }

  const lines = ['Education', '---------']

  cv.education.forEach((item) => {
    lines.push(`${item.institution.padEnd(36)} ${item.period}`)
  })

  return { output: lines, isError: false }
}
