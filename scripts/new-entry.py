#!/usr/bin/env python3
"""Create the next entry page and refresh homepage cards.

Usage:
  python3 scripts/new-entry.py
  python3 scripts/new-entry.py --title "morning walk" --desc "walked to the river"
  python3 scripts/new-entry.py --sync
"""

from __future__ import annotations

import argparse
import html
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENTRIES_DIR = ROOT / "entries"
INDEX = ROOT / "index.html"
TEMPLATE = ENTRIES_DIR / "entry-template.html"
ENTRY_NAME = re.compile(r"entry-(\d+)\.html$")
GRID_START = "<!-- entry-grid:start -->"
GRID_END = "<!-- entry-grid:end -->"


def entry_files() -> list[tuple[int, Path]]:
    found = []
    for path in ENTRIES_DIR.glob("entry-*.html"):
        match = ENTRY_NAME.match(path.name)
        if match:
            found.append((int(match.group(1)), path))
    return sorted(found)


def read_meta(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    desc = first(r'<meta\s+name="entry-desc"\s+content="([^"]*)"', text)
    title = first(r"<h1>(.*?)</h1>", text, flags=re.S)
    if not title:
        title = first(r"<title>(.*?)</title>", text, flags=re.S)
    if not desc:
        desc = first(r"<div class=\"body\">\s*<p>(.*?)</p>", text, flags=re.S)
    title = collapse(title) or path.stem
    desc = collapse(desc)
    return {"title": title, "desc": desc}


def first(pattern: str, text: str, flags: int = 0) -> str:
    match = re.search(pattern, text, flags)
    return match.group(1) if match else ""


def collapse(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def card_html(number: int, meta: dict[str, str]) -> str:
    label = f"{number:03d}"
    title = html.escape(meta["title"], quote=True)
    desc = html.escape(meta["desc"], quote=True)
    desc_block = f'\n        <div class="desc">{desc}</div>' if desc else ""
    return (
        f'      <a class="entry-card" href="entries/entry-{label}.html">\n'
        f'        <div class="tag">entry {label}</div>\n'
        f'        <div class="title">{title}</div>'
        f"{desc_block}\n"
        f"      </a>"
    )


def sync_index() -> None:
    cards = []
    for number, path in reversed(entry_files()):
        cards.append(card_html(number, read_meta(path)))
    grid = "\n\n".join(cards)
    original = INDEX.read_text(encoding="utf-8")
    if GRID_START not in original or GRID_END not in original:
        raise SystemExit(f"index.html needs {GRID_START} and {GRID_END} markers")
    updated = re.sub(
        re.escape(GRID_START) + r".*?" + re.escape(GRID_END),
        f"{GRID_START}\n{grid}\n      {GRID_END}",
        original,
        count=1,
        flags=re.S,
    )
    INDEX.write_text(updated, encoding="utf-8")


def next_number() -> int:
    existing = entry_files()
    return (existing[-1][0] + 1) if existing else 1


def create_entry(title: str, desc: str, entry_date: str) -> Path:
    number = next_number()
    label = f"{number:03d}"
    dest = ENTRIES_DIR / f"entry-{label}.html"
    if dest.exists():
        raise SystemExit(f"{dest.name} already exists")
    if not TEMPLATE.exists():
        raise SystemExit(f"missing template: {TEMPLATE}")
    page = (
        TEMPLATE.read_text(encoding="utf-8")
        .replace("{{NUM}}", label)
        .replace("{{TITLE}}", title)
        .replace("{{DESC}}", desc)
        .replace("{{DATE}}", entry_date)
    )
    dest.write_text(page, encoding="utf-8")
    return dest


def default_date() -> str:
    return date.today().strftime("%B %Y").lower()


def main() -> None:
    parser = argparse.ArgumentParser(description="Add an entry page and update the homepage grid.")
    parser.add_argument("--title", default="title", help="entry heading and card title")
    parser.add_argument("--desc", default="short description for the homepage card", help="homepage card blurb")
    parser.add_argument("--date", default=default_date(), help='date line, e.g. "august 2026"')
    parser.add_argument("--sync", action="store_true", help="only rebuild homepage cards from existing pages")
    args = parser.parse_args()

    if not args.sync:
        path = create_entry(args.title, args.desc, args.date)
        print(f"created {path.relative_to(ROOT)}")
        print("edit that file, then run: python3 scripts/new-entry.py --sync")
    sync_index()
    print("updated index.html")


if __name__ == "__main__":
    main()
