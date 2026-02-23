import type { ParserRules, SelectorGroup } from "./plugin";

export type ParsedListItem = {
  title: string;
  url: string;
  cover: string | null;
  latest: string | null;
};

export type ParsedDetail = {
  title: string | null;
  synopsis: string | null;
  cover: string | null;
  genres: string | null;
  status: string | null;
  chapters: { title: string; url: string }[];
};

export type ParsedWatchReadItem = {
  label: string;
  url: string;
};

function normalizeText(input: string): string {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getClassName(selector: string): string | null {
  const match = selector.match(/\.([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function findBlocksByClass(html: string, className: string): string[] {
  const blocks: string[] = [];
  const pattern = new RegExp(
    `<([a-zA-Z0-9]+)[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/\\1>`,
    "g",
  );
  let match: RegExpExecArray | null = pattern.exec(html);
  while (match) {
    blocks.push(match[0]);
    match = pattern.exec(html);
  }
  return blocks;
}

function extractBySelector(block: string, selector: string): string | null {
  const [selectorPart, attr] = selector.split("@");
  const trimmedSelector = selectorPart.trim();
  const className = getClassName(trimmedSelector);
  const tagName = className
    ? "[a-zA-Z0-9]+"
    : trimmedSelector && !trimmedSelector.startsWith(".")
      ? trimmedSelector
      : "[a-zA-Z0-9]+";

  const classConstraint = className
    ? `[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*`
    : "[^>]*";

  if (attr) {
    const attrPattern = new RegExp(
      `<${tagName}${classConstraint}[^>]*\\b${attr}=["']([^"']+)["'][^>]*>`,
      "i",
    );
    const matched = block.match(attrPattern);
    return matched ? matched[1].trim() : null;
  }

  const textPattern = new RegExp(
    `<${tagName}${classConstraint}[^>]*>([\\s\\S]*?)<\\/${tagName}>`,
    "i",
  );
  const matched = block.match(textPattern);
  return matched ? normalizeText(matched[1]) : null;
}

function parseItemBlocks(html: string, rules: SelectorGroup): ParsedListItem[] {
  const itemClass = getClassName(rules.item);
  const blocks = itemClass ? findBlocksByClass(html, itemClass) : [];

  return blocks.map((block) => ({
    title: extractBySelector(block, rules.title) ?? "",
    url: extractBySelector(block, rules.url) ?? "",
    cover: rules.cover ? extractBySelector(block, rules.cover) : null,
    latest: rules.latest ? extractBySelector(block, rules.latest) : null,
  }));
}

export function parseList(html: string, rules: ParserRules["list"]) {
  return parseItemBlocks(html, rules);
}

export function parseSearch(html: string, rules: ParserRules["search"]) {
  return parseItemBlocks(html, rules.selectors);
}

export function parseDetail(html: string, rules: ParserRules["detail"]): ParsedDetail {
  const chapterBlocks =
    rules.chapterContainer && rules.chapterItem
      ? (() => {
          const itemClass = getClassName(rules.chapterItem);
          return itemClass ? findBlocksByClass(html, itemClass) : [];
        })()
      : [];

  return {
    title: extractBySelector(html, rules.title),
    synopsis: extractBySelector(html, rules.synopsis),
    cover: rules.cover ? extractBySelector(html, rules.cover) : null,
    genres: rules.genres ? extractBySelector(html, rules.genres) : null,
    status: rules.status ? extractBySelector(html, rules.status) : null,
    chapters: chapterBlocks.map((block) => ({
      title: rules.chapterTitle ? extractBySelector(block, rules.chapterTitle) ?? "" : "",
      url: rules.chapterUrl ? extractBySelector(block, rules.chapterUrl) ?? "" : "",
    })),
  };
}

export function parseWatchRead(html: string, rules: ParserRules["watchRead"]) {
  const itemClass = getClassName(rules.item);
  const blocks = itemClass ? findBlocksByClass(html, itemClass) : [];

  const parsed: ParsedWatchReadItem[] = blocks.map((block) => ({
    label: extractBySelector(block, rules.label) ?? "",
    url: extractBySelector(block, rules.url) ?? "",
  }));

  return parsed;
}
