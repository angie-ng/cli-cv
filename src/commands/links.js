import cv from '../data/cv.json'

export function linksCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['links does not take arguments. Try: links'],
      isError: true,
    }
  }

  const { github, linkedin } = cv.contact

  return {
    output: [
      'Links',
      '-----',
      `GitHub:   ${github}`,
      `LinkedIn: ${linkedin}`,
    ],
    isError: false,
  }
}
