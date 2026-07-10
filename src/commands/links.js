export function linksCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['links does not take arguments. Try: links'],
      isError: true,
    }
  }

  return {
    output: [
      'Links',
      '-----',
      'GitHub: https://github.com/angie-ng',
      'LinkedIn: https://www.linkedin.com/in/angelika-viktorinova/',
    ],
    isError: false,
  }
}