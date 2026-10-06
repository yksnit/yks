# yks

My business card, right in your terminal.

```bash
npx yks
```

```
                   ██╗   ██╗██╗  ██╗███████╗
                   ╚██╗ ██╔╝██║ ██╔╝██╔════╝
                    ╚████╔╝ █████╔╝ ███████╗
                     ╚██╔╝  ██╔═██╗ ╚════██║
                      ██║   ██║  ██╗███████║
                      ╚═╝   ╚═╝  ╚═╝╚══════╝

  ╭───────────────────────────────────────────────────────────╮
  │ Yash Kumar Sharma                                         │
  ├───────────────────────────────────────────────────────────┤
  │ GitHub:    https://github.com/yksnit                      │
  │ LinkedIn:  https://www.linkedin.com/in/yash-kumar-sharma/ │
  │ Email:     yks.nit@gmail.com                              │
  ╰───────────────────────────────────────────────────────────╯

  ❯ Open my GitHub
    Open my LinkedIn
    Send me an email
    Quit

  ↑/↓ to move · enter to select · q to quit
```

Use the arrow keys (or `j`/`k`, or the number keys) to open a link in your browser or start an email. Press `q` or `Esc` to leave.

It has no dependencies, so `npx` starts it instantly. It needs Node.js 14 or later. When the output is piped (`npx yks | cat`), it just prints the card. It also respects [`NO_COLOR`](https://no-color.org).

## Make your own

1. Fork this repo.
2. Edit the `details` object at the top of [`index.js`](index.js): your name, an optional bio, your email and any links. The box and menu adjust to fit.
3. Replace the `banner` lines with your own initials. [patorjk.com/software/taag](https://patorjk.com/software/taag/#p=display&f=ANSI%20Shadow) with the "ANSI Shadow" font gives the same style.
4. Change `name` and `bin` in [`package.json`](package.json) to a package name that's free on npm.
5. Run `node index.js` to preview it, then `npm login` and `npm publish`.
