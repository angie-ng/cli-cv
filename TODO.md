# CLI CV TODO

## 1) JSON Data Source

- [x] Finish all command handlers to read from `cv.json`
- [x] Remove remaining hardcoded content from command files
- [x] Keep naming consistent everywhere (`experience` command/key/file)

## 2) Help + Command Consistency

- [x] Keep `help` aligned with actually implemented commands
- [x] Split `help` output into **Basic** vs **Advanced**
- [x] Add short usage hints for each command

## 3) Output Formatting Polish

- [x] Improve spacing between sections/entries
- [x] Add visual output types (e.g. title, role, bullet, muted)
- [x] Highlight role lines (color or semi-bold style)
- [x] Verify contrast/readability in terminal theme

## 4) Language Switching

- [x] Decide JSON structure for multilingual content (`cz` / `en`)
- [x] Add option --lang for displaying output in other languages
- [x] Ensure all command outputs use --lang for their output
- [x] Add `fr` / `de` / `it` content packs and localize output headings

## 5) History Navigation

- [x] Add command history buffer (separate from output history)
- [x] Implement ArrowUp / ArrowDown recall in input
- [x] Handle boundary states correctly - how arrows behave when the history is empty or full

## 6) Tab Completion

- [x] Add `Tab` completion for command names
- [x] Extend completion to arguments

## 7) Advanced Commands

- [x] Add `openlink <name, project id, URL>`, openlink without argument lists command and map known links
- [x] Add `ls`, `cat`, `pwd` (and optionally `cd`) and flags
- [x] Integrate advanced commands with same `cv.json` source
- [x] Decide how to implement `ls/cat/cd/pwd`:
  - [x] real virtual navigation over CV sections - decided for this one

## 8) UX Cleanup

- [x] Replace fake window controls (`_ [] X`) with maximize / restore
- [x] Fine-tune spacing and responsive layout, changeable size of terminal
- [x] Auto-scroll down after command submit
- [x] Refocus input after submit

## 9) Quality / Stability

- [x] Cover edge cases (unknown command, extra args, empty values)

## 10) Documentation

- [x] Replace default Vite README with project README:
  - [x] What the project is
  - [x] How to run it
  - [x] Available commands
  - [x] Command history and its limits, info about tab and arrows

## 11) Nice-to-have (Optional)

- [x] Blinking cursor in prompt
- [ ] Funny error message when user types "sudo"
