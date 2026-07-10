export function bonusInfoCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['bonus-info does not take arguments. Try: bonus-info'],
      isError: true,
    }
  }

  return {
    output: [
      'Bonus Info',
      '-----',
      'I like languages, attending polyglot conferences.',
      'I have my own vocal ensemble specialized for early music.',
      'I play badminton and table tennis.',
    ],
    isError: false,
  }
}