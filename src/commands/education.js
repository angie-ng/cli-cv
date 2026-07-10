export function educationCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['education does not take arguments. Try: education'],
      isError: true,
    }
  }

  return {
    output: [
      'Education',
      '-----',
      'Masaryk University, Brno, Czech Republic (2015)',
    ],
    isError: false,
  }
}