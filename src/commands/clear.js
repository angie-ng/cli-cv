export function clearCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['clear does not take arguments. Try: clear'],
      isError: true,
    }
  }

  return {
    action: 'clear',
    output: [],
    isError: false,
  }
}