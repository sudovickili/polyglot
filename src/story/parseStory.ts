import { Word } from "@/dictionary/Word";
import { Story } from "./Story";
import { dict } from "@/dictionary/Dictionary";
import { ParsedId, ParsedStory, ParsedWord } from "./ParsedStory";

function parseLine(line: string): Word[] {
  return dict.segment(line);
}

function parseContent(content: string): Word[][] {
  const rawLines = content
    .split("\n")
    .filter((line) => line.trim().length > 0);
  return rawLines.map(line => parseLine(line));
}

export function parseStory(story: Story): ParsedStory {
  let iWord = 0;

  const parsedTitle: ParsedWord[] = parseLine(story.title).map((word) => {
    iWord += 1;
    return {
      parsedId: iWord as ParsedId,
      word,
    };
  });

  const parsedContent: ParsedWord[][] = parseContent(story.content).map((line =>
    line.map((word) => {
      iWord += 1;
      return {
        parsedId: iWord as ParsedId,
        word,
      };
    })
  ));

  return {
    story,
    parsedTitle,
    parsedContent,
    parsedAll: [
      ...parsedTitle,
      ...parsedContent.flat()
    ]
  };
}