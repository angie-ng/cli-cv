export function aboutCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['about does not take arguments. Try: about'],
      isError: true,
    }
  }

  return {
    output: [
      'About',
      '-----',
      'My name is Angelika Viktorinova and I am a Junior DevOps Engineer.',
      'I love to learn new technologies and improve my skills in the field of DevOps.',
      'I am based in Brno.',
    ],
    isError: false,
  }
}