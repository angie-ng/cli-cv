import cv from '../data/cv.json'

export function skillsCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['skills does not take arguments. Try: skills'],
      isError: true,
    }
  }

  const lines = ['Skills', '-----']

  lines.push('Technologies:')
    cv.skills.technologies.forEach((tech) => {
      lines.push(`${tech}`)
  })
  lines.push('\u00A0')

  lines.push('Tools:')
    cv.skills.tools.forEach((tool) => {
      lines.push(`${tool}`)
  })
  lines.push('\u00A0')
  
  lines.push('Languages:')
    Object.entries(cv.skills.languages).forEach(([lang, level]) => {
      lines.push(`${lang.toUpperCase()}: ${level}`)
  })
  lines.push('\u00A0')
  
  lines.push('Soft skills:')
    cv.skills.soft_skills.forEach((skill) => {
      lines.push(`${skill}`)
  })

  return { output: lines, isError: false }
}