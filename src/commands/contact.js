export function contactCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['contact does not take arguments. Try: contact'],
      isError: true,
    }
  }

  return {
    output: [
      'Contact',
      '-----',
      'Email: angelika.viktorinova@seznam.cz',
      'Phone: +420 721 500 320',
    ],
    isError: false,
  }
}