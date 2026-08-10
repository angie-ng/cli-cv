import cv from '../data/cv.json'

export function contactCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['contact does not take arguments. Try: contact'],
      isError: true,
    }
  }

  const { email, linkedin, github } = cv.contact

  return {
    output: [
      'Contact',
      '-------',
      `Email:    ${email}`,
      `LinkedIn: ${linkedin}`,
      `GitHub:   ${github}`,
    ],
    isError: false,
  }
}
