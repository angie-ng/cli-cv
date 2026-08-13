/**
 * Fake rm/rmdir: never deletes anything, just plays a timed joke.
 * Arguments are ignored on purpose (rm -rf, rmdir foo, ...).
 */
export function rmCommand() {
  return {
    action: 'delayed',
    steps: [
      {
        text: 'Okay, I am deleting everything from your computer...',
        isError: true,
        delayMs: 0,
      },
      {
        text: '...',
        isError: true,
        delayMs: 1500,
      },
      {
        text: "I am just kidding. But please, don't delete me!",
        isError: false,
        delayMs: 2000,
      },
    ],
  }
}
