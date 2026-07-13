import cv from '../data/cv.json'

export function experienceCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['experience does not take arguments. Try: experience'],
      isError: true,
    }
  }

  const lines = ['Experience', '----------']

  cv.experience.forEach((item) => {
    lines.push(`${item.role.padEnd(26)} ${item.company.padEnd(26)} ${item.period}`)
  
    item.responsibilities.forEach((resp) => {
      lines.push(`  • ${resp}`)
    })
      lines.push('\u00A0') // non-braking space to create an empty line between experiences
    })
    
  if (lines[lines.length - 1] === '\u00A0') {
    lines.pop() // removes the last extra empty line
  }

  return { output: lines, isError: false }
}
