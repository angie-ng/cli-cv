export function projectsCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['projects does not take arguments. Try: projects'],
      isError: true,
    }
  }

  return {
    output: [
      'Projects',
      '-----',
      'Dafneapp: dafneapp.eu',
      'Altezza diversa website: www.altezzadiversa.cz',
    ],
    isError: false,
  }
}