/**
 * Fake sudo: reader has no root. Immediate message, like the cd jail.
 * Arguments are ignored (sudo ls, sudo rm -rf /, ...).
 */
export function sudoCommand() {
  return {
    output: [
      "I see you know your way around. But no, sudo won't help you either! Please don't try that again.",
    ],
    isError: true,
  }
}
