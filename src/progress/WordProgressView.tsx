import { Popover } from "radix-ui"
import { WordProgress } from "./Progress"
import { cn } from "@/lib/utils"
import { HintView } from "@/story/HintView"
import { wrapClick } from "@/util/wrapClick"
import { useDisplayWord } from "@/dictionary/useDisplayWord"

interface Props {
  word: WordProgress
  selected: boolean
  setSelected: (word: WordProgress | null) => void
  className?: string
}

export function WordProgressView({
  word,
  selected,
  setSelected,
  className,
}: Props) {
  const toDisplay = useDisplayWord()
  const displayWord = toDisplay(word.word)

  const onClick = wrapClick(() => {
    if (selected) {
      setSelected(null)
    } else {
      setSelected(word)
    }
  })

  if (!selected) {
    return (
      <span onClick={onClick} className={cn(className)}>
        {displayWord}
      </span>
    )
  }

  return (
    <Popover.Root open={selected}>
      <Popover.Anchor asChild>
        <span onClick={onClick} className={cn(className)}>
          {displayWord}
        </span>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          sideOffset={5}
          collisionPadding={20}
          className="focus:outline-none"
        >
          <HintView word={word.word} />
          <Popover.Arrow className="fill-neutral-700" width={15} height={8} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
