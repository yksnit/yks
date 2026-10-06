#!/usr/bin/env node

// Edit this object to change what `npx yks` prints.
const details = {
  name: "Yash Kumar Sharma",
  bio: "",
  links: [
    ["GitHub", "https://github.com/yksnit"],
    ["LinkedIn", "https://www.linkedin.com/in/yash-kumar-sharma/"],
  ],
};

const color = (code) => (text) => `\x1b[38;5;${code}m${text}\x1b[0m`;
const border = color(51);
const title = color(213);
const body = color(105);
const label = color(93);
const link = color(39);

const visibleLength = (text) => text.replace(/\x1b\[[0-9;]*m/g, "").length;

function wrap(text, width) {
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (line && (line + " " + word).length > width) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function render() {
  const maxWidth = Math.min((process.stdout.columns || 80) - 6, 72);
  const labelWidth = Math.max(...details.links.map(([name]) => name.length)) + 1;

  const linkLines = details.links.map(
    ([name, url]) => `${label((name + ":").padEnd(labelWidth))}  ${link(url)}`
  );
  const width = Math.min(
    maxWidth,
    Math.max(details.name.length, ...linkLines.map(visibleLength))
  );
  const bioLines = wrap(details.bio, width).map(body);

  const pad = (text) => text + " ".repeat(Math.max(0, width - visibleLength(text)));
  const row = (text) => `  ${border("│")} ${pad(text)} ${border("│")}`;
  const rule = (left, right) => `  ${border(left + "─".repeat(width + 2) + right)}`;

  console.log(
    [
      "",
      rule("╭", "╮"),
      row(title(details.name)),
      ...(bioLines.length ? [row(""), ...bioLines.map(row)] : []),
      rule("├", "┤"),
      ...linkLines.map(row),
      rule("╰", "╯"),
      "",
    ].join("\n")
  );
}

render();
