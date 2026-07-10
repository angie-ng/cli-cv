export function skillsCommand(args = []) {
  if (args.length > 0) {
    return {
      output: ['skills does not take arguments. Try: skills'],
      isError: true,
    }
  }

  return {
    output: [
      'Skills',
      '-----',
      'Linux, Docker, Kubernetes, CI/CD, Git, Linux, Bash, Python, Ansible, Terraform, Prometheus, Grafana',
      'communication, proactivity'
    ],
    isError: false,
  }
}