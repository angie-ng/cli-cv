import cv from '../data/cv.json'

export function projectsCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['projects does not take arguments. Try: projects'],
      isError: true,
    }
  }

  const lines = ['Projects', '-----']

  cv.projects.forEach((project) => {
      lines.push(project.name)
      if (project.description) {
        lines.push('Description:')
        project.description.forEach((desc) => {
          lines.push(`  • ${desc}`)
        })
      }
      if (project.stack) {
        lines.push('Technology stack:')
        project.stack.forEach((tech) => {
          lines.push(`  • ${tech}`)
        })
      }
      if (project.focus) {
        lines.push('Focus:')
        project.focus.forEach((item) => {
          lines.push(`  • ${item}`)
        })
      }
      if (project.method) {
        lines.push(`Method: ${project.method}`)
      }
      if (project.repository) {
        lines.push(`Link: ${project.repository}`)
      }
      lines.push('\u00A0')
    })
  
  if (lines[lines.length - 1] === '\u00A0') {
      lines.pop()
    }

  return { output: lines, isError: false}
}