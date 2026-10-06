#!/usr/bin/env node

const readline = require("readline");
const { spawn } = require("child_process");

// Edit this object to change what `npx yks` prints.
const details = {
  name: "Yash Kumar Sharma",
  bio: "",
  email: "yks.nit@gmail.com",
  links: [
    ["GitHub", "https://github.com/yksnit"],
    ["LinkedIn", "https://www.linkedin.com/in/yash-kumar-sharma/"],
  ],
};

const banner = [
  "██╗   ██╗██╗  ██╗███████╗",
  "╚██╗ ██╔╝██║ ██╔╝██╔════╝",
  " ╚████╔╝ █████╔╝ ███████╗",
  "  ╚██╔╝  ██╔═██╗ ╚════██║",
  "   ██║   ██║  ██╗███████║",
  "   ╚═╝   ╚═╝  ╚═╝╚══════╝",
];

const out = process.stdout;
const interactive = out.isTTY && process.stdin.isTTY;
const useColor = out.isTTY && !("NO_COLOR" in process.env);

const color = (code) => (text) => (useColor ? `\x1b[38;5;${code}m${text}\x1b[0m` : text);
const border = color(51);
const title = color(213);
const body = color(105);
const label = color(93);
const link = color(39);
const dim = color(244);
const pointer = color(213);
const ok = color(84);

const gradient = [51, 45, 39, 33, 63, 99, 135, 171, 207, 213];
const visibleLength = (text) => text.replace(/\x1b\[[0-9;]*m/g, "").length;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, interactive ? ms : 0));

function wrap(text, width) {
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
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

function renderBanner(indent) {
  const width = banner[0].length;
  return banner.map(
    (line) =>
      " ".repeat(indent) +
      [...line]
        .map((ch, x) => color(gradient[Math.floor((x / width) * gradient.length)])(ch))
        .join("")
  );
}

function renderCard() {
  const maxWidth = Math.min((out.columns || 80) - 6, 72);
  const rows = [...details.links];
  if (details.email) rows.push(["Email", details.email]);
  const labelWidth = Math.max(...rows.map(([name]) => name.length)) + 1;

  const linkLines = rows.map(
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

  return [
    rule("╭", "╮"),
    row(title(details.name)),
    ...(bioLines.length ? [row(""), ...bioLines.map(row)] : []),
    rule("├", "┤"),
    ...linkLines.map(row),
    rule("╰", "╯"),
  ];
}

function openTarget(target) {
  const [cmd, args] =
    process.platform === "darwin"
      ? ["open", [target]]
      : process.platform === "win32"
      ? ["cmd", ["/c", "start", "", target]]
      : ["xdg-open", [target]];
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: "ignore", detached: true });
    child.on("error", () => resolve(false));
    child.on("spawn", () => {
      child.unref();
      resolve(true);
    });
  });
}

function menu(items) {
  return new Promise((resolve) => {
    let selected = 0;
    let status = dim("↑/↓ to move · enter to select · q to quit");
    let drawn = false;

    const draw = () => {
      if (drawn) out.write(`\x1b[${items.length + 2}A`);
      drawn = true;
      items.forEach((item, i) => {
        const line =
          i === selected ? `${pointer("❯")} ${title(item.label)}` : `  ${dim(item.label)}`;
        out.write(`\x1b[2K  ${line}\n`);
      });
      out.write(`\x1b[2K\n\x1b[2K  ${status}\n`);
    };

    const finish = () => {
      process.stdin.removeListener("keypress", onKey);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      out.write("\x1b[?25h");
      resolve();
    };

    const choose = async (i) => {
      const item = items[i];
      if (!item.target) return finish();
      status = (await openTarget(item.target))
        ? ok(`✓ Opening ${item.done}`)
        : `Couldn't open a browser. Here's the link: ${link(item.target)}`;
      draw();
    };

    const onKey = (str, key = {}) => {
      if ((key.ctrl && key.name === "c") || key.name === "escape" || str === "q") return finish();
      if (key.name === "up" || str === "k") selected = (selected + items.length - 1) % items.length;
      else if (key.name === "down" || str === "j") selected = (selected + 1) % items.length;
      else if (key.name === "return") return choose(selected);
      else if (/^[1-9]$/.test(str || "") && Number(str) <= items.length) {
        selected = Number(str) - 1;
        draw();
        return choose(selected);
      } else return;
      draw();
    };

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("keypress", onKey);
    out.write("\x1b[?25l");
    draw();
  });
}

async function main() {
  const card = renderCard();
  const indent = Math.max(2, Math.floor((visibleLength(card[0]) - banner[0].length) / 2));

  out.write("\n");
  for (const line of renderBanner(indent)) {
    out.write(line + "\n");
    await sleep(40);
  }
  out.write("\n");
  for (const line of card) {
    out.write(line + "\n");
    await sleep(30);
  }
  out.write("\n");

  if (!interactive) return;

  await menu([
    ...details.links.map(([name, url]) => ({
      label: `Open my ${name}`,
      target: url,
      done: name,
    })),
    ...(details.email
      ? [{ label: "Send me an email", target: `mailto:${details.email}`, done: "your mail app" }]
      : []),
    { label: "Quit" },
  ]);
  out.write(`\n  ${dim("Thanks for stopping by! 👋")}\n\n`);
}

process.on("exit", () => out.isTTY && out.write("\x1b[?25h"));
main();
