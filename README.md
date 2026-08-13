# cli-cv

Interactive CV in the browser: a small terminal that reads from `src/data/cv.json`.

## Run

```bash
npm install
npm run dev
```

Production build: `npm run build`. Preview it with `npm run preview`.

## Commands

Type `help` in the terminal for the live list.

Content commands (`about`, `skills`, `projects`, `experience`, `education`, `contact`, `links`) accept `--lang <code>` (`en`, `cz`, `fr`, `de`, `it`) for displaying the content in a different language. Default is English.

Navigation: `pwd`, `ls`, `cd`, `cat`. Open a known URL with `openlink`.

The command `ls` accepts flags `-l` and `-a`. However, the `-a` is not in listed in the output of help command, because it is an "easter egg" for geeks. This flag works naturally only for listing "directories", not for files.

There are included some special error messages in case the user tries a forbidden command, such as:

```bash
rm
rmdir
rm -rf
cd /
```

## Input

- Up / Down arrows recall previous commands (last 50, this tab only — nothing is saved after reload).
- Tab completes a command name, or a path after `ls` / `cd` / `cat`, when there is exactly one match.
