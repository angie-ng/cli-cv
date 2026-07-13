# CLI CV TODO

## 1) JSON Data Source
- [ ] Finish all command handlers to read from `cv.json`
- [ ] Remove remaining hardcoded content from command files
- [ ] Keep naming consistent everywhere (`experience` command/key/file)

## 2) Help + Command Consistency
- [ ] Keep `help` aligned with actually implemented commands
- [ ] Split `help` output into **Basic** vs **Advanced**
- [ ] Add short usage hints for each command

## 3) Output Formatting Polish
- [ ] Improve spacing between sections/entries
- [ ] Keep bullets consistently indented
- [ ] Add visual output types (e.g. title, role, bullet, muted)
- [ ] Highlight role lines (color or semi-bold style)
- [ ] Verify contrast/readability in terminal theme

## 4) Language Switching
- [ ] Decide JSON structure for multilingual content (`cs` / `en`)
- [ ] Add command `lang <cs|en>`
- [ ] Ensure all command outputs respect active language

## 5) History Navigation
- [ ] Add command history buffer (separate from output history)
- [ ] Implement ArrowUp / ArrowDown recall in input
- [ ] Handle boundary states correctly

## 6) Tab Completion
- [ ] Add `Tab` completion for command names
- [ ] Add suggestions when multiple matches exist
- [ ] (Later) extend completion to arguments

## 7) Advanced Commands
- [ ] Add `open <name>` command and map known links
- [ ] Add `ls`, `cat`, `pwd` (and optionally `cd`)
- [ ] Integrate advanced commands with same `cv.json` source

## 8) UX Cleanup
- [ ] Remove fake window controls (`_ [] X`) if non-functional
- [ ] Fine-tune spacing and responsive layout
- [ ] Optional: add `theme` command for light/dark terminal modes

## 9) Quality / Stability
- [ ] Add basic tests for command dispatcher
- [ ] Add tests for key commands (`help`, `experience`, `clear`)
- [ ] Cover edge cases (unknown command, extra args, empty values)

## Next Session Priority
- [ ] Finalize JSON-driven commands first
- [ ] Then implement language switching
- [ ] Then ArrowUp history
- [ ] Then Tab completion
