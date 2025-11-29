import { Word } from "@/dictionary/Word";
import { ParsedId, ParsedWord, Story } from "./Story";
import { dict } from "@/dictionary/Dictionary";
import { ParsedStory } from "./ParsedStory";

async function parseLine(line: string): Promise<Word[]> {
  return dict.segment(line.trim());
}

async function parseContent(content: string): Promise<Word[][]> {
  const rawLines = content
    .split("\n")
    .filter((line) => line.trim().length > 0);
  return Promise.all(rawLines.map(line => parseLine(line)));
}

export async function parseStory(story: Story): Promise<ParsedStory> {
  let iWord = 0;

  const parsedTitle: ParsedWord[] = (await parseLine(story.title)).map((word) => {
    iWord += 1;
    return {
      parsedId: iWord as ParsedId,
      word,
    };
  });

  const parsedContent: ParsedWord[][] = (await parseContent(story.content)).map((line =>
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