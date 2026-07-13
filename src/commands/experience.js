export function experienceCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['experience does not take arguments. Try: experience'],
      isError: true,
    }
  }

  return {
    output: [
      'Experience',
      '-----',
      'Service Desk Specialist at Embedit, Brno, Czech Republic (2024)',
      'DevOps Engineer Trainee at Hackihub, Brno, Czech Republic (2026)',
    ],
    isError: false,
  }
}